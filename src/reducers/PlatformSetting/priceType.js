/**
 * @authors sunlei
 * @date    2017-06-07
 * @module  价格类型设置
 */

import * as actionTypes from '../../constants/actionTypes.js';
import {Map} from "immutable";
const initState = Map({
  loading: false,
  commonLoading: false,
  list: [],
  total: 0,
  // params: {
  //   pn: 1,
  //   ps: 10
  // }
});

// 头部信息
function account(state = initState, action) {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.PRICE_LOADING_CHANGE:
      return state.merge({loading: action.val});
    case actionTypes.PRICE_COMMON_LOADING_CHANGE:
      return state.merge({commonLoading: action.val});
    case actionTypes.FETCH_PRICE_DATA:
      return state.merge({...action});
    default:
      return state;
  }
}

export default account;
