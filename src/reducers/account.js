/**
 * @authors wangqinqin
 * @date    2017-08-14
 * @module  个人信息
 */

import * as actionTypes from '../constants/actionTypes.js';
import {Map} from "immutable";
const initState = Map({
  buttonLoading:false //个人资料保存按钮状态
});

// 头部信息
function account(state = initState, action) {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.UPDATE_ACCOUNT:
      return state.merge(payload);
    case actionTypes.LOADDING_USER_BUTTON_STATE:
      return state.merge(payload);
    default:
      return state;
  }
}

export default account;
