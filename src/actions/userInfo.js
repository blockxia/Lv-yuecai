/**
 * @authors litengfei
 * @date    2017-11-22
 * @module  userinfo获取action
 */

import { push } from 'react-router-redux';
import Config from 'config';
import * as actionTypes from '../constants/actionTypes.js';
import { MAIN_PRIVILEGE, GETLANGURL_SUCCESS, FECH_COUNTRY_LIST, UPDATE_USER_INFO, UPDATE_HOTEL_INFO, SETCURRENTMENU, SYMBOL, SETCURRENTMENUCODE } from '../constants/actionTypes.js';
import { USER, USER_PRIVILEGE, BASIC } from '../constants/actionApi.js';
import { GetSlide, setCurrentMenu, setCurrentMenuCode } from './sliderBar';
import { browserHistory } from 'react-router';
import axios from '../api/axios.js';
import cookie from '../utils/cookie.js';
import storage from '../utils/storage';

const URL_PREFIX = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;
const pms_prefix = Config.env[Config.scheme].pmsPrefix;
const url_my_pms = Config.env[Config.scheme].basicUrl;
const url_open = Config.env[Config.scheme].openUrl;

let b = [];
let slide = [],
  first = [];
let slideResType2 = [];

function isEmptyObject(data) {
  for (const i in data) {
    if (data[i].node.resType <= 11) {
      return true;
    }
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
        isExist = true;
        return;
      }
      if (isEmptyObjectBasic(sub[i].childMap)) {
        existUrl(sub[i], url);
      }
    }
  }
}

function getPrivilege(dispatch, getState) {
  const hotelId = sessionStorage.getItem('hotelId') || '';
  const params = { includeChildren: 1, module: 'pimp_pu' }; 
  // const params = { module: 'pimp_pu', includeChildren: 1 }; 
  // axios.get(`${admin_prefix}${USER_PRIVILEGE['get']}`, { params: params })
  axios.get(`${url_prefix}${USER_PRIVILEGE['get']}`, { params: params })
    .then((data) => {
      if (data.data.success) {
        let privilege = data.data.data,
          privilegeChildMap = privilege && privilege.childMap,
          headerPrivilege = [],
          firstHeader = '', // 获取第一个header
          sliderPrivilege = {};

        for (const item in privilegeChildMap) {
          const node = privilegeChildMap[item].node;

          if (node && node.resType === 1) {
            headerPrivilege.push(privilegeChildMap[item]);
          }
        }
        // 当只存在更多，但是无任何更多权限的情况
        if ((headerPrivilege[0] && headerPrivilege[0].node.resCode === 'mo48sWPU') && !isEmptyObject(headerPrivilege[0] && headerPrivilege[0].childMap)) {
          headerPrivilege = [];
        }
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
        dispatch({
          type: MAIN_PRIVILEGE,
          state: {
            allPrivilege: privilege,
            headerPrivilege: headerPrivilege,
          }
        });
        
        const state = getState();
        const routing = state.get('routing') && state.get('routing').toJS() || {};
        const currentRouter = routing.locationBeforeTransitions.pathname;
        if (!currentRouter) {
          if (filterHeaderList && filterHeaderList.length && filterHeaderList[0].pageUrl !== '/lv/more') {
            dispatch({
              type: SETCURRENTMENU,
              payload: { currentMenu: firstHeader.node.pageUrl },
            });
            // browserHistory.push(filterHeaderList[0].pageUrl);
            dispatch(push(filterHeaderList[0].pageUrl))
          }
          sliderPrivilege = privilege[filterHeaderList[0].resCode];
          dispatch({
            type: MAIN_PRIVILEGE,
            state: {
              sliderPrivilege: sliderPrivilege, // 侧边栏数据
            }
          });
        } else {
          const lastIndex = findUrl(currentRouter, '/', 1); // 是否有二级菜单
          let currentMenu = lastIndex > -1 ? currentRouter.substring(1, lastIndex) : currentRouter && currentRouter.substr(1);
          isExist = false;
          existUrl(privilege, currentRouter);
          dispatch({
            type: SETCURRENTMENU,
            payload: { currentMenu: '/' + currentMenu },
          });
          if (isExist) {
            pageUrlData = {};
            filterUrl(privilege, currentMenu);
            dispatch({
              type: SETCURRENTMENUCODE,
              payload: { currentMenuCode: pageUrlData && pageUrlData.node && pageUrlData.node.resCode },
            });
            sliderPrivilege = pageUrlData && pageUrlData.childMap || {}; // 侧边栏数据
            dispatch({
              type: MAIN_PRIVILEGE,
              state: {
                sliderPrivilege: sliderPrivilege, // 侧边栏数据
              }
            });
            return;
          }
          if (filterHeaderList && filterHeaderList.length && filterHeaderList[0].pageUrl !== '/lv/more') {
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
            dispatch({
              type: MAIN_PRIVILEGE,
              state: {
                sliderPrivilege: sliderPrivilege, // 侧边栏数据
              }
            });
            dispatch({
              type: SETCURRENTMENUCODE,
              payload: { currentMenuCode: firstHeader && firstHeader.node.resCode },
            });
            dispatch({
              type: SETCURRENTMENU,
              payload: { currentMenu: firstHeader.node.pageUrl },
            });
            dispatch(push(filterHeaderList[0].pageUrl))
          }

        }
        if (!(headerPrivilege && headerPrivilege.length)) {
          dispatch(push('/permissionsNo'))
        }

      }
    })
}

function findUrl(str, char, index) {
  let n = str && str.indexOf(char);
  for (let i = 0; i < index; i++) {
    n = str && str.indexOf(char, n + 1);
  }
  return n;
};


// 判断登录
export const checkAuthWithoutNextFn = (routeObj) => {
  // return () => { };
  // debugger;
  // 没有匹配到任何url时404，不再走权限
  if (routeObj && routeObj.routes && (routeObj.routes.length === 2 || routeObj.routes.length === 3)) {
    let route1 = routeObj.routes[0],
      route2 = routeObj.routes[1],
      route3 = routeObj.routes[2];
    if ((route2 && route2.path === '*') || (route3 && route3.path === '*')) {
      return () => { };
    }
  }
  //网络错误时退出
  if(window.location.pathname.indexOf('/networkError') != -1) {
    return () => { };
  }

  if (window.location.pathname.includes('/welcome')) {
    return () => {};
  }
  return (dispatch, getState) => {
    let hash = window.location.hash,
      state = getState();

    // const userToken = cookie.get('ly_admin_token');
    const userToken = cookie.get('pms_token');
    let availableCounts = 0;
    let userId, userName, groupId, groupName;

    dispatch({
      type: SETCURRENTMENUCODE,
      payload: { currentMenuCode: '' },
    });
    
    if (userToken) {
      axios.get(`${pms_prefix}${BASIC['get_country']}`, {})
        .then((data) => {
          if (data && data.data && data.data.success) {
            dispatch({
              type: FECH_COUNTRY_LIST,
              payload: { country: data.data && data.data.data },
            });
          }
        });
      // 获取用户信息
      axios.get(`${URL_PREFIX}${USER['get_login_user_purchase']}?module=pimp_pu`).then((res) => {
        if(res.data.success) {
          let {userInfo={}, addonInfo={}} = res.data.data || {}
          userId = addonInfo.id;
          userName = addonInfo.purchaserName;
          groupId=addonInfo.groupId;
          groupName=addonInfo.groupName
          storage.put('userId', userId);
          storage.put('userName', userName);
          storage.put('groupId', groupId);
          storage.put('groupName', groupName);
          dispatch({
            type: UPDATE_USER_INFO,
            data: {
              users: userInfo,
              addonInfo: addonInfo
            } || {},
          });
          const routing = state.get('routing') && state.get('routing').toJS() || {};
          const currentRouter = routing.locationBeforeTransitions.pathname;
          let sliderBarMenu = state.get('sliderBar').toJS() || {};
          sliderBarMenu = sliderBarMenu && sliderBarMenu.currentMenuCode;
          if (currentRouter === '/' || !sliderBarMenu) {
            getPrivilege(dispatch, getState);
          }
        }else{
          if (res.data && res.data.code === 650218) {
            dispatch({
              type: MAIN_PRIVILEGE,
              state: {
                allPrivilege: {},
              }
            });
            dispatch(push('/permissionsNo'));
            return;
          }
          else if (res.data && res.data.code !== -9997) {
            dispatch({
              type: MAIN_PRIVILEGE,
              state: {
                allPrivilege: {},
              }
            });
            // dispatch(push('/networkError'));
            return;
          }
        }
        
      }).catch((res) => {
        if (res.data && res.data.code !== -9997) {
          dispatch({
            type: MAIN_PRIVILEGE,
            state: {
              allPrivilege: {},
            }
          });
          // dispatch(push('/networkError'));
          return;
        }
      });
    } else {
      window.location.href = url_open;
    }
  };
};
