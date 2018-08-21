/**
 * @author wangqinqin
 * @date 2017-09-06
 * @requires https://ant.design  DatePicker
 * @module 前端通用组件->InputDatePicker 针对input框的情况
 */
import React, { Component } from 'react';
import { Input } from 'antd';
import datepicker from 'lib/datepicker/js/bootstrap-datepicker.js';
import locales from 'lib/datepicker/locales/bootstrap-datepicker.zh-CN.min.js';
import * as Tools from 'utils/tools.js';
import 'lib/datepicker/css/bootstrap-datepicker.css';
import './style.scss';

export default class EndDatePicker extends Component {
  constructor(props, context){
    super(props, context);
  }


  /**
  * 首次实例化
  */
  componentDidMount() {
    let that = this;
    $('.date-picker-end').datepicker({
      container: $('.date-select-end'),
      timeClass: ".time-picker",
      orientation:"left top",
      left: 1,
      top: 27,
      todayHighlight: true,
      language: "zh-CN",
      autoclose : true,
      format: "mm-dd",
      startDate: this.props.currentDate,
    })

    // 日历选择后回调
    $('.date-picker-end').datepicker().off('changeDate').on('changeDate', function(e){
      let selectDate = e.date;
      that.props.changeDate && that.props.changeDate(e);
      $('.date-picker-end').datepicker('update');
    });
  }

  render() {
    return (
      <Input type="text" readOnly id="date" className="date-picker-end form-control input-sm input-icon-calendar w120 js-startDate" data-date={this.props.currentDate} value={this.props.currentDate} data-currentOrder={this.props.currentOrder} />
    );
  }
}
