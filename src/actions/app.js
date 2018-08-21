/**
 * @author litengfei
 * @date 2017-10-28
 * @module 入口
 */
import intl from 'react-intl-universal';
import axios from 'api/axios';
import Config from 'config';
import { push } from 'react-router-redux';
import { browserHistory } from 'react-router';
const URL_PREFIX = Config.env[Config.scheme].prefix;
import { MAIN_PRIVILEGE, SETCURRENTMENU, SETCURRENTMENUCODE } from 'constants/actionTypes';
import { USER, USER_PRIVILEGE, BASIC } from '../constants/actionApi.js';

const admin_prefix = Config.env[Config.scheme].adminPrefix;
const pms_prefix = Config.env[Config.scheme].pmsPrefix;
const url_prefix = Config.env[Config.scheme].prefix;

function main() {

}

function isEmptyObject(data) {
  for (const i in data) {
    if (data[i].node.resType <= 11) {
      return true;
    } 
    // return false;
  }
  return false;
}
function isEmptyObjectBasic(data) {
  for (const i in data) {
    return true;
  }
  return false;
}

let filterHeaderList = [];
function filterHeader(data) {
  if (isEmptyObject(data.childMap)) {
    const sub = data.childMap;
    for (const i in sub) {
      if (!isEmptyObject(sub[i].childMap) && sub[i].node.resType <= 11) {
        filterHeaderList.push({
          resType: sub[i].node.resType,
          resName: sub[i].node.resName,
          resCode: sub[i].node.resCode,
          pageUrl: sub[i].node.pageUrl,
          resParentCode: sub[i].node.resParentCode,
        });
        return;
      } else {
        if (isEmptyObject(sub[i].childMap)) {
          filterHeader(sub[i]);
        }
      }
    }
  }
}
// 返回同URL下的数据
let pageUrlData = {};
function filterUrl(data, url) {
  if (isEmptyObject(data.childMap)) {
    const sub = data.childMap;
    for (const i in sub) {
      if ('/' + url === sub[i].node.pageUrl) {
        // return sub[i];
        pageUrlData = sub[i];
        return;
      }
      if (isEmptyObject(sub[i].childMap)) {
        filterUrl(sub[i], url);
      }
    }
  }
}

// 是否存在URL
let isExist = false;
function existUrl(data, url) {
  if (isEmptyObjectBasic(data.childMap)) {

    const sub = data.childMap;
    for (const i in sub) {
      if (url === sub[i].node.pageUrl) {
        // return true;
        isExist = true;
        return;
      }
      if (isEmptyObjectBasic(sub[i].childMap)) {
        existUrl(sub[i], url);
      }
    }
  }
}
function findUrl(str, char, index) {
  let n = str && str.indexOf(char);
  for (let i = 0; i < index; i++) {
    n = str && str.indexOf(char, n + 1);
  }
  return n;
};

function handlePrivilege(dispatch, getState, privilege, headerPrivilege, currentRouter, from, dropMenu) {
  let privilegeChildMap = privilege && privilege.childMap,
    firstHeader = '', // 获取第一个header
    sliderPrivilege = {};
  firstHeader = headerPrivilege && headerPrivilege[0];
  filterHeaderList = [];
  if (!isEmptyObject(firstHeader && firstHeader.childMap)) {
    if (firstHeader) {
      filterHeaderList.push({
        resType: firstHeader.node.resType,
        resName: firstHeader.node.resName,
        resCode: firstHeader.node.resCode,
        pageUrl: firstHeader.node.pageUrl,
        resParentCode: firstHeader.node.resParentCode,
      });
    }
    
  } else {
    filterHeader(firstHeader);
  }

  if (!currentRouter && from == 'new') {
    sliderPrivilege = privilege[filterHeaderList[0].resCode];
    if (!dropMenu) {
      dispatch({
        type: MAIN_PRIVILEGE,
        state: {
          sliderPrivilege: sliderPrivilege, // 侧边栏数据
        }
      });
    }
    if (filterHeaderList && filterHeaderList.length && filterHeaderList[0].pageUrl !== '/lv/more') {
      dispatch({
        type: SETCURRENTMENU,
        payload: { currentMenu: firstHeader.node.pageUrl },
      });
      dispatch(push(filterHeaderList[0].pageUrl))
    }
    return;
  }
  const lastIndex = findUrl(currentRouter, '/', 1); // 是否有二级菜单
  let currentMenu = lastIndex > -1 ? currentRouter.substring(1, lastIndex) : currentRouter && currentRouter.substr(1);
  isExist = false;
  existUrl(privilege, currentRouter);
  dispatch({
    type: SETCURRENTMENU,
    payload: { currentMenu: '/' + currentMenu },
  });
  
  // 通过pathname 豁免个别无菜单页面跳转时被判定为无效菜单情况
  let pathname = window.location.pathname; 
  if (isExist || pathname.includes('/orderDetail') || true) {
    pageUrlData = {};
    filterUrl(privilege, currentMenu);
    sliderPrivilege = pageUrlData && pageUrlData.childMap || {}; // 侧边栏数据
    dispatch({
      type: SETCURRENTMENUCODE,
      payload: { currentMenuCode: pageUrlData && pageUrlData.node && pageUrlData.node.resCode },
    });
    dispatch({
      type: MAIN_PRIVILEGE,
      state: {
        isExistUrl: true,
        sliderPrivilege: sliderPrivilege, // 侧边栏数据
      }
    });
    return;
  }

  if (filterHeaderList && filterHeaderList.length && filterHeaderList[0].pageUrl !== '/lv/more' && from == 'new') {
    let firstHeaderChild = firstHeader && firstHeader.childMap;
    if (firstHeader.node.resCode === 'mo48sWPU') { // 存在更多的情况
      let morePrivilege = [];
      for (const e in firstHeaderChild) {
        const node = firstHeaderChild[e].node;

        if (node && node.resType === 2) {
          morePrivilege.push(firstHeaderChild[e].childMap);
        }
      }
      sliderPrivilege = morePrivilege[0];
    } else {
      sliderPrivilege = firstHeaderChild;
    }
    if (!dropMenu) {
      dispatch({
        type: MAIN_PRIVILEGE,
        state: {
          sliderPrivilege: sliderPrivilege, // 侧边栏数据
        }
      });
    }
    dispatch({
      type: SETCURRENTMENUCODE,
      payload: { currentMenuCode: firstHeader && firstHeader.node.resCode },
    });
    dispatch({
      type: SETCURRENTMENU,
      payload: { currentMenu: firstHeader.node.pageUrl },
    });
    dispatch(push(filterHeaderList[0].pageUrl));
  }

  if (!(headerPrivilege && headerPrivilege.length) && from == 'new') {
    dispatch(push('/permissionsNo'));
  }
  
}
// dropMenu 是否为切换门店
function getPrivilege(dropMenu) {
  return (dispatch, getState) => {
    dispatch({
      type: MAIN_PRIVILEGE,
      state: {
        isExistUrl: false,
      }
    });
    const hotelId = sessionStorage.getItem('hotelId') || '';
    const params = { includeChildren: 1, module: 'pimp_pu'}; 
    // return axios.get(`${admin_prefix}${USER_PRIVILEGE['get']}`, { params: params })
    return axios.get(`${url_prefix}${USER_PRIVILEGE['get']}`, { params: params })
      .then((data) => {
        if (data.data.success) {
          let privilege = data.data.data,
            privilegeChildMap = privilege && privilege.childMap,
            headerPrivilege = [],
            sliderPrivilege = {};
          
          for (const item in privilegeChildMap) {
            const node = privilegeChildMap[item].node;
            
            if (node && node.resType === 1) {
              headerPrivilege.push(privilegeChildMap[item]);
            }
          
          }
          
          if ((headerPrivilege[0] && headerPrivilege[0].node.resCode === 'mo48sWPU') && !isEmptyObject(headerPrivilege[0].childMap)) {
            headerPrivilege = [];
          }

          const state = getState();
          const routing = state.get('routing') && state.get('routing').toJS() || {};
          const currentRouter = routing.locationBeforeTransitions.pathname;
          if (!dropMenu) {
            dispatch({
              type: MAIN_PRIVILEGE,
              state: {
                allPrivilege: privilege,
                headerPrivilege: headerPrivilege,
              }
            });
          }
          dispatch({
            type: MAIN_PRIVILEGE,
            state: {
              isExistUrl: false,
            }
          });
          return handlePrivilege(dispatch, getState, privilege, headerPrivilege, currentRouter, 'new', dropMenu);
          
        }
      })
  }
}


function updateSlidePrivilege (location) {
  return (dispatch, getState) => {
    const state = getState();
    const app = state.get('app') && state.get('app').toJS() || {};
                  
    let oldAllPrivilege = app.allPrivilege, 
      currentRouter = location.pathname,
      sliderPrivilege = {},
      headerPrivilege = app.headerPrivilege;
    sliderPrivilege = handlePrivilege(dispatch, getState, oldAllPrivilege, headerPrivilege, currentRouter, 'update'); 
  }
}

// 更新是否刷新
function updateExistUrl() {
  return (dispatch, getState) => {
    dispatch({
      type: MAIN_PRIVILEGE,
      state: {
        isExistUrl: false,
      }
    });
  }
}

/**
 * export函数
 */
export {
  main,
  getPrivilege,
  updateSlidePrivilege,
  updateExistUrl,
}