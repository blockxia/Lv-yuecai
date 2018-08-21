import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, DatePicker, Select, Form, Input, Radio, Popover, Modal, Col } from 'antd';
import Table from "components/Common/Table";
import message from "components/Common/message";
import * as Actions from '../../../../actions/order';
import Loading from 'components/Common/Loading';
import moment from 'moment';
import { browserHistory } from 'react-router';

import '../style.scss';
import './style.scss';
import { formatMoney } from '../../../../utils/tools';
import { PUBLIC_SEARCH_DATA_STATE } from '../../../../constants/actionTypes';
import { getDate } from '../../../../utils/date';
import { Record } from '../../../../../node_modules/immutable';
import Header from '../../../../../node_modules/antd/lib/calendar/Header';
import EditOrder from '../Dialog/EditOrder/index.js';
import EditCarriage from '../Dialog/EditCarriage/index.js';
import CancelOrder from '../Dialog/CancelOrder/index.js';

import storage from '../../../../utils/storage';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const confirm = Modal.confirm;
const statusMap = {
  1: '待付款',
  2: '待分配',
  3: '待发货',
  4: '待收货',
  5: '已收货',
  6: '已结算',
  7: '已取消',
}
class Alloted extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      orderData: {},
      currentOrder: {},
      currentPOrder: {},
      editOrder: false,
      editCarriage: false,
      cancelOrder: false,
    }
  }

  componentDidMount() {
    this.getOrderDetails();
  }
  getOrderDetails = () => {
    let orderId = this.props.params.orderId;
    this.props.getOrderDetails({ orderId });
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.details && JSON.stringify(nextprops.details) != '{}') {
      this.setState({ orderData: JSON.parse(JSON.stringify(nextprops.details)) })
    }
  }
  supplierChange = (orderIndex, supplierId) => {
    let orderCommodityPlatformResult = this.state.orderData.orderCommodityPlatformResult;
    let cOrder = orderCommodityPlatformResult[orderIndex];
    let cSupplier = cOrder.skuSupplierResultList.filter(order => {
      return order.id == supplierId
    })[0];
    cOrder.costPrice = cSupplier.buyPrice;
    cOrder.supplierId = supplierId;
    this.setState({ orderData: JSON.parse(JSON.stringify(this.state.orderData)) })
  }
  initTable = () => {
    let orderList = this.state.orderData && this.state.orderData.orderCommodityPlatformResult;
    let rowArray = [];
    let rowEle;
    orderList && orderList.map((order, index) => {
      rowEle = <tr key={order.sonOrderNumber + index}>
        <td colSpan={8} className='attachment'>
          <span className="lavel">
            子订单号：
          </span>
          <span className="value">
            {order.orderNumber}
          </span>
          <span className="lavel" style={{ marginLeft: '10px' }}>
            下单时间：
          </span>
          <span className="value">
            {getDate(order.createTime, 'yyyy-MM-dd HH:mm:ss')}
          </span>
        </td>
      </tr>
      rowArray.push(rowEle);
      rowEle = <tr key={order.sonOrderNumber}>
        <td>{order.commodityPhotoUrl}</td>
        <td>{order.commodityName}</td>
        <td>{order.commodityAttributes}</td>
        <td>{order.commodityNumber}</td>
        <td>{order.salePrice}</td>
        <td>{order.saleTotalPrice}</td>
        <td>{order.costPrice}</td>
      </tr>

      rowArray.push(rowEle);
      if (order.supplierName) {
        let content = (
          <div className='supplier-info'>
            <p>
              <span className='label'>
                联系人：
              </span>
              <span className='value'>
                {order.supplierContactName || '-'}
              </span>
            </p>
            <p><span className='label'>
              联系电话：
              </span>
              <span className='value'>
                {order.supplierTelephone || '-'}
              </span></p>
          </div>
        );
        rowEle = <tr key={index}>
          <td colSpan={8} className='attachment'>
            <span>供应商：</span>
            <Popover content={content}>
              <span style={{ cursor: "pointer" }}>
                {order.supplierName}
              </span>
            </Popover>
            {order.expressNumber && <span className="carriage">
              <span className="label">快递公司：</span>
              <span className="value">{order.expressName}，</span>
              <span className="label">快递单号：</span>
              <span className="value">{order.expressNumber}，</span>
              <span className="label">快递日期：</span>
              <span className="value">{getDate(order.expressTime, 'yyyy-MM-dd')}，</span>
              <span className="label">操作日期：</span>
              <span className="value">{getDate(order.expressTime, 'yyyy-MM-dd')}</span>
            </span>}
            <span className="status">
              <span className="lavel">
                状态：
              </span>
              <span className="value">
                {statusMap[order.status]}
              </span>
            </span>
          </td>
        </tr>;
        rowArray.push(rowEle);
      }
    })
    return rowArray;
  }
  redirectToList = () => {
    window.history.back();
  }
  render() {
    let orderData = this.state.orderData;
    const payStatus = {
      1: '待确认',
      2: '已确认',
      3: '已驳回'
    }
    const invoiceType = {
      1: '普通发票',
      2: '专用发票'
    }
    return (
      <div className='order-details'>
        <div className="order-details-header">
          <div className="header-item">
            <span className="label">
              订单号：
              </span>
            <span className="value">
              {
                orderData &&
                orderData.orderPlatformResult &&
                orderData.orderPlatformResult.orderNumber}
            </span>
          </div>
          <div className="header-item">
            <span className="label">
              预订日期：
              </span>
            <span className="value">
              {orderData &&
                orderData.orderPlatformResult &&
                getDate(orderData.orderPlatformResult.createTime, 'yyyy-MM-dd HH:mm:ss')}
            </span>
          </div>
        </div>
        <div className="order-list">
          <table className='order-table'>
            <thead className="ant-table-thead">
              <tr>
                <th>
                  <span>
                    图片
                  </span>
                </th>
                <th>
                  <span>
                    商品名称
                  </span>
                </th>
                <th>
                  <span>
                    规格
                  </span>
                </th>
                <th>
                  <span>
                    数量
                  </span>
                </th>
                <th>
                  <span>
                    销售价
                  </span>
                </th>
                <th>
                  <span>
                    商品金额
                  </span>
                </th>
                <th>
                  <span>
                    成本
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className='ant-table-tbody'>
              {
                this.initTable()
              }
            </tbody>
          </table>
          <div className="order-summary">
            <div className="summary">
              合计订单总金额： ¥ {orderData && orderData.orderPlatformResult ?
                `${formatMoney(orderData.orderPlatformResult.saleTotalPrice + orderData.orderPlatformResult.freightCharge)} 
              =
               ¥ ${formatMoney(orderData.orderPlatformResult.saleTotalPrice)}（商品总金额）
               ¥ ${formatMoney(orderData.orderPlatformResult.freightCharge)}（运费）` : ''}
            </div>
          </div>
          <div className="order-summary">
            <div className="summary">
              合计订单总成本：¥ {
                orderData && orderData.orderPlatformResult ?
                  formatMoney(orderData.orderPlatformResult.costTotalPrice) : ''}
            </div>
          </div>
        </div>
        <div className="order-pannel">
          <div className="title">
            收货人信息
          </div>
          <div className="item">
            <span className="label">
              采购商：
            </span>
            <span className="value">
              {
                orderData && orderData.orderPlatformResult ?
                  orderData.orderPlatformResult.purchaseName : ''
              }
            </span>
          </div>
          <div className="item">
            <span className="label">
              {
                orderData && orderData.orderPlatformResult ?
                  orderData.orderPlatformResult.purchaseName + '：' : ''
              }
            </span>
            <span className="value">
              {
                orderData && orderData.orderPlatformResult ?
                  orderData.orderPlatformResult.purchaseContactName + " " +
                  orderData.orderPlatformResult.purchaseAddress + " " +
                  orderData.orderPlatformResult.purchaseTelephone : ""
              }
            </span>
          </div>
        </div>
        <div className="order-pannel">
          <div className="title">
            支付信息
                    </div>
          {
            orderData && orderData.orderPayResult ?
              orderData.orderPayResult.map((opay, index) => {
                return <div className='pay-item' key={index}>
                  <div className="item">
                    <span className="label">
                      付款日期：
                  </span>
                    <span className="value">
                      {getDate(opay.payTime, 'yyyy-MM-dd HH:mm:ss')}
                    </span>
                  </div>
                  <div className="item">
                    <span className="label">
                      付款金额：
                </span>
                    <span className="value">
                      ¥ {formatMoney(opay.payPrice)}
                    </span>
                  </div>
                  <div className="item">
                    <span className="label">
                      付款备注：
                </span>
                    <span className="value">
                      {opay.payComment}
                    </span>
                  </div>
                  <div className="item">
                    <span className="label">
                      审核状态：
                </span>
                    <span className="value">
                      {payStatus[opay.status]}
                    </span>
                  </div>
                  <div className="item">
                    <span className="label">
                      确认人：
                </span>
                    <span className="value">
                      {opay.ensureName}
                    </span>
                  </div>
                </div>
              }) : ""
          }
        </div>
        <div className="order-pannel">
          <div className="title">
            发票信息（以下是采购商开票信息，平台将依据此开票信息向采购商开具发票。）
          </div>
          <div className="item">
            <span className="label">
              发票类型：
                    </span>
            <span className="value">
              {orderData && orderData.orderInvoicePlatformResult ?
                invoiceType[orderData.orderInvoicePlatformResult.invoiceType] : ''}
            </span>
          </div>
          <div className="item">
            <span className="label">
              发票抬头：
                    </span>
            <span className="value">
              {orderData && orderData.orderInvoicePlatformResult ?
                orderData.orderInvoicePlatformResult.companyName : ''}
            </span>
          </div>
          <div className="item">
            <span className="label">
              纳税人识别码：
                    </span>
            <span className="value">
              {orderData && orderData.orderInvoicePlatformResult ?
                orderData.orderInvoicePlatformResult.taxpayerNumber : ''}
            </span>
          </div>
          <div className="item">
            <span className="label">
              发票内容：
                    </span>
            <span className="value">
              {orderData && orderData.orderInvoicePlatformResult ?
                orderData.orderInvoicePlatformResult.content : ''}
            </span>
          </div>
        </div>
        <div className="order-pannel">
          <div className="title">
            订单备注
              </div>
          <div className="item">
            {
              orderData && orderData.orderPlatformResult ?
                orderData.orderPlatformResult.purchaseComment : ''
            }
          </div>
        </div>
        <div className="order-pannel">
          <div className="title">
            订单取消原因
              </div>
          <div className="item">
            {
              orderData && orderData.orderPlatformResult ?
                orderData.orderPlatformResult.cancelComment : ''
            }
            <br />
            {
              orderData && orderData.orderPlatformResult ?
                `【采购】
                【${orderData.orderPlatformResult.purchaseContactName}】
                【${getDate(orderData.orderPlatformResult.createTime, 'yyyy-MM-dd HH:mm:ss')}】`
                : ''
            }
            <br />
            {
              orderData && orderData.orderCommodityUpdateResult ?
                orderData.orderCommodityUpdateResult.map((uOrder, index) => {
                  return <div key={index}>
                    <p>【{uOrder.commodityName}】,【{uOrder.operateComment}】</p>
                    <p>【平台】,【{uOrder.operateName}】【{getDate(uOrder.operateTime, 'yyyy-MM-dd HH:mm:ss')}】</p>
                  </div>
                }) : ''
            }
          </div>
        </div>
        <div className="opt-container">
          <Button onClick={this.redirectToList}>返回</Button>
        </div>
      </div >
    );
  }
}

function mapStateToProps(state) {
  let order = state.get('order') && state.get('order').toJS() || {};
  // debugger
  return {
    ...order
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Alloted));
