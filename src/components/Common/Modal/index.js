/**
 * @author litengfei
 * @date 2017-08-18
 * @requires https://ant.design  Modal对话框
 * @module 前端通用组件->Modal
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import {Modal as AntdModal} from 'antd';
import './style.scss';
//Modal默认宽度
const DEFAULT_WIDTH = 450;

export default class Modal extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      confirmLoading: false,
    };
  }

  cancelLoading = () => {
    this.setState({
      confirmLoading: false,
    });
  }  

  onOk = () => {
    this.setState({
      confirmLoading: true,
    });
    this.props.onOk(this.cancelLoading);
  }

  onCancel = () => {
    this.setState({
      confirmLoading: false,
    });
    this.props.onCancel();
  }

  render() {
    /**
    footer : this.props.footer || null,
    confirmLoading={this.state.confirmLoading}
    getContainer={this.state.getContainer}
     */
    let props = {
      visible : this.props.visible,
      title :  this.props.title || '',
      closable : this.props.closable,
      width : this.props.width || DEFAULT_WIDTH,
      okText : this.props.okText || intl.get('lv.common.ok'),
      cancelText : this.props.cancelText || intl.get('lv.common.cancel'),
      maskClosable : this.props.maskClosable || false,
      style : Object.assign({borderRadius:"3px"}, (this.props.style || {})),
      wrapClassName : this.props.wrapClassName ? `${this.props.wrapClassName} common-modal` : 'common-modal',
      confirmLoading: this.state.confirmLoading || false,
      afterClose : this.props.afterClose || (()=> {}),
      onOk : this.onOk || (()=> {}),
      onCancel : this.onCancel || (()=> {}),
      className:this.props.className
    };
    if(this.props.footer){
      props.footer = this.props.footer;
    }
    if(this.props.footerIsNull){
      props.footer = null;
    }
    return (
        <AntdModal {...props} >
          {this.props.children}
        </AntdModal>
    );
  }
}
