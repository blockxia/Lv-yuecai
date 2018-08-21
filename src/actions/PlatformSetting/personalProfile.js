/**
 * @authors wangchen
 * @date    2018-08-16
 * @module  个人资料
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../../constants/actionTypes.js';
import {SETTING} from '../../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;



//获取个人资料信息
export function fetchList() {
    return dispatch => {
      axios.post(url_prefix + SETTING.PERSONALFILE_DATA, {}).then(res => {
        if (res.data.success) {
          dispatch({
            type: actionTypes.FETCH_PERSONAL_PROFILE,
            list: res.data.data || {},
          });
        }
        else {
          dispatch({
            type: actionTypes.FETCH_PERSONAL_PROFILE,
            list: {},
          });
        }
      }).catch(err => {
        dispatch({
          type: actionTypes.FETCH_PERSONAL_PROFILE,
          list: {},
        });
      });
    }
}

// 更新采购商信息
export function updateProfile(params,  successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + SETTING.UPDATE_PROFILE, params);
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
