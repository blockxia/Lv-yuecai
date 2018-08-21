/**
 * @author litengfei
 * @date 2017-11-02
 * @requires https://ant.design  Radio
 * @module 前端通用组件->Radio
 */
import React from 'react';
import {Radio as AntdRadio} from 'antd';
import './style.scss';

export default class Radio extends AntdRadio {
  constructor(props, context){
    super(props, context);
  }
}
