/**
 * @author zhangvwei
 * @date 2018-07-05 
 */
import React, { Component } from 'react';
import { Button, Tabs, Select, Form, Input, Radio } from 'antd';
import intl from 'react-intl-universal';
import message from 'components/Common/message';
//import 'lib/jquery-ui/jquery-ui';
import './style.scss';

export default class ParameterItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isEdit: this.props.isEdit,
      value: this.props.item ? this.props.item.name : ''
    }
  }

  componentDidMount() {
    if (this.textInput) {
      this.textInput.focus();
    }
  }
  componentDidUpdate() {
    if (this.textInput) {
      this.textInput.focus();
    }
  }
  componentWillReceiveProps(nextProps) {
    // if (nextProps.item != undefined && nextProps.item != null) {
    //   this.setState({ value: nextProps.item.name });
    // }
  }
  editHandle = (e) => {
    e && e.preventDefault();
    this.setState({ isEdit: true });
  }
  inputChange = (e) => {
    let value = e.target.value;
    this.setState({ value });
  }
  inputBlur = (e) => {
    let value = e.target.value;
    if (value == '') {
      // this.setState({ isEdit: false });
      message.warn('参数名称不能为空！');
      return;
    }
    let item = this.props.item;
    if (item) {
      //更新
      let params = { itemId: item.id, itemName: value, weight: item.weight }
      this.props.updateParam && this.props.updateParam(params, () => {
        this.props.getAllParameters();
        message.success('更新成功！');
      }, (msg) => {
        message.warn(msg);
      });
    } else {
      let typeItem = this.props.typeItem;
      let params = { typeName: typeItem.name, itemName: value, weight: typeItem.items.length }
      //添加
      this.props.addParam && this.props.addParam(params, () => {
        this.props.getAllParameters();
        message.success('添加成功！');
      }, (msg) => {
        message.warn(msg);
      });
    }

    // this.setState({ value, isEdit: false });
  }
  setInputRef = element => {
    this.textInput = element;
  }
  cancelAdd = (e) => {
    e.preventDefault();
    if (this.props.item) {
      this.setState({ isEdit: false, value: this.props.item.name });
    } else {
      this.props.cancelAdd && this.props.cancelAdd();
    }
    // this.setState({ isEdit: false });
  }
  delHandle = (e) => {
    e.preventDefault();
    let item = this.props.item;
    if (item) {
      let param = { itemId: item.id };
      this.props.delParam && this.props.delParam(param, () => {
        this.props.getAllParameters();
        message.success('删除成功！');
      }, (msg) => {
        message.warn(msg);
      });
    }
  }
  render() {
    let editable = this.props.editable;
    let item = this.props.item;
    // let value = this.state.value;
    let isEdit = this.state.isEdit;
    return (
      <div className='parameter-item'>
        {editable ?
          <div className='editable-item'>
            {isEdit ?
              <div className='edit'>
                <input defaultValue={item && item.name} onChange={this.inputChange} onBlur={this.inputBlur} ref={this.setInputRef} />
                <a href='#' className='cancel' onMouseDown={this.cancelAdd}><i className="icon iconfont">&#xe60d;</i></a>
              </div> :
              <div className='show'>
                <span className='content'>{item && item.name}</span>
                <span className='opt-btn'>
                  <a href='#' onClick={this.editHandle}><i className="icon iconfont">&#xe616;</i></a>
                  <a href='#' onClick={this.delHandle}><i className="icon iconfont">&#xe617;</i></a>
                </span>
              </div>
            }
          </div> :
          <div className='uneditable-item'>
            {item && item.name}
          </div>
        }
      </div>
    );
  }
}
