/**
 * @authors wangqinqin
 * @date    2017-09-25
 * @module  新增浮层的国家联动数据
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../constants/actionTypes.js';
import { push } from 'react-router-redux';
import Config from 'config';

const url_prefix = Config.env[Config.scheme].prefix;

// 获取国家
export function GetNewPopCountry(params) {
  return (dispatch) => {
    axios.get(`${url_prefix}/sys/get_country.json`, { params: params })
      .then((data) => {
        if (data.data.success) {
          dispatch({
            type: actionTypes.NEWPOPCOUNTRY,
            payload: { newPopCountry: data.data.data },
          });
        }
        return data;
      });
  };
}

// 获取省份
export function GetNewPopProvince(params) {
  return (dispatch) => {
    axios.get(`${url_prefix}/sys/get_location.json`, { params: params })
      .then((data) => {
        if (data.data.success) {
          dispatch({
            type: actionTypes.NEWPOPPROVINCE,
            payload: { newPopProvince: data.data.data },
          });
        }
        return data;
      });
  };
}

// 获取城市
export function GetNewPopCity(params) {
  return (dispatch) => {
    axios.get(`${url_prefix}/sys/get_location.json`, { params: params })
      .then((data) => {
        if (data.data.success) {
          dispatch({
            type: actionTypes.NEWPOPCITY,
            payload: { newPopCity: data.data.data },
          });
        }
        return data;
      });
  };
}

// 获取行政区
export function GetNewPopRegion(params) {
  return (dispatch) => {
    axios.get(`${url_prefix}/sys/get_location.json`, { params: params })
      .then((data) => {
        if (data.data.success) {
          dispatch({
            type: actionTypes.NEWPOPREGION,
            payload: { newPopRegion: data.data.data },
          });
        }
        return data;
      });
  };
}

// 获取货币符号
export function GetNewPopCurrency(params) {
  return (dispatch) => {
    axios.get(`${url_prefix}/sys/get_country_currency.json`, { params: params })
      .then((data) => {
        if (data.data.success) {
          dispatch({
            type: actionTypes.NEWPOPCURRENCY,
            payload: { newPopCurrency: data.data.data },
          });
        }
        return data;
      });
  };
}

// 清空选择数据
export function NewPopClearData() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.NEWPOPPROVINCE,
      payload: { newPopProvince: {} },
    });
    dispatch({
      type: actionTypes.NEWPOPCITY,
      payload: { newPopCity: {} },
    });
    dispatch({
      type: actionTypes.NEWPOPREGION,
      payload: { newPopRegion: {} },
    });
    dispatch({
      type: actionTypes.NEWPOPCURRENCY,
      payload: { newPopCurrency: {} },
    });
  };
}
