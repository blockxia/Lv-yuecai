/**
 * @authors wangchen
 * @date    2017-08-13
 * @module  结算页面
 */

import * as actionTypes from '../../constants/actionTypes.js';
import {Map} from "immutable";
const initState = Map({
  details: {},
  total: 0,
});

// 头部信息
function account(state = initState, action) {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.FETCH_SETTLEMENT_LIST:
      return state.merge({ ...action });
    default:
      return state;
  }
}

export default account;
