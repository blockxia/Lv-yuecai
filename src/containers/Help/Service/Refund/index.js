/**
 * @authors wangchen
 * @date    2018-08-20
 * @module  退款流程
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Slider from 'components/Common/SliderBar';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {SubMenu} = Menu;
const {Content, Sider} = Layout;
import './style.scss';

export default class Refund extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }


  render() {
    return (
      <div className="Introduction-content">
          <div className="help-main-title">
            {'退款说明'}
          </div>
          <div className="help-title">
            {'订单退款'}
          </div>
          <div className="help-content">
            {'悦采网为您提供自助取消订单服务，您可进入“我的订单”针对问题订单自助操作取消。 (1).取消订单成功后，优惠劵支付的部分系统暂不支持返还； (2).如果有部分支付方式支付失败，您可以点击重新支付剩余金额，重新选择支付方式支付剩余未支付金额。 (3).如果您在2小时内未对剩余未付款金额完成支付，此时订单并未成立将视为自行取消订单并将已支付金额将原路退回您的原支付账户内。 '}
          </div>
          <div className="help-content">
            {' (1).取消订单成功后，优惠劵支付的部分系统暂不支持返还； '}
          </div>
          <div className="help-content">
            {'(2).如果有部分支付方式支付失败，您可以点击重新支付剩余金额，重新选择支付方式支付剩余未支付金额。'}
          </div>
          <div className="help-content">
            {' (3).如果您在2小时内未对剩余未付款金额完成支付，此时订单并未成立将视为自行取消订单并将已支付金额将原路退回您的原支付账户内。 '}
          </div>
      </div>
    );
  }
}
