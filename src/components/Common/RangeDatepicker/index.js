
/**
 * @authors zhangwei
 * @date    2018-03-21
 * @module  RangeDatepicker
 */
import React, { Component } from 'react';
import BaseComponent from 'components/Public/BaseComponent';

import './style.scss';
import Divider from 'antd';

export default class RangeDatepicker extends BaseComponent {
  constructor(props, context) {
    super(props, context);
  }
  componentDidUpdate() {
    console.log(123);
    // $('.js-date').datepicker({
    //   orientation: "left top",
    //   format: 'yyyy-mm-dd',
    //   todayHighlight: true,
    //   language: "zh-CN",
    //   autoclose: true,
    // })
    // //日历选择后回调
    // $('.js-date').datepicker().off('changeDate').on('changeDate', function (e) {
    //   let selectDate = e.date;
    //   console.log(selectDate);
    //   // that.props.changeDate && that.props.changeDate(e);
    // });
  }
  render() {
    return (
      <div className='rangeDatepicker'>
        <span className='pos-relative'>
          <input type="text" disabled={this.props.disabled} readOnly className="js-date input-ss" id='startDate' key='startDate'/><i className="i-icon calendar-ico">&#xe634;</i>
        </span>
        <span>-</span>
        <span className='pos-relative'>
          <input type="text" disabled={this.props.disabled} readOnly className="js-date input-ss" id='endDate' key='endDate'/><i className="i-icon calendar-ico">&#xe634;</i>
        </span>
      </div>
    );
  }
}