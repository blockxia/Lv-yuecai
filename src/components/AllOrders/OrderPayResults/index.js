/**
 * @authors wangqinqin
 * @date    2018-08-14
 * @module  订单-支付信息
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Button, DatePicker, Select, Form, Input, Radio, Popover, Modal, Pagination } from 'antd';
import Table from "components/Common/Table";
import * as Actions from '../../../actions/order';
import Loading from 'components/Common/Loading';
import Tabs from 'components/Common/Tabs';
import moment from 'moment';
import BaseComponent from 'components/Public/BaseComponent';
import SearchBar from 'components/AllOrders/SearchBar';
import intl from 'react-intl-universal';
import { Link } from 'react-router';
import { observer } from 'utils/observer.js';

import './style.scss';
import { formatMoney, getParamString } from '../../../utils/tools';
import { getDate, addDate } from '../../../utils/date';
import PaymentDialog from '../PaymentDialog';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const Option = Select.Option;

let ORDER_PARENT_STATUS = {};
let ORDER_CHILD_STATUS = {};
let ORDER_PAYTYPE = {}; // 支付订单类型
let PAY_STATYUS = {}; // 支付订单审核状态

class OrderPayResults extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {

    }
    ORDER_PARENT_STATUS = {
      1: intl.get('lv.order.allorder.status1'), // 待付款
      2: intl.get('lv.order.allorder.list.parent.status2'), // 待分配
      3: intl.get('lv.order.allorder.list.parent.status3'), // 已拆分
      4: intl.get('lv.order.allorder.list.parent.status4'), // 已取消
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
    ORDER_PAYTYPE = {
      1: '内部转账',
      2: '银行转账',
    }
    PAY_STATYUS = {
      1: '待确认',
      2: '已确认',
      3: '已驳回'
    }
  }

  componentDidMount() {
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
  keyReceving = () => {
    // 当存在一个收货的情况，那么亮显一键收货
    let orderDetails = this.props.orderDetails,
      productionResult = orderDetails && orderDetails.orderCommodityPurchaserResults;
    let waitGoods = productionResult && productionResult.filter((item) => {
      return item.status && (Number(item.status) === 4);
    });
    return (<Button disabled={waitGoods && waitGoods.length ? false : true}>{intl.get('lv.order.allorder.detail.tablist.receiving')}</Button>)
  }
  getColumns() {
    let columns = [
      { title: intl.get('lv.order.allorder.detail.tablist.commodityPhotoUrl'), dataIndex: 'commodityPhotoUrl', key: 'commodityPhotoUrl', render: (text, record) => (<Link className="commodity-photoUrl"><img src={record.commodityPhotoUrl} /></Link>) },
      { title: intl.get('lv.order.allorder.detail.tablist.commodityName'), dataIndex: 'commodityName', key: 'commodityName' },
      { title: intl.get('lv.order.allorder.detail.tablist.commodityNumber'), dataIndex: 'commodityNumber', key: 'commodityNumber' },
      {
        title: intl.get('lv.order.allorder.detail.tablist.salePrice'), dataIndex: 'salePrice', key: 'salePrice', render: (text, record) => {
          return (<span className="ft-money">{this.props.symbol + formatMoney(record.salePrice)}</span>);
        }
      },
      {
        title: intl.get('lv.order.allorder.detail.tablist.saleTotalPrice'), dataIndex: 'saleTotalPrice', key: 'saleTotalPrice', render: (text, record) => {
          return (<span className="ft-money">{this.props.symbol + formatMoney(record.saleTotalPrice)}</span>);
        }
      },
      {
        title: this.keyReceving(), dataIndex: 'status', key: 'status', render: (text, record) => {
          return ORDER_CHILD_STATUS[record.status];
        }
      },
    ];
    return columns;
  }
  expandDesc = (record) => {
    if (record.status && (Number(record.status) === 1)) {
      return (<div>{`快递公司：${record.expressName}，快递编号：${record.expressNumber}，快递日期：${getDate(record.expressTime)}`}</div>);
    }
    return '';
  }
  renderProduction = () => {
    const orderDetails = this.props.orderDetails;
    let orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult,
      productionResult = orderDetails && orderDetails.orderCommodityPurchaserResults;
    if (orderPurchaseResult && productionResult) {
      return (
        <div className="order-detail-payResult">
          
        </div>
      )
    }
  }
  getHasPayTotal = (orderDetails) => {
    let result = orderDetails.orderPurchaseResult,
      orderPayResults = orderDetails.orderPayResults,
      bankAccountResult = orderDetails && orderDetails.bankAccountResult,
      payTotal = '0.00',
      payTotalList = [];

    if (result.saleTotalPrice && result.freightCharge) {
      payTotal = formatMoney(Number(result.saleTotalPrice) + Number(result.freightCharge));
    } else if (result.saleTotalPrice) {
      payTotal = formatMoney(Number(result.saleTotalPrice));
    }
    payTotalList = orderPayResults && orderPayResults.filter((item) => {
      return item.status == 2;
    });
    let totalMoney = payTotalList && payTotalList.reduce((prev, cur) => {
      return Number(prev) + Number(cur.payPrice);
    }, 0);
    return (<span>
      支付总金额： <span className="ft-money">{this.props.symbol}{payTotal}</span>&nbsp;&nbsp;&nbsp;&nbsp;
      已付款：<span className="ft-money">{this.props.symbol}{totalMoney}</span>
      {payTotal != totalMoney ? <Button className="ml20 ft-red-btn">
        <PaymentDialog
          pamentList={this.props.pamentList}
          fetchPayType={this.props.fetchPayType}
          bankAccountResult={bankAccountResult}
          orderPurchaseResult={result}
          orderId={result && result.id}
          callBackFunc={this.props.getOrdersDetails}
          confirmAddPay={this.props.confirmAddPay}
        >支付</PaymentDialog>
      </Button> : null}
    </span>)
  }
  hasPayOrder = () => {
    let orderDetails = this.props.orderDetails,
      orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult,
      orderPayResults = orderDetails && orderDetails.orderPayResults;
    if (orderPayResults && orderPayResults.length && (orderPurchaseResult && orderPurchaseResult.status != 7)) {
      return (
        <div className="order-all-orders-payResult">
          <div className="hasPay-title">支付信息</div>
          <ul className="hasPay-content">{orderPayResults && orderPayResults.map((item, i) => {
            return (<li key={i}>
              <div className="ft-left">
                <p>付款时间：{getDate(item.payTime, 'yyyy-MM-dd HH:mm:ss')}</p>
                <p>付款金额：{ORDER_PAYTYPE[item.payType]} &nbsp;&nbsp;{this.props.symbol}{formatMoney(item.payPrice)}</p>
                <p>付款备注：{item.payComment}</p>
              </div>
              <div className="ft-right">{PAY_STATYUS[item.status]}</div>
            </li>);
          })}</ul>
          <div className="hasPay-total">
            {this.getHasPayTotal(orderDetails)}
          </div>
        </div>
      )
    }
  }
  noPayOrder = () => {
    let orderDetails = this.props.orderDetails,
      orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult,
      bankAccountResult = orderDetails && orderDetails.bankAccountResult,
      cancelOrderTime = '',
      cancelCuurentTime = '',
      days = 0,
      hours = 0;
    if (this.props.cancelOrderTime && orderPurchaseResult.createTime) {
      let createDate = getDate(orderPurchaseResult.createTime, 'yyyy-MM-dd HH:mm:ss');
      cancelOrderTime = addDate(createDate, Number(this.props.cancelOrderTime), 'yyyy-MM-dd HH:mm:ss');
      let date3 = new Date(cancelOrderTime).getTime() - new Date(createDate).getTime();
      days = Math.floor(date3 / (24 * 3600 * 1000)); // 相差天数
      //计算出小时数
      let leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
      hours = Math.floor(leave1 / (3600 * 1000))
    }
    if (bankAccountResult && (orderPurchaseResult && orderPurchaseResult.status != 7)) {
      return (<div className="order-all-orders-payResult">
        <div className="noPay-title">支付信息<span className="ml20 ft-red">（订单待付款状态，剩{days}天{hours}小时自动取消订单）</span></div>
        <div className="noPay-content">
          <p>账户名称：{bankAccountResult.accountName}</p>
          <p>开户银行：{bankAccountResult.bankName}</p>
          <p>银行账户：{bankAccountResult.bankCard}</p>
        </div>
        <div className="noPay-tips"><i className="i-icon mr10">&#xe6b1;</i>请在实际付款后，请及时确认付款操作，以方便平台确认收款和发货。</div>
      </div>)
    }
    
  }
  render() {
    const orderDetails = this.props.orderDetails;
    let orderPayResults = orderDetails && orderDetails.orderPayResults;
    return (
      <div>
        {orderPayResults && orderPayResults.length ? this.hasPayOrder() : this.noPayOrder()}
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


export default connect(mapStateToProps, mapDispatchToProps)(OrderPayResults);
