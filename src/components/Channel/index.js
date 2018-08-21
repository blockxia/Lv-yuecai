/**
 * @authors zhangwei
 * @date    2018-03-31
 * @module  合作渠道
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GetChannelList, UpdateChannel, AddChannel } from '../../actions/channel.js';
import Divider, { Form, Icon, Input, Button, Tooltip } from 'antd';
import Message from 'components/Common/message';
import './style.scss';

class Channel extends Component {
  constructor(props, context) {
    super(props, context);
    let channel = this.props.channel;
    //是否是新增
    let addChannel = channel.addChannel;
    let channelName = channel.channelName;
    let showChannelName = '';
    if (channelName) {
      if (channelName.length > 3) {
        showChannelName = channelName.substring(0, 3) + '...';
      } else {
        showChannelName = channelName;
      }
    }
    this.state = {
      isEdit: addChannel === true,
      showChannelName,
      copyChannelName: channelName,
      channel
    }
  }

  componentDidMount() {
    if (this.textInput) {
      this.textInput.focus();
    }
  }

  onBLurHandler = (e) => {
    const _this = this;
    if (e.target.value == '') {
      Message.error('渠道名称不能为空');
      return;
    }
    const channel = _this.state.channel;
    let params = {};
    if (!channel.addChannel) {
      params = { id: channel.id, channelName: channel.channelName }
      this.props.UpdateChannel(params, this.operateChannelCallback);
    } else {
      params = { channelName: channel.channelName }
      this.props.AddChannel(params, this.operateChannelCallback);
    }
  }
  //更新回调
  operateChannelCallback = () => {
    const _this = this;
    if (this.state.channel.addChannel) {
      Message.success('添加成功！');
    } else {
      Message.success('配置成功！');
      this.setState({ isEdit: false });
    }
    _this.props.GetChannelList();
  }
  //取消新增
  cancelAdd = () => {
    this.props.cancelAdd();
  }
  componentDidUpdate() {
    if (this.textInput) {
      this.textInput.focus();
    }
  }
  // componentWillReceiveProps(props) {
  //   console.log('props', props);
  // }
  setInputRef = element => {
    this.textInput = element;
  }
  edit = () => {
    this.setState({ isEdit: true });
  }
  inputChange = (e) => {
    let value = e.target.value;
    if (value.length > 50) {
      Message.error('合作渠道名称不能超过50个字符！');
      this.setState({ channel: this.state.channel, showChannelName: this.state.showChannelName });
      return;
    }
    //更新channelName
    this.state.channel.channelName = value;
    //更新省略channelName
    this.state.showChannelName = value.length > 3 ? value.substring(0, 3) + '...' : value;
    this.setState({ channel: this.state.channel, showChannelName: this.state.showChannelName });
  }
  render() {
    let channel = this.state.channel;
    let showChannelName = this.state.showChannelName;
    let channelName = this.state.channel.channelName;
    let channelId = this.state.channel.channelId;
    let isEdit = this.state.isEdit;
    return (
      <div className='Partner-item'>
        <div className='container'>
          {
            isEdit ? <div className='edit'>
              <input placeholder='输入渠道名称' onBlur={this.onBLurHandler} value={channelName} onChange={this.inputChange} ref={this.setInputRef} />
              {this.state.channel.addChannel && <a href='#' onMouseDown={this.cancelAdd}>
                <i className='i-icon'>&#xe63b;</i>
              </a>}
            </div> :
              <Tooltip title={channelName}><div className='show'>
                {showChannelName}
                <a href='#' onClick={this.edit}>
                  <i className='i-icon'>&#xe6bc;</i>
                </a>
              </div>
              </Tooltip>
          }
        </div>
      </div>
    );
  }
}



function mapDispatchToProps(dispatch) {
  return {
    GetChannelList: bindActionCreators(GetChannelList, dispatch),
    UpdateChannel: bindActionCreators(UpdateChannel, dispatch),
    AddChannel: bindActionCreators(AddChannel, dispatch)
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Channel)