/**
 * @authors wangchen
 * @date    2018-08-15
 * @module  购物车
 */

import * as actionTypes from '../../constants/actionTypes.js';
import {Map} from "immutable";
const initState = Map({
  loading: false,
  commonLoading: false,
  list: [],
  total: 0,
});

// 头部信息
function account(state = initState, action) {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.FETCH_BUYCART_LIST:
      return state.merge({...action});
    default:
      return state;
  }
}

export default account;
