/**
 * @authors wangchen
 * @date    2017-07-07
 * @module  平台公告
 */

import * as actionTypes from '../../constants/actionTypes.js';
import {Map} from "immutable";
const initState = Map({
  loading: false,
  commonLoading: false,
  list: [],
  attachmentList:[],
  total: 0
});

// 头部信息
function platformNotice(state = initState, action) {
  const { payload } = action; 
  switch (action.type) {
    case actionTypes.FETCH_NOTICE_DATA:
      return state.merge({...action});
    case actionTypes.FETCH_ATTACHMENT_DATA:
      return state.merge({...action});
    default:
      return state;
  }
}

export default platformNotice;
