/**
 * @authors wangchen
 * @date    2018-08-09
 * @module  首页
 */

import * as actionTypes from '../../constants/actionTypes.js';
import {Map} from "immutable";
const initState = Map({
  listSlide: [],
  listHomePage: [],
  listTemplet: [],
  total: 0,
});

// 头部信息
function account(state = initState, action) {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.FETCH_PURCHASE_LISTSLIDE:
      return state.merge({...action});
    case actionTypes.FETCH_PURCHASE_HOMEPAGE:
      return state.merge({...action});
    case actionTypes.FETCH_PURCHASE_TEMPLET:
      return state.merge({...action});
    default:
      return state;
  }
}

export default account;
