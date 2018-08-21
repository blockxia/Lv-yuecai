/**
 * @authors wangqinqin
 * @date    2017-08-08
 * @module  二级导航
 */

import axios from 'api/axios';
import * as actionTypes from '../constants/actionTypes.js';
import Config from 'config';
import { push } from 'react-router-redux';
import { browserHistory } from 'react-router';
const url_prefix = Config.env[Config.scheme].prefix;
// const slideUrl = '/mock/596f24a4a1d30433d837c216/example/mock2';
const slideUrl = '/privilege/get_user_privilege.json';

let b = [];
let slide = [];
function isEmptyObject(data) {
  for (const i in data) { 
    if(data[i].node.resType <= 11){
      return true;
    }
  }
  return false;
}
function isEmptyObject2(obj) {
  for (const name in obj) {
    return false; // 返回false，不为空对象
  }
  return true; // 返回true，为空对象
}
const quneryOrders = [];

function filterSlider(data) {
  if (isEmptyObject(data && data.childMap)) {
    const sub = data.childMap;
    for (const i in sub) {
      // debugger;
      if (isEmptyObject(sub[i].childMap) && !hashSlider(sub[i].childMap) && sub[i].node.resType <= 11) {
        slide.push({
          resName: sub[i].node.resName,
          resCode: sub[i].node.resCode,
          pageUrl: sub[i].node.pageUrl,
        });
      } else if (!isEmptyObject(sub[i].childMap) && sub[i].node.resType <= 11) {
        slide.push({
          resName: sub[i].node.resName,
          resCode: sub[i].node.resCode,
          pageUrl: sub[i].node.pageUrl,
        });
      }
      if (isEmptyObject(sub[i].childMap)) {
        filterSlider(sub[i]);
      }
    }
  }
}

function filter(data) {
  if (isEmptyObject(data.childMap)) {
    const sub = data.childMap;
    for (const i in sub) {
      if (sub[i].node.resType === 13) {
        b.push({
          resName: sub[i].node.resName,
          resCode: sub[i].node.resCode,
        });
      }
      if (isEmptyObject(sub[i].childMap)) {
        filter(sub[i]);
      }
    }
  }
}
function filterLocal(data) {
  for (const item in data) {
    if (data[item] && data[item].node && data[item].node.resType === 2) {
      quneryOrders.push({ node: data[item].node });
    } else {
      if (data[item].childMap) {
        const sub = data[item].childMap;
        for (const i in sub) {
          if (sub[i].node.resType === 2) {
            quneryOrders.push(sub[i]);
          }
          if (isEmptyObject(sub[i].childMap)) {
            filter(sub[i]);
          }
        }
      }
    }
  }
}
function hashSlider(child) {
  if (isEmptyObject2(child)) { // 为空
    return false;
  }
  for (const i in child) {
    if (child[i] && child[i].node && child[i].node.resType <= 11) {
      return true;
    }
  }
}

export function GetSlide(params) {
  return (dispatch, getState) => {
    const state = getState();
    const app = state.get('app') && state.get('app').toJS() || {};
    const oldAllPrivilege = app.allPrivilege;
    let childMap = oldAllPrivilege.childMap;
    let sliderPrivilege = childMap[params.resCode];
    if (params.resParentCode === 'mo48sWPU') {
      sliderPrivilege = childMap[params.resParentCode].childMap[params.resCode];
    }
    slide = [];
    filterSlider(sliderPrivilege);
    if (slide && slide.length) {
      browserHistory.push(slide[0].pageUrl);
    } else {
      if (params.pageUrl) {
        browserHistory.push(params.pageUrl);
      }
    }
    
  };
}

export function setCurrentMenu(params) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.SETCURRENTMENU,
      payload: params,
    });
  };
}

export function setCurrentSubMenu(params) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.SETCURRENTSUBMENU,
      payload: params,
    });
  };
}

export function setCurrentMenuCode(params) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.SETCURRENTMENUCODE,
      payload: params,
    });
  };
}
export function setCurrentSecondMenu(params) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.SETCURRENTSECONDMENU,
      payload: params,
    });
  };
}

