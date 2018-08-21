/**
 * @authors wangchen
 * @date    2018-08-20
 * @module  配送范围
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Slider from 'components/Common/SliderBar';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {SubMenu} = Menu;
const {Content, Sider} = Layout;
import './style.scss';

export default class Scope extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }


  render() {
    return (
      <div className="Introduction-content">
          <div className="help-main-title">
            {'配送范围'}
          </div>
          <div className="help-title">
            {'平邮'}
          </div>
          <div className="help-content">
            {'全国各地均可送达。'}
          </div>
          <div className="help-title">
            {'快递'}
          </div>
          <div className="help-content">
            {'配送服务覆盖全国四百多个城市，您可事先了解是否能够到达您的收货地址。'}
          </div>
          <div className="help-title">
            {'特快专递'}
          </div>
          <div className="help-content">
            {'全国各地均可送达。'}
          </div>
      </div>
    );
  }
}
