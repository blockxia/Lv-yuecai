/**
 * @authors wangchen
 * @date    2018-08-16
 * @module  个人资料
 */

import * as actionTypes from '../../constants/actionTypes.js';
import {Map} from "immutable";
const initState = Map({
  list: {},
});

// 头部信息
function account(state = initState, action) {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.FETCH_PERSONAL_PROFILE:
      return state.merge({...action});
    default:
      return state;
  }
}

export default account;
