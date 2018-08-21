/**
 * @authors litengfei
 * @date    2017-11-21
 * @module  导航action
 */

import axios from 'api/axios';
import Config from 'config';
import { push } from 'react-router-redux';
import { browserHistory } from 'react-router';
import * as actionTypes from '../constants/actionTypes.js';
import { USER_PRIVILEGE,CATEGORY, CART } from '../constants/actionApi.js';
import storage from 'utils/storage';

const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;
const pms_prefix = Config.env[Config.scheme].pmsPrefix;

const quneryOrders = [];
function isEmptyObject(data) {
  for (const i in data) {
    if(data[i].node.resType <= 11){
      return true;
    }
  }
  return false;
}

function filter(data) {
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

// 导航
export function LayoutHeader() {
  return (dispatch) => {
    if (window.location.hash.indexOf('/account') < 0) {
      const hotelId = sessionStorage.getItem('hotelId') || '';
      const params = { includeChildren: 1, module: 'pimp_pu' }; 
      // 请求header菜单
      // axios.get(`${admin_prefix}${USER_PRIVILEGE['get']}`, { params: params }).then((result) => {
      axios.get(`${url_prefix}${USER_PRIVILEGE['get']}`, { params: params }).then((result) => {
        if (result.data.success) {
          dispatch({
            type: actionTypes.HEADER_SUCCESS,
            payload: result.data.data,
          });
          
          const url = browserHistory.getCurrentLocation().pathname;
          const path = url.split('/');
          const del = path.splice(0, 1);
          const resultUrl = path.splice(0, 2);
          const currentUrl = '/' + resultUrl.join('/');
          const childMap = result.data.data.childMap;
          const fLevel = [];
          let code = '';
          for (const item in childMap) {
            const node = childMap[item].node;
            if (node && node.resType === 1) {
              fLevel.push(childMap[item]);
            }
          }
          fLevel.map((item) => {
            if (item.node.pageUrl === currentUrl) {
              code = item.node.resCode;
              return;
            }
          });
          return;
          
        } else {
          dispatch({
            type: actionTypes.HEADER_FAILURE,
            payload: result.data.data,
          });
          // window.location.reload();
        }
        return result;
      }).catch((error) => {
        dispatch({
          type: actionTypes.HEADER_FAILURE,
          payload: error,
        });
      });
    }
  };
};

// 查询类目
export function fetchCatlogs() {
  return dispatch => {
    return axios.post(url_prefix + CATEGORY.FETCH_ALL_COMMODITY, {}).then(res => {
      if (res.data.success) {
        dispatch({
          type: actionTypes.HEADER_CATLOGS,
          catlogs: res.data.data || []
        });
      }
    })
  }
}

// 查询购物车数量
export function fetchCartNum() {
  return dispatch => {
    return axios.post(url_prefix + CART.FETCH_CART_NUM, {}).then(res => {
      if (res.data.success) {
        dispatch({
          type: actionTypes.HEADER_CHANGE,
          state: {
            cartNum: res.data.data || 0
          }
        });
      }
      else {
        dispatch ({
          type: actionTypes.HEADER_CHANGE,
          state: {
            cartNum:  0
          }
        });
      }
    })
  }
}