/**
 * @authors sunlei
 * @date    2018-07-12
 * @module  供应商设置
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../../constants/actionTypes.js';
import {MERCHANT, SETTING, ACCOUNT} from '../../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;
const pms_prefix = Config.env[Config.scheme].pmsPrefix;



// 查询商品一级类目
export function fetchItemTypes () {
    return dispatch => {
        axios.post(url_prefix + MERCHANT.FETCH_ITEM_TYPE, {grade: 1}).then(res => {
            dispatch({
                type: actionTypes.FETCH_SUPPLIER_DATA,
                state: {
                    itemTypes: res.data? res.data.data || [] : []
                }
            });
        }).catch(err => {
            console.warn(err);
            dispatch({
                type: actionTypes.FETCH_SUPPLIER_DATA,
                state: {
                    itemTypes: []
                }
            });
        });
    }
}

// 查询供应商列表
export function fetchList(params) {
  return  dispatch => {
    dispatch({
      type: actionTypes.FETCH_SUPPLIER_DATA,
      state: {loading: true}
    });
     axios.post(url_prefix + MERCHANT.FETCH_SUPPLIER_LIST, params).then(res => {
      dispatch({
        type: actionTypes.FETCH_SUPPLIER_DATA,
        state: {loading: false}
      });  
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_SUPPLIER_DATA,
          state: {
            list: res.data.data || [],
            total: res.data.total || 0,
            params
          }
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_SUPPLIER_DATA,
          state: {
            list: [],
            total: 0,
            params
          }
        });
      }
     })
    
  }
}

// 查询供应商级别
export function fetchLevel() {
  return dispatch => {
    axios.post(url_prefix + SETTING.FETCH_COMMON_VAR_BY_CODE, {typeCodes: 'supplierType'}).then(res => {
      dispatch({
        type: actionTypes.FETCH_SUPPLIER_DATA,
        state: {
          levels: res.data.success ? res.data.data || [] : []
        }
      });
    })
  }
}

// 校验账号是否存在
export function validateUser(name, success, fail) {
  return async dispatch => {
    try {
      let res = await axios.post(pms_prefix + ACCOUNT.validate_user, {name});
      if (res.data.success) {
        if (res.data.data) {
          success && success();
        }
        else {
          fail && fail();
        }
      }
    }
    catch (err) {
      console.warn(err);
    }
  }
}

// 供应商增加/修改
export function addOrUpdate(id, params, success, fail) {
  return async dispatch => {
    if (id) {
      params.id = id;
    }
    try{
      let res = await axios.post(url_prefix + MERCHANT[id ? 'SUPPLIER_UPDATE' : 'SUPPLIER_ADD'], params);
      if (res.data.success) {
        success && success();
      }
      else {
        fail && fail(res.data.code);
      }
    }
    catch (err) {
      fail && fail();
      console.warn(err);
    }
  }
}
