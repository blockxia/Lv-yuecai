/**
 * @author litengfei
 * @date 2017-11-28
 * @module 地址搜索reducer
 */
import { ADDRESS_SEARCH_INIT} from 'constants/actionTypes';
import {Map} from "immutable";
//默认state
const initState = Map(
  {
  countryID: 0,  //国家id
  country: [],
  province: [],
  city: [],
  region: [],
}
);

export default function addressSearch(state = initState, action) {
  switch (action.type) {
    case ADDRESS_SEARCH_INIT:
      return state.merge(action.state);;
    default:
      return state;
  }
}