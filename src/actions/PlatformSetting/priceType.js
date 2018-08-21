/**
 * @authors sunlei
 * @date    2018-06-06
 * @module  价格类型设置
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../../constants/actionTypes.js';
import {SETTING} from '../../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;

// const currentLocale = Tools.getCurrentLocale();
// intl.init({
//   currentLocale,
//   locales: {
//     [currentLocale]: require(`../locales/${currentLocale}.json`),
//   },
// });

export function fetchList() {
    return dispatch => {
      dispatch({
        type: actionTypes.PRICE_LOADING_CHANGE,
        val: true
      });
      axios.post(url_prefix + SETTING.FETCH_PRICE_TYPE, {}).then(res => {
        dispatch({
          type: actionTypes.PRICE_LOADING_CHANGE,
          val: false
        });
        if (res.data.success) {
          dispatch({
            type: actionTypes.FETCH_PRICE_DATA,
            list: res.data.data || [],
            total: res.data.total || 0
          });
        }
        else {
          dispatch({
            type: actionTypes.FETCH_PRICE_DATA,
            list: [],
            total: 0
          });
        }
      }).catch(err => {
        dispatch({
          type: actionTypes.PRICE_LOADING_CHANGE,
          val: false
        });
        dispatch({
          type: actionTypes.FETCH_PRICE_DATA,
          list: [],
          total: 0
        });
      });
    }
}
// 查询 市场价公共参数
export function fetchCommonVar() {
  return dispatch => {
    dispatch({
      type: actionTypes.PRICE_COMMON_LOADING_CHANGE,
      val: true
    });
    axios.post(url_prefix + SETTING.FETCH_COMMON_VAR_BY_CODE, {typeCodes: 'priceRatio'}).then(res => {
      dispatch({
        type: actionTypes.PRICE_COMMON_LOADING_CHANGE,
        val: false
      });
      if (res.data.success) {
        console.log(res.data.data);
      }
    }).catch(err => {
      dispatch({
        type: actionTypes.PRICE_COMMON_LOADING_CHANGE,
        val: false
      });
    });
  }
}
// 新增、修改价格类型
export function updatePrice(params, isUpdate, successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + SETTING[isUpdate ? 'UPDATE_PRICE_TYPE' : 'ADD_PRICE_TYPE'], params);
      if (res.data.success) {
        message.success('操作成功');
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
// 删除价格类型
export function deletePrice(params, successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + SETTING['DELETE_PRICE_TYPE'], params);
      if (res.data.success) {
        message.success('操作成功');
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
