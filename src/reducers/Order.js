/**
 * @authors wangqinqin
 * @date    2018-08-14
 * @module  订单部分-reducers
 */

import { FETCH_ORDER_ALLORDERS } from '../constants/actionTypes.js';
import { Map } from "immutable";
import reducers from './index.js';
const initState = Map({
  loading: false,
  orderList: [],
  details: {},
  total: 0,
  currentPage: 1,
  orderDetails: {},
  detailLoading: false,
  pamentList: [],
  paymentLoading: false,
  countOrderNumber: '',
  cancelOrderTime: '',
});

// 头部信息
function order(state = initState, action) {
  const { payload } = action;
  switch (action.type) {
    case FETCH_ORDER_ALLORDERS:
      return state.merge(action.state);
    default:
      return state;
  }
}

export default order;
