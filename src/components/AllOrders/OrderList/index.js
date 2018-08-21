/**
 * @authors wangqinqin
 * @date    2018-08-14
 * @module  订单-列表
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
import Config from 'config';

const ENV = process.env.NODE_ENV;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
let ORDER_STATUS = {};
const IMAGES_URL = Config.env[Config.scheme].imagesUrl;
// 图片的路径
const imgPath = ENV === 'dev' ? '/static/images/' : IMAGES_URL;
class OrdersList extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {

    }
    ORDER_STATUS = {
      1: intl.get('lv.order.allorder.status1'),
      2: intl.get('lv.order.allorder.list.parent.status2'),
      3: intl.get('lv.order.allorder.list.parent.status3'),
      7: intl.get('lv.order.allorder.list.parent.status4'),
    }
  }

  componentDidMount() {
    // this.props.getAllOrders({
    //   status: this.props.status,
    //   pn: 1,
    //   ps: 20,
    // });
  }
  onChangePage = (page, pageSize) => {
    let ordersParams = {};
    observer.pub('getSearchOrdersParmasAuth', (parmas) => {
      ordersParams = parmas;
    });
    this.props.getAllOrders({
      commodityMessage: ordersParams.commodityMessage,
      createTimeStart: ordersParams.createTimeStart,
      createTimeEnd: ordersParams.createTimeEnd,
      status: this.props.status,
      pn: page,
      ps: pageSize,
    });

  }
  jumpDetail = (obj) => {
    window.open(`./orderDetail?orderId=${obj.id}`);
  }
  getHasOrderList = () => {
    const orderList = this.props.orderList;
    return (
      <div>
        <SearchBar searchOrderList={this.props.getAllOrders} status={this.props.status} />
        <ul className="order-all-list-container">
          {orderList && orderList.map((item, idx) => {
            return (<li key={idx}>
              <div className="order-list-title">
                <span>{intl.get('lv.order.allorder.orderNo')}：{item.orderNumber}</span>
                <span className="ml20">{getDate(item.createTime, 'yyyy-MM-dd HH:mm:ss')}</span>
                <Button className="ft-green-btn" onClick={this.jumpDetail.bind(this, { id: item.id })}>{intl.get('lv.order.allorder.list.lookBtn')}</Button>
              </div>
              <div className="order-list-content">
                <span className="order-list-commodityNames">{item.commodityNames}</span>
                <span className="order-list-price">{this.props.symbol}{formatMoney(item.saleTotalPrice)}</span>
                <span className={`order-list-status order-list-status-${item.status}`}>{ORDER_STATUS[item.status]}</span>
              </div>
              <div className="order-list-cooment">
                {intl.get('lv.order.allorder.list.remark')}：{item.purchaseComment}
              </div>
            </li>)
          })}
        </ul>
      </div>
    );
  }
  getNoOrderList = () => {
    return (<div className="order-all-list-nodata">
      <img src={`${imgPath}/noData.png`} />
      <p>暂无相关信息</p>
    </div>)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const orderList = this.props.orderList;
    return (
      <div className='order-all-orders'>
        {orderList && orderList.length ? this.getHasOrderList() : this.getNoOrderList()}
        {this.props.total ? <div className="order-list-footer">
          <Pagination
            total={this.props.total}
            showTotal={total => `${intl.get('lv.order.allorder.list.pagenation', { total: this.props.total, page: this.props.currentPage})}`}
            pageSize={20}
            current={this.props.currentPage}
            onChange={this.onChangePage}
          />
        </div> : null }
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


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(OrdersList));
