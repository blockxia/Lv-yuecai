/**
 * @author wangqinqin
 * @date 2017-09-07
 * @module main-reducer
 */
import { MAIN_PRIVILEGE } from 'constants/actionTypes';
import {Map} from "immutable";
const defaultState = Map({
  allPrivilege: null,
  headerPrivilege: [],
  isExistUrl: false,
  sliderPrivilege: {},
});

export default function rooms(state = defaultState, action) {
  switch (action.type) {
    case MAIN_PRIVILEGE:
      return state.merge(action.state);
    default:
      return state;
  }
}