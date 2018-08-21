/**
 * @author litengfei
 * @date 2017-08-21 
 * @requires https://ant.design  Button
 * @module 前端通用组件->Button
 */
import React, { Component } from 'react';
import {Button as AntdButton} from 'antd';
import './style.scss';

export default class Button extends AntdButton {
  constructor(props, context){
    super(props, context);
  }
}
