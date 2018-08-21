/**
 * @authors sunlei
 * @date    2018-06-07
 * @module  财务设置
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../../constants/actionTypes.js';
import {SETTING,BANK} from '../../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;


export function tabChange(key) {
  return {
    type: actionTypes.FINANCE_TAB_CHANGE,
    state: {
      tabKey: key
    }
  };
}

// 查询平台银行账户
export function fetchAccountList() {
  return  dispatch => {
    dispatch({
      type: actionTypes.FINANCE_CHANGE_LOADING,
      val: true
    });
     axios.post(url_prefix + SETTING.FETCH_ACCOUNT, {}).then(res => {
      dispatch({
        type: actionTypes.FINANCE_CHANGE_LOADING,
        val: false
      });  
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_FINANCE,
          state: {
            accountList: res.data.data || []
          }
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_FINANCE,
          state: {
            accountList: []
          }
        });
      }
     })
    
  }
}

// 查询发票信息
export function fetchInvoice() {
  return  dispatch => {
    dispatch({
      type: actionTypes.FINANCE_CHANGE_LOADING,
      val: true
    });
     axios.post(url_prefix + SETTING.FETCH_INVOICE, {}).then(res => {
      dispatch({
        type: actionTypes.FINANCE_CHANGE_LOADING,
        val: false
      });  
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_FINANCE,
          state: {
            invoiceList: res.data.data || []
          }
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_FINANCE,
          state: {
            invoiceList: []
          }
        });
      }
     })
    
  }
}

// 新增、修改 银行账户
export function updateAccount (id, params, success, fail) {
  return async dispatch => {
    try {
      let res = await axios.post(url_prefix + SETTING[!!id ? 'UPDATE_ACCOUNT' : 'ADD_ACCOUNT'], id ? {...params, id} : params);
      if (res.data.success) {
        success();
      }
      else {
        fail();
      }
    }
    catch (err) {
      console.warn(err);
    }
  }
}

// 新增、修改 发票信息
export function updateInvoice (id, params, success, fail) {
  return async dispatch => {
    try {
      let res = await axios.post(url_prefix + SETTING[!!id ? 'UPDATE_INVOICE' : 'ADD_INVOICE'], id ? {...params, id} : params);
      if (res.data.success) {
        success();
      }
      else {
        fail();
      }
    }
    catch (err) {
      console.warn(err);
    }
  }
}

// 设置默认账户
export function setDefault (id, success, fail) {
  return async dispatch => {
    try {
      let res = await axios.post(url_prefix + SETTING.SET_DEFAULT, {id});
      if (res.data.success) {
        success && success();
      }
      else {
        fail && fail();
      }
    }
    catch (err) {
      console.warn(err);
      fail && fail();
    }
  }
}



