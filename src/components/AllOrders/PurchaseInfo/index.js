/**
 * @authors wangqinqin
 * @date    2018-08-15
 * @module  订单详情-收货人信息
 */
import React, { PureComponent } from 'react';
import BaseComponent from 'components/Public/BaseComponent';
import './style.scss';

export default class PurchaseInfo extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {

    }
  }

  componentDidMount() {

  }
  getInfo = () => {
    let orderDetails = this.props.orderDetails,
      orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult;
    if (orderPurchaseResult && orderPurchaseResult.status != 7) { // 取消订单不显示
      return (
        <div className="order-all-orders-purchase">
          <div className="purchase-title">收货人信息</div>
          <div className="purchase-content">
            {orderPurchaseResult.purchaseContactName}，{orderPurchaseResult.purchaseAddress}，{orderPurchaseResult.purchaseTelephone}
          </div>
        </div>
      );
    }
  }
  render() {
    return (
      <div>
        {this.getInfo()}
      </div >
    );

  }
}
