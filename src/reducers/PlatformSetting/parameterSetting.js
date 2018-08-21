/**
 * @authors zhangwei
 * @date    2017-07-05
 * @module  参数设置
 */

import * as actionTypes from '../../constants/actionTypes.js';
import { Map } from "immutable";
const initState = Map({
  loading: false,
  list: []
});

// 头部信息
function parameterSetting(state = initState, action) {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.FETCH_PARAMETERS_LOADING:
      return state.merge({ loading: action.val });
    case actionTypes.FETCH_PARAMETERS:
      return state.merge({ ...action });
    default:
      return state;
  }
}

export default parameterSetting;
