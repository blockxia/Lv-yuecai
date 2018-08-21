import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Input } from 'antd';
import datepicker from 'lib/datepicker/js/bootstrap-datepicker.js';
import locales from 'lib/datepicker/locales/bootstrap-datepicker.zh-CN.min.js';
import * as Tools from 'utils/tools.js';
import 'lib/datepicker/css/bootstrap-datepicker.css';
import intl from 'react-intl-universal';
import {addDate,getDate} from 'utils/date';

import './style.scss';


// 时间间隔默认为30天
const TIME_DAY_30 = 30;


function getDateDiff(startDate, endDate) {
  const startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
  const endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
  const dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
  return dates;
}

export default class StartDatePicker extends Component {
  constructor(props, context){
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    // 设置多语言
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../../locales/${currentLocale}.json`),
      },
    });
  }


  updateEndTime(){

  }


  componentDidMount() {
    let _this = this;
    let pickerId = `#date-picker-end-${this.props.pickerId}`;
    let timePosDay = TIME_DAY_30-getDateDiff(_this.props.startTimeMark,_this.props.endTimeMark);
    const containerEnd = `.endTime-stay-container-${this.props.pickerId}`;
    $(pickerId).datepicker({
      orientation:"left top",
      todayHighlight: true,
      language: "zh-CN",
      autoclose : true,
      format: "yyyy-mm-dd",
      container: this.props.endPlace === 'body' ? 'body' : $(containerEnd),
      startDate:_this.props.endTimeMark,
      endDate: addDate(_this.props.endTimeMark,timePosDay,'yyyy-mm-dd'),
    }).on('changeDate', function(e){
      _this.props.endChangeTime(getDate(e.date,'YYYY-MM-dd'));
    });
  }
  changeDate(){
    let pickerId = `#date-picker-end-${this.props.pickerId}`;
    $(pickerId).trigger("select")
  }

  componentDidUpdate(){
    let _this = this;
    let pickerId = `#date-picker-end-${this.props.pickerId}`;
    let timePosDay = TIME_DAY_30-getDateDiff(_this.props.startTimeMark,_this.props.endTimeMark);
    $(pickerId).datepicker('setStartDate',_this.props.endTimeMark);
    $(pickerId).datepicker('setEndDate',addDate(_this.props.endTimeMark,timePosDay,'yyyy-mm-dd'));
  }

  componentWillUnmount(){
    let pickerId = `#date-picker-end-${this.props.pickerId}`;
    $(pickerId).datepicker('destroy');
  }


  render() {
    const setClass = this.props.endPlace === 'body' ? 'pos-relative ml10' : 'pos-relative ml10 endTime-stay-con endTime-stay-container-' + this.props.pickerId;
    return (
      <span className={setClass} onClick={()=>{this.changeDate()}} style={{cursor:'pointer'}} >
        <label style={{width:'65px',fontSize:'12px'}} className="input-text date-text">{intl.get('lv.orders.checkIn.popToLeave')}</label>
        <Input
          type="text"
          readOnly
          id={'date-picker-end-'+this.props.pickerId}
          className="input-ss input-ssinput-icon-calendar w135 js-startDate"
          // value={getDate(this.props.endTime, 'MM-dd')}
          value={this.props.endTime}
          // value={this.props.endDate}
          data-date-format="yyyy-mm-dd"
          disabled={this.props.checkDisable}
        />
        <i className="i-icon calendar-ico" >&#xe63c;</i>
      </span>
    );
  }
}
