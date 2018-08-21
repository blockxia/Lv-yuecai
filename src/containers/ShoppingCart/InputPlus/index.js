/**
 * @authors wangchen
 * @date    2018-08-15
 * @module  带加减号input框
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import intl from 'react-intl-universal';
import Config from 'config';

import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as Tools from 'utils/tools.js';

import { Modal, Form, Input, Icon, Row, Col, Checkbox, Button, Spin, Select,Tooltip } from 'antd';
import message from 'components/Common/message';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

import './style.scss';


class InputControl extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
    };
  }


  // 处理手写
  handleCount = (e) => {
    this.props.onComplete(e.target.value,this.props.record);
  }

  // 加
  handlePlus = () => {
    let value = this.props.num;
    if (value < 0) {
      return;
    }
    if (!isNaN(value)) {
      this.props.onComplete(++value,this.props.record);
      if (value >= 1) {
        this.setState({
          visible: false,
        });
      }
    }
  }

  // 减
  handleMiuns = () => {
    let value = this.props.num;
    if (value < 0) {
      return;
    }
    if (!isNaN(value) && value > 1) {
      this.props.onComplete( --value,this.props.record);
    }
  }



  handleChange(e) {
    this.props.onComplete(e.target.value,this.props.record);
  }

  handleBlur(e) {
    if (!isNaN(e.target.value) && parseInt(e.target.value) > 0) {
      this.setState({
        visible: false,
      });

      this.handleCount(e);
    } else {
      this.setState({
        visible: true,
      });
    }
  }

  // handleTipClick() {
  //   this.setState({
  //     visible: false
  //   })
  // }

  render() {
    return (
      <div className="inputplus-control-wrapper ml10">
        <span className="input-group-addon days-icon">
          <span
            className="btn-days btn-miuns"
            onClick={this.handleMiuns.bind(this)}
            disabled={this.props.num <= 1 ? true : false}
          >
            <i className="i-icon minus">
              <Icon type="minus" />
            </i>
          </span>
        </span>
        <Input
          className="input-room-number"
          value={this.props.num}
          maxLength="5"
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          // disabled={this.props.checkDisable}
        />
        <span className="input-group-addon days-icon">
          <span
            className="btn-days btn-plus"
            onClick={this.handlePlus.bind(this)}
          >
            <i className="i-icon plus"><Icon type="plus" /></i>
          </span>
        </span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(InputControl));
