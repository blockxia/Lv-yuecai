/**
 * @author litengfei
 * @date 2017-11-30 
 * @requires https://ant.design  Tabs
 * @module 前端通用组件->Tabs
 */
import React, { Component } from 'react';
import {Tabs as AntdTabs} from 'antd';
import './style.scss';

export default class Tabs extends AntdTabs {
  constructor(props, context){
    super(props, context);
  }
}
