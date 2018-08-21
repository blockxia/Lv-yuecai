/**
 * @authors wangqinqin
 * @date    2018-08-14
 * @module  订单-发票
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
import { getDate } from '../../../utils/date';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const Option = Select.Option;

let ORDER_PARENT_STATUS = {};
let ORDER_CHILD_STATUS = {};
let ORDER_PAYTYPE = {}; // 支付订单类型
let PAY_STATYUS = {}; // 支付订单审核状态
let INVOICETYPE = {};

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
    INVOICETYPE = {
      1: '普通发票',
      2: '专用发票',
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
  getInvoiceInfo = () => {
    let orderDetails = this.props.orderDetails,
      orderPurchaseResult = orderDetails && orderDetails.orderPurchaseResult,
      invoiceResult = orderDetails && orderDetails.orderInvoicePlatformResult;
    if (invoiceResult && (orderPurchaseResult && orderPurchaseResult.status != 7)) {
      return (<div className="order-all-orders-invoice">
        <div className="invoice-title">发票信息</div>
        <div className="invoice-content">
          <p>发票类型：{INVOICETYPE[invoiceResult.invoiceType]}</p>
          <p>发票抬头：{invoiceResult.companyName}</p>
          <p>纳税人识别码：{invoiceResult.taxpayerNumber}</p>
          <p>发票内容：{invoiceResult.content}</p>
        </div>
      </div>)
    }

  }
  render() {
    const orderDetails = this.props.orderDetails;
    return (
      <div>
        {this.getInvoiceInfo()}
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
