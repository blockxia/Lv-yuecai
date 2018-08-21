/**
 * @authors wangqinqin
 * @date    2017-09-02
 * @module  未选房型新增预订-增减组件
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Config from 'config';
import { Input, Icon } from 'antd';
import { connect } from 'react-redux';
import * as Tools from '../../../utils/tools.js';
import './style.scss';

const url_prefix = Config.env[Config.scheme].prefix;

class IncreaseOrDecreaseControl extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible:false,
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
  handleChange(e) {
    if (!isNaN(e.target.value) && e.target.value > 100) {
      e.target.value = 100;
    }
    this.props.changeBookCountTotal(e.target.value);
  }

  // 处理手写房间或者晚数
  handleCount = (e) => {
    // this.props.onComplete('change', this.props.storageVariable, e.target.value);
    this.props.onComplete('change', e.target.value);
  }

  // 加
  handlePlus = () => {
    // this.props.onComplete('add', this.props.storageVariable);
    let value = this.props.defaultValue;
    if (!isNaN(value) && value <= 100) {
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
    // this.props.onComplete('miuns', this.props.storageVariable);
    let value = this.props.defaultValue;
    if (!isNaN(value) && value > 1) {
      this.props.onComplete('miuns', --value);
      if (value <= 100) {
        this.setState({
          visible: false,
        });
      }
    }
  }

  // handleTipClick() {
  //   this.setState({
  //     visible: false,
  //   });
  // }

  handleBlur(e) {
    if (!isNaN(e.target.value) && parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 100) {
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

  createDom = () => {
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
        <span className="input-text input-unit">{this.props.unit}</span>
        <Input
          type="text"
          maxLength="3"
          className="count-input form-control input-sm validate[required,custom[integer],max[365],min[1]] days w60 text-center days-num pr20"
          id="form-validation-field-1"
          style={{ width: '50px', textAlign: 'left', background: '#fff' }}
          // onChange={this.handleCount}
          onChange={this.handleChange.bind(this)}
          value={this.props.defaultValue}
          onBlur={this.handleBlur.bind(this)}
        />
        <div className="formError bookCount-formError" style={{opacity: '1',position: 'absolute',top: '7px',left: '35px',marginTop: '-40px',display:this.state.visible?'block':'none'}}>
          <div className="formErrorContent">{intl.get('lv.orders.booking.number')}<br/></div>
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

export default IncreaseOrDecreaseControl;
