/**
 * @authors wangqinqin
 * @date    2018-08-15
 * @module  提示弹窗
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Config from 'config';
import { Form, Button, Input, Select, Table, Popover, Checkbox, Radio } from 'antd';
import { message } from 'components/Common/message';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BaseComponent from 'components/Public/BaseComponent';
import Modal from 'components/Common/Modal';
import './style.scss';

export default class DialogTips extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }
  /**
  * 首页实例化
  */
  componentDidMount() {
  }

  /**
  * 创建DOM
  */
  createDom = () => {
    const { children } = this.props;
    let wrapClassName = this.props.wrapClassName ? `${this.props.wrapClassName} common-modal-dialog` : 'common-modal-dialog';
    return (
      <div className="dialogTips-pop">
        {this.props.visible ? <Modal
          type="success"
          visible={this.props.visible}
          title={this.props.title}
          wrapClassName={wrapClassName}
          maskClosable={false}
          onOk={this.props.onOk}
          onCancel={this.props.onCancel}
        >
          <div
            className=""
          >
            {this.props.content}
          </div>
        </Modal> : null}
      </div>
    );
  }
  render() { return (<div> {this.createDom()} </div>); }
}

