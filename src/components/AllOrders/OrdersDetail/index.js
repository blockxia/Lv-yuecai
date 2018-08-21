/**
 * @authors wangqinqin
 * @date    2018-08-14
 * @module  订单详情
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Button } from 'antd';
import Table from "components/Common/Table";
import * as Actions from '../../../actions/order';
import BaseComponent from 'components/Public/BaseComponent';
import intl from 'react-intl-universal';
import { Link } from 'react-router';
import { observer } from 'utils/observer.js';
import OrderPayResults from '../OrderPayResults';
import OrderInvoice from '../OrderInvoice';
import OrderInfo from '../OrderInfo';
import PurchaseInfo from '../PurchaseInfo';
import CancelOrders from '../CancelOrders';
import PaymentDialog from '../PaymentDialog';
import ConfirmReceived from '../ConfirmReceived';

import './style.scss';
import { formatMoney, getParamString } from '../../../utils/tools';
import { getDate, getInterceptionDate } from '../../../utils/date';

let ORDER_PARENT_STATUS = {};
let ORDER_CHILD_STATUS = {};

class OrdersDetail extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {

    }
    ORDER_PARENT_STATUS = {
      1: intl.get('lv.order.allorder.status1'), // 待付款
      2: intl.get('lv.order.allorder.list.parent.status2'), // 待分配
      3: intl.get('lv.order.allorder.list.parent.status3'), // 已拆分
      7: intl.get('lv.order.allorder.list.parent.status4'), // 已取消
    }
    ORDER_CHILD_STATUS = {
      1: intl.get('lv.order.allorder.status1'),  // 待付款
      2: intl.get('lv.order.allorder.list.parent.status2'), // 待分配
      3: intl.get('lv.order.allorder.list.child.status3'),  // 待发货
      4: intl.get('lv.order.allorder.list.child.status4'), // 待收货
      5: intl.get('lv.order.allorder.status5'), // 已收货
      6: intl.get('lv.order.allorder.list.child.status6'), // 已结算
      7: intl.get('lv.order.allorder.status7'), // 已取消
    }

  }

  componentDidMount() {
    const orderId = getParamString(location.href, 'orderId');
    this.props.getOrdersDetails({
      orderId: orderId,
    });
  }
  // 表格数据
  getDataSource() {
    const orderDetails = this.props.orderDetails;
    let productionResult = orderDetails && orderDetails.orderCommodityPurchaserResults;
    let list_data = productionResult;
    if (!(list_data && list_data.length)) {
      return [];
    }
    return list_data.map((item, key) => {
      return {
        ...item,
      }
    })
  }
  // 当存在一个收货的情况，那么亮显一键收货; 当该订单为待付款，那么显示一键付款
  keyReceving = () => {
    let orderDetails = this.props.orderDetails,
      orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult,
      bankAccountResult = orderDetails && orderDetails.bankAccountResult,
      productionResult = orderDetails && orderDetails.orderCommodityPurchaserResults;
    let waitGoods = productionResult && productionResult.filter((item) => {
      return item.status && (Number(item.status) === 4);
    });
    if (orderPurchaseResult.status == 1) {
      return (<Button className="ft-red-btn">
        <PaymentDialog
          pamentList={this.props.pamentList}
          fetchPayType={this.props.fetchPayType}
          bankAccountResult={bankAccountResult}
          orderPurchaseResult={orderPurchaseResult}
          orderId={orderPurchaseResult && orderPurchaseResult.id}
          callBackFunc={this.props.getOrdersDetails}
          confirmAddPay={this.props.confirmAddPay}
        >一键付款</PaymentDialog>
      </Button>);
    }
    return (<Button disabled={waitGoods && waitGoods.length ? false : true} className="ft-green-btn">
    <ConfirmReceived
      orderDetails={orderDetails}
      callBackFunc={this.props.getOrdersDetails}
      confirmReceived={this.props.confirmReceived}
      orderId={orderPurchaseResult && orderPurchaseResult.orderId}
    >{intl.get('lv.order.allorder.detail.tablist.receiving')}</ConfirmReceived></Button>)
  }
  getColumns() {
    let orderDetails = this.props.orderDetails;
    let columns = [
      { title: intl.get('lv.order.allorder.detail.tablist.commodityPhotoUrl'), dataIndex: 'commodityPhotoUrl', key: 'commodityPhotoUrl', render: (text, record) => (<Link className="commodity-photoUrl"><img src={record.commodityPhotoUrl} /></Link>) },
      { title: intl.get('lv.order.allorder.detail.tablist.commodityName'), dataIndex: 'commodityName', key: 'commodityName' },
      { title: intl.get('lv.order.allorder.detail.tablist.commodityNumber'), dataIndex: 'commodityNumber', key: 'commodityNumber' },
      { title: intl.get('lv.order.allorder.detail.tablist.salePrice'), dataIndex: 'salePrice', key: 'salePrice', render: (text, record) => {
        return (<span className="ft-money">{this.props.symbol + formatMoney(record.salePrice)}</span>);
      } },
      { title: intl.get('lv.order.allorder.detail.tablist.saleTotalPrice'), dataIndex: 'saleTotalPrice', key: 'saleTotalPrice', render: (text, record) => {
        return (<span className="ft-money">{this.props.symbol + formatMoney(record.saleTotalPrice)}</span>);
      } },
      { title: this.keyReceving(), dataIndex: 'status', key: 'status', render: (text, record) => {
        return (<span className={`ft-status-${record.status}`}>{record.status == 4 ? <Button className="ft-green-btn">
          <ConfirmReceived
            record={record}
            id={record.id}
            callBackFunc={this.props.getOrdersDetails}
            orderId={record.orderId}
            confirmReceived={this.props.confirmReceived}
          >{intl.get('lv.order.allorder.detail.tablist.receiving')}</ConfirmReceived></Button> : ORDER_CHILD_STATUS[record.status]}</span>);
      } },
    ];
    return columns;
  }
  expandDesc = (record) => {
    
    if (record.status && (Number(record.status) !== 1)) {
      return (<div>{`快递公司：${record.expressName}，快递编号：${record.expressNumber}，快递日期：${getDate(record.expressTime)}`}</div>);
    }
    return '';
  }
  getTotal = (result) => {
    if (result.saleTotalPrice && result.freightCharge) {
      return (<span>合计订单总金额：<span className="ft-money">{this.props.symbol}{formatMoney(Number(result.saleTotalPrice) + Number(result.freightCharge))}={this.props.symbol}{formatMoney(result.saleTotalPrice)}</span>(商品总金额)<span className="ft-money">+{this.props.symbol}{result.freightCharge}</span>(运费)</span>)
    } else if (result.saleTotalPrice) {
      return (<span>合计订单总金额：<span className="ft-money">{this.props.symbol}{formatMoney(Number(result.saleTotalPrice))}={this.props.symbol}{formatMoney(result.saleTotalPrice)}</span>(商品总金额)</span>)
    }
  }

  // 母订单为待付款-操作可取消;，母订单为已取消，操作可申请售后；母订单为已拆分，存在一个子订单为已收货，可申请售后
  parentOrderOperator = () => {
    const orderDetails = this.props.orderDetails;
    let orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult,
      productionResult = orderDetails && orderDetails.orderCommodityPurchaserResults;

    let filterReceive = productionResult && productionResult.map((item) => {
      return item.status == 5; // 已收货
    })
    if (orderPurchaseResult.status == 1) {
      return (<Link className="ml20 opretor">
        <CancelOrders
          orderId={orderPurchaseResult.id}
          purchaseId={orderPurchaseResult.purchaseId}
          callBackFunc={this.props.getOrdersDetails}
          cancelOrder={this.props.cancelOrder}
        >取消订单</CancelOrders></Link>)
    } else if (orderPurchaseResult.status == 4 || (filterReceive && filterReceive.length && orderPurchaseResult.status == 3)) {
      return (<Link className="ml20 opretor">申请售后</Link>);
    }
  }

  getRowExpanded(record) {
    return(
      <span>快递名字：{record.expressName}，快递单号：{record.expressNumber}，快递时间：{getDate(record.expressTime, 'yyyy-MM-dd HH:mm:ss')}</span>
    )
  }
  renderProduction = () => {
    const orderDetails = this.props.orderDetails;
    let orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult,
      productionResult = orderDetails && orderDetails.orderCommodityPurchaserResults,
      isPayment = (orderPurchaseResult && (orderPurchaseResult.status == 1 || orderPurchaseResult.status == 2 || orderPurchaseResult.status == 3)) ? false : true;

    if (orderPurchaseResult && productionResult) {
      return(
        <div className="order-detail-production">
          <div className="detail-title">
            <span>{intl.get('lv.order.allorder.orderNo')}：{orderPurchaseResult.orderNumber}</span>
            <span className="ml20">{intl.get('lv.order.allorder.detail.createTime')}：{getDate(orderPurchaseResult.createTime, 'yyyy-MM-dd HH:mm:ss')}</span>
            {this.parentOrderOperator()}
            <span className="detail-status">{ORDER_PARENT_STATUS[orderPurchaseResult.status]}</span>
          </div>
          <div className="detail-list-wrapper" id="detail-list-wrapper">
            <Table
              loading={false}
              dataSource={this.getDataSource()}
              columns={this.getColumns()}
              className="detail-table"
              pagination={false}
              rowKey={record => record.id}
              expandedRowRender={this.getRowExpanded.bind(this)}
              defaultExpandAllRows={isPayment}
            />
          </div>
          <div className="detail-total-sum">
            {this.getTotal(orderPurchaseResult)}
          </div>
        </div>
      )
    }
  }
  render() {
    const orderDetails = this.props.orderDetails;
    let orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult;

    return (
      <div className='order-all-orders-detail'>
        {this.renderProduction()}
        <OrderInfo orderDetails={this.props.orderDetails} />
        <PurchaseInfo orderDetails={this.props.orderDetails} />
        <OrderPayResults />
        <OrderInvoice />
      </div >
    );
  }
}

function mapStateToProps(state) {
  let order = state.get('order') && state.get('order').toJS() || {};
  let userInfo = state.get('userInfo') && state.get('userInfo').toJS() || {};
  return {
    ...order,
    symbol: userInfo && userInfo.symbol,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(OrdersDetail);
