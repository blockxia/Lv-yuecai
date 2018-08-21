/**
 * @author litengfei
 * @date 2017-09-02
 * @requires https://ant.design  DatePicker
 * @module 前端通用组件->DatePicker
 */
import React, { Component } from 'react';
import datepicker from 'lib/datepicker/js/bootstrap-datepicker.js';
import locales from 'lib/datepicker/locales/bootstrap-datepicker.zh-CN.min.js';
import festivals from 'lib/datepicker/festival/bootstrap-datepicker-festival.zh-CN.min.js'
import * as Tools from 'utils/tools.js';
import 'lib/datepicker/css/bootstrap-datepicker.css';
import './style.scss';

export default class DatePicker extends Component {
  constructor(props, context){
    super(props, context);
  }


  /*首次实例化*/
  componentDidUpdate(){
    let that = this;
    $('.date-picker').datepicker({
      container:$('.date-select'),
      timeClass:".time-picker",
      orientation:"left top",
      left:1,
      top: 27,
      todayHighlight:true,
      language: "zh-CN",
      autoclose : true
    });

    //日历选择后回调
    $('.date-picker').datepicker().off('changeDate').on('changeDate', function(e){
      let selectDate = e.date;
      that.props.changeDate && that.props.changeDate(e);
    });
  }

  render() {
    return (
      <span className="date-picker fn-vam date" id="date" data-date={this.props.currentDate}>{this.props.dateRange}</span>
    );
  }
}
