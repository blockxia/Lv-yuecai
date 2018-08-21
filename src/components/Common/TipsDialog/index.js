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
    this.state = {};
  }

  render() {
    return (
        <AntdModal
          {...this.props}
          wrapClassName="tips-cell-dialog"
          footer={null}
          closable={false}
          width={'auto'}
        >
          {this.props.children}
        </AntdModal>
    );
  }
}
