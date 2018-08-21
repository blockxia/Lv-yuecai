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

import {addDate,getDate} from 'utils/date';

import './style.scss';


// 时间间隔默认为30天
const TIME_DAY_30 = 30;


function getDateDiff(startDate, endDate) {
  
  if (!startDate && !endDate) {
    return;
  }
  var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
  var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
  var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
  return dates;
}

export default class StartDatePicker extends Component {
  constructor(props, context){
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }


  updateEndTime(){

  }


  componentDidMount() {
    let _this = this;
    let pickerId = `#date-picker-end-${this.props.currentOrder}`;
    let timePosDay = TIME_DAY_30-getDateDiff(_this.props.startTimeMark,_this.props.endTimeMark);
    $(pickerId).datepicker({
      orientation:"left top",
      todayHighlight: true,
      language: "zh-CN",
      autoclose: true,
      format: "mm-dd",
      startDate: getDate(_this.props.endTimeMark, 'MM-dd'),
      endDate:addDate(_this.props.endTimeMark,timePosDay,'MM-dd'),
    }).on('changeDate', function(e){
      _this.props.changeDate && _this.props.changeDate(e);
    });
  }

  componentDidUpdate(){
    let _this = this;
    let pickerId = `#date-picker-end-${this.props.currentOrder}`;
    let timePosDay = TIME_DAY_30-getDateDiff(_this.props.startTimeMark,_this.props.endTimeMark);
    $(pickerId).datepicker('setStartDate',getDate(_this.props.endTimeMark, 'MM-dd'));
    $(pickerId).datepicker('setEndDate',addDate(_this.props.endTimeMark,timePosDay,'MM-dd'));
  }

  componentWillUnmount(){
    let pickerId = `#date-picker-end-${this.props.currentOrder}`;
    $(pickerId).datepicker('destroy');
  }


  render() {
    return (
      <span className="pos-relative">
        <Input
          type="text"
          readOnly
          id={'date-picker-end-'+this.props.currentOrder}
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

