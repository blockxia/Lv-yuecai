/**
 * @authors wangqinqin
 * @date    2017-08-08
 * @module  导航reducers
 */

import * as actionTypes from '../constants/actionTypes.js';
import {Map} from "immutable";
const initialState = Map({});

// 头部信息
function header(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case actionTypes.HEADER_SUCCESS:
      return state.merge(payload);
    case actionTypes.HEADER_CHANGE:
      return state.merge(action.state);
    default:
      return state;
  }
}

export default header;
