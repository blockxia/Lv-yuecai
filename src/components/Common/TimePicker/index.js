/**
 * @author litengfei
 * @date 2017-08-22 
 * @requires https://ant.design  TimePicker
 * @module 前端通用组件->TimePicker
 */
import React, { Component } from 'react';
import {TimePicker as AntdTimePicker} from 'antd';
import './style.scss';

export default class TimePicker extends AntdTimePicker {
  constructor(props, context){
    super(props, context);
  }
}
