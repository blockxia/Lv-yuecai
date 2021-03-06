/**
 * @author caoxifeng
 * @requires https://ant.design  Modal对话框
 * @module 前端通用组件->Modal
 */

import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Modal } from 'antd';
import './style.scss';

export default class DeleteConfirm extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {

    };
  }

  render() {

    return (
      <div>
      {this.props.visible?
        <Modal
          type="success"
          visible={this.props.visible}
          width={this.props.width || 420}
          title={this.props.title}
          maskClosable={false}
          wrapClassName={this.props.wrapClassName || "handleDel-modal"}
          onCancel={this.props.onCancel}
          onOk={this.props.onOk}
          className="confirm-delete-modal"
          okText={this.props.okText || intl.get('lv.common.ok')}
          cancelText={this.props.cancelText || intl.get('lv.common.cancel')}
          confirmLoading={this.props.confirmLoading || false}
        >
          <p className="confirm-delete-content">{this.props.contentText}</p>
        </Modal>:''}
      </div>
    );
  }
}
