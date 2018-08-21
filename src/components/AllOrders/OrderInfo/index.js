/**
 * @authors wangqinqin
 * @date    2018-08-15
 * @module  订单详情-订单信息
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as Actions from '../../../actions/order';

import './style.scss';
import { formatMoney, getParamString } from '../../../utils/tools';
import { getDate } from '../../../utils/date';

export default class OrdersDetail extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {

    }
  }

  componentDidMount() {

  }
  renderInfoContent = () => {
    let orderDetails = this.props.orderDetails,
      orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult;
    if (orderPurchaseResult.status == 7) { // 已取消
      return (<div className="info-content">
        订单取消原因：{orderPurchaseResult.cancelComment}
      </div>)
    } else {
      return (<div className="info-content">
        <div>订单备注：{orderPurchaseResult.purchaseComment}</div>
        <div>采购门店：{orderPurchaseResult.groupName}&nbsp;&nbsp;{orderPurchaseResult.storesName}</div>
      </div>);
    }
  }
  getInfo = () => {
    let orderDetails = this.props.orderDetails,
      orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult;
    if (orderPurchaseResult) {
      return (
        <div>
          <div className="info-title">订单信息</div>
          {this.renderInfoContent()}
        </div>
      );
    }
  }
  render() {
    return (
      <div className='order-all-orders-info'>
        {this.getInfo()}
      </div >
    );
    
  }
}
