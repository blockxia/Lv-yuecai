/**
 * @author litengfei
 * @date 2017-08-21 
 * @requires https://ant.design  Switch
 * @module 前端通用组件->Switch
 */
import React, { Component } from 'react';
import {Switch as AntdSwitch} from 'antd';
import './style.scss';

export default class Switch extends AntdSwitch {
  constructor(props, context){
    super(props, context);
  }
}
