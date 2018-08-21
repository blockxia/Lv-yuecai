/**
 * @author litengfei
 * @date 2017-11-02
 * @requires https://ant.design  Checkbox
 * @module 前端通用组件->Checkbox
 */
import React from 'react';
import {Checkbox as AntdCheckbox} from 'antd';
import './style.scss';

export default class Checkbox extends AntdCheckbox {
  constructor(props, context){
    super(props, context);
  }
}
