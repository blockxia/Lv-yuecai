/**
 * @author litengfei
 * @date 2017-08-21 
 * @requires https://ant.design  Button
 * @module 前端通用组件->Button
 */
import React, { Component } from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';
import './style.scss';

const INTERVAL_TIMESTAMP = 365 * 24 * 60 * 60 * 1000;

export default class Button extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      startValue: this.props.defaultDate === false ? '' : moment().add(-182, 'days'),
      endValue: this.props.defaultDate === false ? '' : moment(),
    };
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    if (startValue.valueOf() > (endValue.valueOf() - INTERVAL_TIMESTAMP)) {
      return false
    }
    return true
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    if (endValue.valueOf() < (startValue.valueOf() + INTERVAL_TIMESTAMP) && endValue.valueOf() >= startValue.valueOf()) {
      return false
    }
    return true
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.flag!=this.props.flag){
      this.setState({
        startValue: this.props.defaultDate === false ? '' : moment().add(-182, 'days'),
        endValue: this.props.defaultDate === false ? '' : moment(),
      })
    }
  }
  onStartChange = (value, valueStr) => {
    //this.onChange('startValue', value);
    let params = {
      startValue: moment(valueStr, 'YYYY-MM-DD'),
      endValue: moment(valueStr, 'YYYY-MM-DD').add(182, 'days'),
    };
    this.setState(params);
    this.props.rangeChange && this.props.rangeChange(params.startValue.format('YYYY-MM-DD'), params.endValue.format('YYYY-MM-DD'));
  }

  onEndChange = (value, valueStr) => {
    //this.onChange('endValue', value);
    let params = {
      //startValue: moment(valueStr, 'YYYY-MM-DD').add(-7, 'days'),
      endValue: moment(valueStr, 'YYYY-MM-DD'),
      startValue:this.state.startValue
    };
    this.setState(params);
    this.props.rangeChange && this.props.rangeChange(params.startValue.format('YYYY-MM-DD'), params.endValue.format('YYYY-MM-DD'));
  }

  render() {
    return (
      <div className='range-datepicker'>
        <DatePicker
          allowClear={false}
          onChange={this.onStartChange.bind(this)}
          placeholder={'开始时间'}
          disabledDate={this.disabledStartDate.bind(this)}
          value={this.state.startValue ? this.state.startValue : null}
        />
        <span style={{ paddingRight: '5px', paddingLeft: '5px' }}>至</span>
        <DatePicker
          allowClear={false}
          onChange={this.onEndChange.bind(this)}
          placeholder={'结束时间'}
          disabledDate={this.disabledEndDate.bind(this)}
          value={this.state.endValue ? this.state.endValue : null}
        />
      </div>
    );
  }
}
