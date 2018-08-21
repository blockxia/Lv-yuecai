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


// 查询供应商列表
export function fetchList(params) {
  return  dispatch => {
    dispatch({
      type: actionTypes.FETCH_PURCHASE_DATA,
      state: {loading: true}
    });
     axios.post(url_prefix + MERCHANT.FETCH_PURCHASE_LIST, params).then(res => {
      dispatch({
        type: actionTypes.FETCH_PURCHASE_DATA,
        state: {loading: false}
      });  
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_PURCHASE_DATA,
          state: {
            list: res.data.data || [],
            total: res.data.total || 0,
            params
          }
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_PURCHASE_DATA,
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

// 查询采购商类型
export function fetchPurchaseTypes() {
  return dispatch => {
    axios.post(url_prefix + SETTING.FETCH_COMMON_VAR_BY_CODE, {typeCodes: 'purchaserType'}).then(res => {
      dispatch({
        type: actionTypes.FETCH_PURCHASE_DATA,
        state: {
          purchaseTypes: res.data.success ? res.data.data || [] : []
        }
      });
    })
  }
}

// 查询价格类型
export function fetchPriceTypes() {
  return dispatch => {
    axios.post(url_prefix + SETTING.FETCH_PRICE_TYPE, {}).then(res => {
      dispatch({
        type: actionTypes.FETCH_PURCHASE_DATA,
        state: {
          priceTypes: res.data.success ? res.data.data || [] : []
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

// 采购商增加/修改
export function addOrUpdate(id, params, success, fail) {
  return async dispatch => {
    if (id) {
      params.id = id;
    }
    try{
      let res = await axios.post(url_prefix + MERCHANT[id ? 'PURCHASE_UPDATE' : 'PURCHASE_ADD'], params);
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
