/**
 * @authors sunlei
 * @date    2018-06-07
 * @module  财务设置
 */

import * as actionTypes from '../../constants/actionTypes.js';
import {Map} from "immutable";
const initState = Map({
  tabKey: '1'
});

// 头部信息
function account(state = initState, action) {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.FINANCE_TAB_CHANGE:
      return state.merge(action.state);
    case actionTypes.FINANCE_CHANGE_LOADING:
      return state.set('loading', action.val);
    case actionTypes.FETCH_FINANCE:
      return state.merge({...action.state});
    default:
      return state;
  }
}

export default account;
