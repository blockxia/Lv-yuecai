/**
 * @author litengfei
 * @date 2017-11-27
 * @requires https://ant.design  Pagination
 * @module 前端通用组件->Pagination
 */
import React from 'react';
import {Pagination as AntdPagination} from 'antd';
import './style.scss';

export default class Pagination extends AntdPagination {
  constructor(props, context){
    super(props, context);
  }
}
