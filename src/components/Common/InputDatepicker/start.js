/**
 * @author wangqinqin
 * @date 2017-09-06
 * @requires https://ant.design  DatePicker
 * @module 前端通用组件->InputDatePicker 针对input框的情况
 */
import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Input } from 'antd';
import datepicker from 'lib/datepicker/js/bootstrap-datepicker.js';
import locales from 'lib/datepicker/locales/bootstrap-datepicker.zh-CN.min.js';
import * as Tools from 'utils/tools.js';
import 'lib/datepicker/css/bootstrap-datepicker.css';

import {getDate} from 'utils/date.js';

import './style.scss';

export default class StartDatePicker extends Component {
  constructor(props, context){
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  updateStartTime(){

  }

  componentDidMount() {
    let _this = this;
    let pickerId = `#date-picker-start-${this.props.currentOrder}`;
    $(pickerId).datepicker({
      orientation:"left top",
      todayHighlight: true,
      language: "zh-CN",
      autoclose : true,
      format: "mm-dd",
    }).on('changeDate', function(e){
      _this.props.changeDate && _this.props.changeDate(e);
    });
  }


  componentWillUnmount(){
    let pickerId = `#date-picker-start-${this.props.currentOrder}`;
    $(pickerId).datepicker('destroy');
  }

  render() {
    return (
      <span className="pos-relative">
        <Input
          type="text"
          readOnly
          id={'date-picker-start-'+this.props.currentOrder}
          className="form-control input-sm input-icon-calendar w120 js-startDate"
          data-date={this.props.currentDate}
          value={this.props.currentDate}
          data-currentOrder={this.props.currentOrder}
          data-date-format="mm-dd"
        />
      </span>
    );
  }
}
