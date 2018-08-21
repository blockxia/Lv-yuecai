
import React from 'react';
import Config from 'config';
import './style.scss'
const url_prefix = Config.env[Config.scheme].prefix;
class MyRichEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorContent: this.props.value
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.canEdit !== nextProps.canEdit) {
      myEditor.$textElem.attr('contenteditable', nextProps.canEdit);
      //myEditor.txt.html('')
    }
    this.setState({ editorContent: nextProps.value });
    if (nextProps.clear) {
      myEditor.txt.html('')
      this.props.clearCallBack()
    }
    if (nextProps.jumpClear) {
      myEditor.txt.html('')
      this.props.jumpClearCallBack()
    }
  }
  componentDidMount() {
    let _this= this;
    const E = window.wangEditor;
    const elem = this.props.id ? this.refs[this.props.id] : this.refs.editorElem
    const editor = new E(elem)
    window.myEditor = editor
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    let customConfig = {
      onchange: html => {
        this.setState({
          editorContent: html
        }, () => {
          this.props.onChange(html)
        })
      },
      zIndex: 100,
      uploadImgServer: `${url_prefix}${this.props.imgUpload}`,
      debug: true,
      uploadImgParams: this.props.uploadImgParams
    }
    editor.customConfig = customConfig;
    editor.customConfig.onfocus = function () {
      let html = window.myEditor.txt.html()
      // ?console.log("onfocus",html)
      if(html.replace(/<(?:.|\s)*?>/g, "") == '请填写详细内容'){
        window.myEditor.txt.html('')
        _this.props.onChange('')
      }
  }
    editor.create();
    // debugger
    editor.txt.html(this.state.editorContent || this.props.defaultValue)
    myEditor.$textElem.attr('contenteditable', this.props.canEdit)
  }
  componentDidUpdate() {
    // window.myEditor.txt.html(this.state.editorContent)
    // window.myEditor.txt.html(this.props.value||this.props.defaultValue)
    // editor.txt.html(this.props.value||this.props.defaultValue)
  }
  render() {
    return (
      <div id="rich_editor_container" ref={this.props.id ? this.props.id : "editorElem"}></div>
    )
  }
}

export default MyRichEditor;