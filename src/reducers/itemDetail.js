/**
 * @authors sunlei
 * @date    2017-08-16
 * @module  商品详情
 */

import * as actionTypes from '../constants/actionTypes.js';
import {Map} from "immutable";
const initialState = Map({
  
});

function itemDetail(state = initialState, action) {
	const { payload } = action;
  switch (action.type) {
    case actionTypes.FETCH_ITEM_DETAIL:
      return state.merge(action.state);
    default:
      return state;
  }
}

export default itemDetail;
