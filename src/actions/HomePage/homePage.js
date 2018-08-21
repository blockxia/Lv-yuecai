/**
 * @authors wangchen
 * @date    2018-08-09
 * @module  首页
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../../constants/actionTypes.js';
import {SETTING,PURCHASE} from '../../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;


//请求轮播图数据
export function fetchListSlide() {
    return dispatch => {
      axios.post(url_prefix + PURCHASE.FETCH_LISTSLIDE_TYPE, {}).then(res => { 
        if (res.data.success) {
          dispatch({
            type: actionTypes.FETCH_PURCHASE_LISTSLIDE,
            listSlide: res.data.data || [],
            total: res.data.total || 0
          });
        }
        else {
          dispatch({
            type: actionTypes.FETCH_PURCHASE_LISTSLIDE,
            listSlide: [],
            total: 0
          });
        }
      }).catch(err => {
        dispatch({
          type: actionTypes.FETCH_PURCHASE_LISTSLIDE,
          listSlide: [],
          total: 0
        });
      });
    }
}

// 新增、修改轮播图
export function updateListSlide(params, isUpdate, successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + PURCHASE[isUpdate ? 'UPDATE_LISTSLIDE_TYPE' : 'ADD_LISTSLIDE_TYPE'], params);
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

// 删除轮播图
export function deleteListSlide(params, successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.get(url_prefix + PURCHASE['DELETE_LISTSLIDE_TYPE']+"?id="+params.id);
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

//请求首页菜单数据
export function fetchListHomePage() {
  return dispatch => {
    axios.post(url_prefix + PURCHASE.FETCH_HOMEPAGE_TYPE, {}).then(res => {
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_PURCHASE_HOMEPAGE,
          listHomePage: res.data.data || [],
          total: res.data.total || 0
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_PURCHASE_HOMEPAGE,
          listHomePage: [],
          total: 0
        });
      }
    }).catch(err => {
      dispatch({
        type: actionTypes.FETCH_PURCHASE_HOMEPAGE,
        listHomePage: [],
        total: 0
      });
    });
  }
}

//删除首页菜单
export function deleteListHomePage(params, successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.get(url_prefix + PURCHASE['DELETE_HOMEPAGE_TYPE']+"?id="+params.id);
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

// 新增、修改首页菜单
export function updateListHomePage(params, isUpdate, successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + PURCHASE[isUpdate ? 'UPDATE_HOMEPAGE_TYPE' : 'ADD_HOMEPAGE_TYPE'],params);
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

//请求首页模板数据
export function fetchListTemplet() {
  return dispatch => {
    axios.post(url_prefix + PURCHASE.FETCH_TEMPLET_TYPE, {}).then(res => {
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_PURCHASE_TEMPLET,
          listTemplet: res.data.data || [],
          total: res.data.total || 0
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_PURCHASE_TEMPLET,
          listTemplet: [],
          total: 0
        });
      }
    }).catch(err => {
      dispatch({
        type: actionTypes.FETCH_PURCHASE_TEMPLET,
        listTemplet: [],
        total: 0
      });
    });
  }
}


// 修改模板
export function updateTemplet(params, successCallback, failCallback) {
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + PURCHASE.ADD_TOSHOPPINGCART, params);
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

