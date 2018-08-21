/**
 * @authors wangqinqin
 * @date    2018-08-14
 * @module  订单
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, DatePicker, Select, Form, Input, Radio, Popover, Modal } from 'antd';
import Table from "components/Common/Table";
import * as Actions from '../../../actions/order';
import Loading from 'components/Common/Loading';
import Tabs from 'components/Common/Tabs';
import moment from 'moment';
import BaseComponent from 'components/Public/BaseComponent';
import OrderList from 'components/AllOrders/OrderList';
import OrdersDetail from 'components/AllOrders/OrdersDetail';
import intl from 'react-intl-universal';

import './style.scss';
import { formatMoney, getParamString } from '../../../utils/tools';
import { getDate } from '../../../utils/date';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
class AllOrders extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {

    }
  }

  componentDidMount() {
    this.props.getAllOrders({
      pn: 1,
      ps: 20,
    });
  }
  changeTabs = (e) => {
    this.props.getAllOrders({
      status: e == 'all' ? '' : e,
      pn: 1,
      ps: 20,
    });
  }
  renderTabs = () => {
    let countOrderNumber = this.props.countOrderNumber;
    return (<Tabs defaultActiveKey="all" onChange={this.changeTabs}>
      <TabPane tab={intl.get('lv.order.allorder.all')} key="all">
        <OrderList status="" />
      </TabPane>
      <TabPane tab={`${intl.get('lv.order.allorder.status1')}${countOrderNumber ? '（' + (countOrderNumber['waitPayNumber']) + '）' : ''}`} key="1">
        <OrderList status="1" />
      </TabPane>
      <TabPane tab={`${intl.get('lv.order.allorder.status4')}${countOrderNumber ? '（' + (countOrderNumber['waitReceive']) + '）' : ''}`} key="4">
        <OrderList status="4" />
      </TabPane>
      <TabPane tab={intl.get('lv.order.allorder.status5')} key="5">
        <OrderList status="5" />
      </TabPane>
      <TabPane tab={intl.get('lv.order.allorder.status7')} key="7">
        <OrderList status="7" />
      </TabPane>
    </Tabs>);
  }
  render() {
    const currentPage = getParamString(location.href, 'source');
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='order-all-orders'>
        
        {this.renderTabs()}

        <Loading display={this.props.loading ? 'block' : 'none'} />
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


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AllOrders));
