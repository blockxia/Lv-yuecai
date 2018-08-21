/**
 * @authors wangchen
 * @date    2018-08-15
 * @module  购物车
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../../constants/actionTypes.js';
import {SETTING,CART} from '../../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;



export function fetchList() {
    return dispatch => {
      dispatch({
        type: actionTypes.PRICE_LOADING_CHANGE,
        val: true
      });
      axios.post(url_prefix + CART.FETCH_BUYCART_LIST, {}).then(res => {
        dispatch({
          type: actionTypes.FETCH_BUYCART_LIST,
          val: false
        });
        if (res.data.success) {
          dispatch({
            type: actionTypes.FETCH_BUYCART_LIST,
            list: res.data.data || [],
            total: res.data.total || 0
          });
          dispatch({
            type: actionTypes.HEADER_CHANGE,
            state: {
              cartList: res.data.data || []
            }
          });
        }
        else {
          dispatch({
            type: actionTypes.FETCH_BUYCART_LIST,
            list: [],
            total: 0
          });
        }
      }).catch(err => {
        dispatch({
          type: actionTypes.FETCH_BUYCART_LIST,
          val: false
        });
        dispatch({
          type: actionTypes.FETCH_BUYCART_LIST,
          list: [],
          total: 0
        });
      });
    }
}

// 修改购物车商品数量
export function updateNumber(params, successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + CART.UPDATE_BUYCART_NUM, params);
      if (res.data.success) {
        successCallback && successCallback();
      }
      else {
        failCallback && failCallback(res.data.code);
      }
    }
    catch (err){
      failCallback && failCallback();
    }
  }
}
// 删除购物车商品
export function deleteCommodity(params, successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + CART.DELETE_BUYCART_COMMODITY, params);
      if (res.data.success) {
        successCallback && successCallback();
      }
      else {
        failCallback && failCallback(res.data.code);
      }
    }
    catch(err) {
      failCallback && failCallback();
    }
  }
}
