/**
 * @authors zhangwei
 * @date    2018-07-05
 * @module  参数设置
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../../constants/actionTypes.js';
import { SETTING } from '../../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;

//获取所有参数
export function getAllParameters(params) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_PARAMETERS_LOADING,
      val: true
    });
    axios.post(url_prefix + SETTING.FETCH_ALL_PARAMETERS, params).then(res => {
      dispatch({
        type: actionTypes.FETCH_PARAMETERS_LOADING,
        val: false
      });
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_PARAMETERS,
          list: res.data.data || []
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_PARAMETERS,
          list: []
        });
      }
    }).catch(err => {
      dispatch({
        type: actionTypes.FETCH_PARAMETERS_LOADING,
        val: false
      });
      dispatch({
        type: actionTypes.FETCH_PARAMETERS,
        list: []
      });
    });
  }
}
//新建参数
export function createParameter(params, successCallback, errorCallback) {
  return dispatch => {
    axios.post(url_prefix + SETTING.CREATE_PARAMETERS, params).then(res => {
      if (res.data.success) {
        successCallback && successCallback();
      } else {
        errorCallback && errorCallback(res.data.msg);
      }
    })
  }
}
//修改参数
export function updateParameter(params, successCallback, errorCallback) {
  return dispatch => {
    axios.post(url_prefix + SETTING.UPDATE_PARAMETERS, params).then(res => {
      if (res.data.success) {
        successCallback && successCallback();
      } else {
        errorCallback && errorCallback(res.data.msg);
      }
    })
  }
}

//删除参数
export function delParameter(params, successCallback, errorCallback) {
  return dispatch => {
    axios.post(url_prefix + SETTING.DEL_PARAMETERS, params).then(res => {
      if (res.data.success) {
        successCallback && successCallback();
      } else {
        errorCallback && errorCallback();
      }
    })
  }
}
