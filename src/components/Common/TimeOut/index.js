/**
 * @author litengfei
 * @date 2017-11-26
 * @requires https://ant.design  Modal对话框
 * @module 前端通用组件->超时Modal
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Button from '../Button';
import {Modal as AntdModal} from 'antd';
import './style.scss';

import Config from 'config';
const IMAGES_URL = Config.env[Config.scheme].imagesUrl;
const ENV = process.env.NODE_ENV;
// 图片的路径
const imgPath = ENV === 'dev' ? '/static/images/' : IMAGES_URL;
// 页面使用图标枚举
const imgs = {
  timeout: `${imgPath}timeout.png`,
};
//timeout默认宽度
const DEFAULT_WIDTH = 360;

export default class TimeOut extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
  }

  refresh() {
    window.location.reload();
  }

  render() {
    return (
        <AntdModal
          {...this.props}
          wrapClassName="timeout-cell-dialog"
          footer={null}
          closable={false}
          width={DEFAULT_WIDTH}
        >
          <p>{intl.get('common.refreshTimeoutBtn')}</p>
          <img src={imgs['timeout']}/>
          <Button onClick={this.refresh} type="primary">{intl.get('common.refreshBtn')}</Button>
        </AntdModal>
    );
  }
}
