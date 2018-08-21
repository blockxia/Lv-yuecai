/**
 * @authors sunlei
 * @date    2017-08-14
 * @module  搜索页面
 */

import * as actionTypes from '../constants/actionTypes.js';
import {Map} from "immutable";
const initialState = Map({
  
});

// 国家信息
function search(state = initialState, action) {
	const { payload } = action;
  switch (action.type) {
    case actionTypes.FETCH_ITEM_LIST:
      return state.merge(action.state);
    default:
      return state;
  }
}

export default search;
