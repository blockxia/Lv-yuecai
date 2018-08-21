/**
 * @authors wangqinqin
 * @date    2017-08-08
 * @module  侧边导航reducers
 */

import * as actionTypes from '../constants/actionTypes.js';
import {Map} from "immutable";

const initSlide = Map({
  // currentMenu: sessionStorage.getItem('currentMenu') || 'POakpT1Q',
  // currentSubMenu: sessionStorage.getItem('currentSubMenu') || '',
  // currentMenuCode: sessionStorage.getItem('currentMenuCode') || '',
  // currentSecondMenu: sessionStorage.getItem('currentSecondMenu') || '',
  currentMenu: '',
  currentSubMenu: '',
  currentMenuCode: sessionStorage.getItem('currentMenuCode') || '',
  currentSecondMenu: '',
  sliderBarMsg: {},
  operateStatistics: 0,
  localOrderStatistics: {},
  optionButtons: [],
});

// 头部信息
function sliderBar(state = initSlide, action) {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.SLIDERBAR_SUCCESS:
      return state.merge(payload);
    case actionTypes.SETCURRENTSUBMENU:
      // sessionStorage.setItem('currentSubMenu', payload.currentSubMenu);
      return state.merge(payload);
    case actionTypes.SETCURRENTMENU:
      // sessionStorage.setItem('currentMenu', payload.currentMenu);
      return state.merge(payload);
    case actionTypes.SETCURRENTMENUCODE:
      sessionStorage.setItem('currentMenuCode', payload.currentMenuCode);
      return state.merge(payload);
    case actionTypes.SETCURRENTSECONDMENU:
      // sessionStorage.setItem('currentSecondMenu', payload.currentSecondMenu);
      return state.merge(payload);
    case actionTypes.SLIDER_OPERATESTATISTICS:
      return state.merge(payload);
    case actionTypes.LOCALORDERSCLASS_SUCCESS:
      return state.merge(payload);
    case actionTypes.OPTIONBUTTONS:
      return state.merge(payload);
    default:
      return state;
  }
}

export default sliderBar;
