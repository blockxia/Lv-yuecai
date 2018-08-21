import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Input } from 'antd';
import datepicker from 'lib/datepicker/js/bootstrap-datepicker.js';
import locales from 'lib/datepicker/locales/bootstrap-datepicker.zh-CN.min.js';
import * as Tools from 'utils/tools.js';
import 'lib/datepicker/css/bootstrap-datepicker.css';
import intl from 'react-intl-universal';
import {getDate} from 'utils/date.js';

import './style.scss';

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

  updateStartTime(){

  }

  componentDidMount() {
    let _this = this;
    let pickerId = `#date-picker-start-${this.props.pickerId}`;
    const containerStart = `.startTime-stay-container-${this.props.pickerId}`;
    $(pickerId).datepicker({
      orientation:"left top",
      todayHighlight: true,
      language: "zh-CN",
      autoclose : true,
      format: "yyyy-mm-dd",
      container: this.props.startPlace === 'body' ? 'body' : $(containerStart),
    }).on('changeDate', function(e){
      _this.props.startChangeTime(getDate(e.date,'YYYY-MM-dd'));
    });
  }

  changeDate(){
    let pickerId = `#date-picker-start-${this.props.pickerId}`;
    $(pickerId).trigger("select")
  }


  componentWillUnmount(){
    let pickerId = `#date-picker-start-${this.props.pickerId}`;
    $(pickerId).datepicker('destroy');
  }

  render() {
    const setClass = this.props.startPlace === 'body' ? 'pos-relative' : 'pos-relative startTime-stay-con startTime-stay-container-' + this.props.pickerId;
    return (
      <span className={setClass}  style={{cursor:'pointer'}} onClick={()=>{this.changeDate()}}>
        <label className="input-text date-text" style={{width:'65px',fontSize:'12px'}}>{intl.get('lv.orders.checkIn.popToStay')}</label>
        <Input
          type="text"
          readOnly
          id={'date-picker-start-'+this.props.pickerId}
          className=" input-ss input-icon-calendar w135 js-startDate"
          // value={getDate(this.props.startTime, 'MM-dd')}
          value={this.props.startTime}
          // value={this.props.startDate}
          data-date-format="yyyy-mm-dd"
          disabled={this.props.checkDisable}
        />
        <i className="i-icon calendar-ico">&#xe63c;</i>
      </span>
    );
  }
}
