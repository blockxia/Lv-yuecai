/**
 * @author litengfei
 * @date 2017-08-15 
 * @module 国际化获取
 */
import {GETLOCALES} from '../constants/actionTypes.js';
import {Map} from "immutable";
const initState = Map({
  locales:[]
})

export default function locales(state = initState, action) {
  switch (action.type) {
    case GETLOCALES:
     return state.updateIn(['locales'],val=>action.data);
    default:
      return state
  }
}
