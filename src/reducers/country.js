/**
 * @authors wangqinqin
 * @date    2017-08-08
 * @module  国家信息-区号
 */

import * as actionTypes from '../constants/actionTypes.js';
import {Map} from "immutable";
const initialState = Map({
  country: [],
});

// 国家信息
function country(state = initialState, action) {
	const { payload } = action;
  switch (action.type) {
    case actionTypes.FECH_COUNTRY_LIST:
      return state.merge(payload);
    default:
      return state;
  }
}

export default country;
