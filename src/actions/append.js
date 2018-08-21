/**
 * @authors huyifan
 * @date    2018-04-08
 * @module  附加信息
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../constants/actionTypes.js';
import {APPEND} from '../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';

const url_prefix = Config.env[Config.scheme].prefix;

export function getAppend(params) {
  return async (dispatch, getState) => {
    try {
      let result = await axios.get(`${url_prefix}${APPEND['LIST']}`, { params: params });
      if (result.data.success) {
        dispatch(
          {
            type: actionTypes.APPEND_LIST,
            data: result.data.data
          }
        )
      }
    } catch (err) {

    }
  }
}

export function createAppend(params,callBack) {
  return async (dispatch, getState) => {
    try {
      let result = await axios.get(`${url_prefix}${APPEND['CREATE']}`, { params: params });
      if (result.data.success) {
        callBack && callBack()
      }else{
      }
    } catch (err) {

    }
  }
}

export function deleteAppend(params,callBack) {
  return async (dispatch, getState) => {
    try {
      let result = await axios.get(`${url_prefix}${APPEND['DELETE']}`, { params: params });
      if (result.data.success) {
        callBack && callBack()
      }else{
      }
    } catch (err) {

    }
  }
}

export function updateAppend(params,callBack) {
  return async (dispatch, getState) => {
    try {
      let result = await axios.get(`${url_prefix}${APPEND['UPDATE']}`, { params: params });
      if (result.data.success) {
        callBack && callBack()
      }
    } catch (err) {

    }
  }
}

export function queryAppend(params,callBack) {
  return async (dispatch, getState) => {
    try {
      let result = await axios.get(`${url_prefix}${APPEND['QUERY']}`, { params: params });
      if (result.data.success) {
        callBack && callBack()
      }
    } catch (err) {

    }
  }
}