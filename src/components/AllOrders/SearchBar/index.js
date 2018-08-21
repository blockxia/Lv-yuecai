/**
 * @authors litengfei
 * @date    2017-11-28
 * @module  地址搜索组件
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BaseComponent from 'components/Public/BaseComponent';
import Button from 'components/Common/Button';
import { observer } from 'utils/observer.js';
import { getDate, minusDate, getFirstDayOfYear } from 'utils/date.js';

import axios from 'api/axios';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;

import moment from 'moment';
import { Select, Form, Row, Col, Input } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

import * as OrdersActions from '../../../actions/order';

const translate = (name, title) => {
  return intl.get(title);
}

import './style.scss';

// 省份type
const TYPE_PROVINCE = 2;
// 城市type
const TYPE_CITY = 3;
const DEFAULT_STATE = {
  commodityMessage: '',
  createTimeStart: '',
  createTimeEnd: '',
};
let SELECT_STATE = [];
class SearchBar extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ...DEFAULT_STATE,
    };
    this.bindingState = this.props.bindingState ? { includeUnJoin: this.props.bindingState } : {};
    SELECT_STATE = [{
      id: '1',
      name: intl.get('lv.order.allorder.search.nearlythreemonths'), // 近3个月订单
    }, {
      id: '2',
      name: intl.get('lv.order.allorder.search.nearlysixmonths'), // 近半年订单
    }, {
      id: '3',
      name: intl.get('lv.order.allorder.search.2018year'), // 本年度订单
    }];
  }

  searchResult() {
    // 搜索订单
    this.props.searchOrderList(Object.assign({
      commodityMessage: this.state.commodityMessage,
      createTimeStart: this.state.createTimeStart,
      createTimeEnd: this.state.createTimeEnd,
      status: this.props.status,
    }));
  }

  clearResult() {
    this.setState({
      commodityMessage: '',
    });
    // this.props.clearData();
    this.props.form.resetFields(['createTime']);
    this.props.searchOrderList(Object.assign({
      status: this.props.status,
      ...DEFAULT_STATE,
    }));
  }

  componentWillMount() {
  }


  componentDidMount() {
    let form = this.props.form;
    observer.sub('getSearchOrdersParmasAuth', (calback) => {
      let parmas = Object.assign({
        commodityMessage: this.state.commodityMessage,
        createTimeStart: this.state.createTimeStart,
        createTimeEnd: this.state.createTimeEnd,
      });
      calback && calback(parmas)
    });
  }

  componentWillUnmount() {
    observer.unbind('getSearchOrdersParmasAuth');
  }


  createTimeChange = (e) => {
    const currentDay = getDate();
    if (e == 1) { // 近三个月
      this.setState({ createTimeStart: minusDate(currentDay, 90), createTimeEnd: currentDay });
    } else if (e == 2) {  // 近半年
      this.setState({ createTimeStart: minusDate(currentDay, 180), createTimeEnd: currentDay });
    } else if (e == 3) { // 本年
      this.setState({ createTimeStart: getFirstDayOfYear(), createTimeEnd: currentDay });
    }
  }
  searchKeyChange = (event) => {
    this.setState({
      commodityMessage: event.target.value,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const prop = this.props;
    const secondRegionList = this.props.secondRegionList;

    return (
      <div className="orders-list-search">
        <Form layout="inline">
          <Row>
            <FormItem
            >
              {getFieldDecorator('createTime', {
                initialValue: '0',
              })(
                <Select
                  style={{ width: 160 }}
                  placeholder={intl.get('lv.order.allorder.search.placeholder')}
                  onChange={this.createTimeChange}
                >
                  <Option value='0'>{intl.get('lv.common.all')}</Option>
                  {SELECT_STATE && SELECT_STATE.length && SELECT_STATE.map((item, key) => {
                    return (
                      <Option value={item.id && item.id.toString()} key={item.id}>{item.name}</Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem
              className="items searchKey"
            >
              <Search onChange={this.searchKeyChange}
                value={this.state.commodityMessage}
                placeholder={intl.get('lv.order.allorder.commodityMessage')}
                onSearch={this.searchResult.bind(this)}
                maxLength="50"
              />
            </FormItem>
            <FormItem className="search-btn-group">
              <Button size="default" type="primary" onClick={this.searchResult.bind(this)} className="ft-gray-btn">{intl.get('lv.common.query')}</Button>
              <Button size="default" className="ml10" onClick={this.clearResult.bind(this)}>{intl.get('lv.common.empty')}</Button>
            </FormItem>
          </Row>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.order,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(OrdersActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(SearchBar));