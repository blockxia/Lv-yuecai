/**
 * @authors litengfei
 * @date    2018-08-16
 * @module  订单部分-reducers
 */

import {  FETCH_ORDER_AFTERSALES } from '../constants/actionTypes.js';
import { Map } from "immutable";
const initState = Map({
  loading: false,
  list: [],
  total: 0,
  currentPage: 1,
});

// 头部信息
function afterSales(state = initState, action) {
  switch (action.type) {
    case FETCH_ORDER_AFTERSALES:
      return state.merge(action.state);
    default:
      return state;
  }
}

export default afterSales;
