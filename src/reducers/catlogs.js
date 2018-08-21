/**
 * @authors sunlei
 * @date    2018-08-13
 * @module  header 类目
 */

import * as actionTypes from '../constants/actionTypes.js';
import {Map} from "immutable";
const initialState = Map({});

// 头部信息
function catlogs(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case actionTypes.HEADER_CATLOGS:
      return state.merge({list: action.catlogs});
    default:
      return state;
  }
}

export default catlogs;
