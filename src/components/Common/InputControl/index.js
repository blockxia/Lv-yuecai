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

// 时间间隔默认为30天
const TIME_DAY_30 = 30;

const url_prefix = Config.env[Config.scheme].prefix;

class InputControl extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      visible: false,
    };
    // 设置多语言
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../../locales/${currentLocale}.json`),
      },
    });
  }

  componentDidMount(){
    
  }
  componentDidUpdate() {
    // 解决当存在错误提示，手动切换日期到正确时间间隔问题
    if (this.props.totalDay > 0 && this.props.totalDay <= 30) {
      this.setState({
        visible: false
      });
    }
  }

  // 处理手写房间或者晚数
  handleCount = (e) => {
    this.props.onComplete('change', e.target.value);
  }

  // 加
  handlePlus = () => {
    let value = this.props.totalDay;
    if (this.props.checkDisable) {
      return;
    }
    if (value < 0) {
      return;
    }
    if (!isNaN(value) && value < TIME_DAY_30) {
      this.props.onComplete('add', ++value);
      if (value >= 1) {
        this.setState({
          visible: false,
        });
      }
    }
  }

  // 减
  handleMiuns = () => {
    let value = this.props.totalDay;
    if (this.props.checkDisable) {
      return;
    }
    if (value < 0) {
      return;
    }
    if (!isNaN(value) && value > 1) {
      this.props.onComplete('miuns', --value);
      if (value <= 30) {
        this.setState({
          visible: false,
        });
      }
    }
  }



  handleChange(e) {
    this.props.changeTotal(e.target.value);
  }

  handleBlur(e) {
    if (!isNaN(e.target.value) && parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 30) {
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
      <div className="input-control-wrapper ml10">
        <span className="input-group-addon days-icon">
          <span
            className="btn-days btn-miuns"
            onClick={this.handleMiuns.bind(this)}
            disabled={this.props.checkDisable ? this.props.checkDisable : (this.props.totalDay <= 1 ? true : false)}
          >
            <i className="i-icon minus">
              <Icon type="minus" />
            </i>
          </span>
        </span>
        <Input
          suffix={intl.get('lv.orders.checkIn.time.unit.day')}
          className="input-room-number"
          value={this.props.totalDay}
          maxLength="2"
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          // disabled={this.props.checkDisable}
        />
        <div className="formError time-formError" style={{opacity: '1',position: 'absolute',top: '0px',left: '35px',marginTop: '-40px',display:this.state.visible?'block':'none'}}>
          <div className="formErrorContent" id="inputControl-formErrorContent">{intl.get('lv.common.datepickerTimeLimit')}<br/></div>
          <div className="formErrorArrow"><i></i></div>
        </div>
        <span className="input-group-addon days-icon">
          <span
            className="btn-days btn-plus"
            onClick={this.handlePlus.bind(this)}
            disabled={this.props.checkDisable ? this.props.checkDisable : (this.props.totalDay >= 30 ? true : false)}
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
