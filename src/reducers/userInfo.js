import * as actionTypes from '../constants/actionTypes.js';
import {Map} from "immutable";

const initialState = Map({
  symbol: '￥'
});

export default function userinfo(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SAVE_USER_INFO:
      return state.merge(action.data);
    case actionTypes.UPDATE_USER_INFO:
      return state.merge(action.data);
    case actionTypes.UPDATE_HOTEL_INFO:
      return state.merge(action.data);
    default:
      return state
  }
}
