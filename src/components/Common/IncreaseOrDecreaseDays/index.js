/**
 * @authors wangqinqin
 * @date    2017-09-02
 * @module  指定房间-增减组件
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Config from 'config';
import { Input, Icon } from 'antd';
import { connect } from 'react-redux';
import * as Tools from '../../../utils/tools.js';
import './style.scss';

const url_prefix = Config.env[Config.scheme].prefix;
const TIME_DAY_30 = 30;

class IncreaseOrDecreaseDays extends Component {
  constructor(props, context) {
    super(props, context);

    // 设置多语言
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../../locales/${currentLocale}.json`),
      },
    });
    this.state = {
      visible: false,
    }
  }

  // 处理手写房间或者晚数
  handleCount = (e) => {
    this.props.onComplete('change', this.props.lineKey, e.target.value);
  }

  // 加
  handlePlus = () => {
    if (this.props.disabledPlus) {
      return;
    }
    const value = this.props.defaultValue;
    if (!isNaN(value) && value < TIME_DAY_30) {
      this.props.onComplete('add', this.props.lineKey);
      if (value >= 1) {
        this.setState({
          visible: false,
        });
      }
    }  
  }

  // 减
  handleMiuns = () => {
    if (this.props.disabled) {
      return;
    }
    const value = this.props.defaultValue;
    if (!isNaN(value) && value > 1) {
      this.props.onComplete('miuns', this.props.lineKey);
      if ((value - 1) <= 30) {
        this.setState({
          visible: false,
        });
      }
    }
  }

  // handleTipClick = () => {
  //   this.setState({
  //     visible: false,
  //   });
  // }

  handleBlur = (e) => {
    if (!isNaN(e.target.value) && e.target.value > 0 && e.target.value <= 30) {
      this.setState({
        visible: false,
      });
    } else {
      this.setState({
        visible: true,
      });
    }
  }

  createDom = () => {
    const setClass = !this.props.read ? 'input-text' : 'input-text-readOnly';
    return (
      <div className="ml5 mr5 input-group">
        <span className="input-group-addon days-icon">
          <span
            className="btn-days btn-miuns"
            onClick={this.handleMiuns}
            disabled={this.props.disabled}
          >
            <i className="i-icon minus">
              <Icon type="minus" />
            </i>
          </span>
        </span>
        <span className={setClass}>{this.props.unit}</span>
        <Input
          type="text"
          maxLength="2"
          className="count-input form-control input-sm validate[required,custom[integer],max[365],min[1]] days w60 text-center days-num pr20"
          id="form-validation-field-1"
          style={{ width: '50px', textAlign: 'left' }}
          onChange={this.handleCount}
          value={this.props.defaultValue}
          onBlur={this.handleBlur}
          readOnly={this.props.read}
        />
        <div className="formError time-formError" style={{opacity: '1',position: 'absolute',top: '0px',left: '35px',marginTop: '-40px',display:this.state.visible?'block':'none'}}>
          <div className="formErrorContent">请输入1-30的整数<br/></div>
          <div className="formErrorArrow"><i></i></div>
        </div>
        <span className="input-group-addon days-icon">
          <span
            className="btn-days btn-plus"
            onClick={this.handlePlus}
            disabled={this.props.disabledPlus}
          >
            <i className="i-icon plus"><Icon type="plus" /></i>
          </span>
        </span>
      </div>
    );
  }
  render() {
    return (
      <div>
        {
          this.createDom()
        }
      </div>
    );
  }
}

export default IncreaseOrDecreaseDays;
