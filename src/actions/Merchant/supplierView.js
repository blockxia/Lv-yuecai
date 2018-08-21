/**
 * @authors sunlei
 * @date    2018-07-18
 * @module  供应商查看
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

// 查询基本信息
export function fetchBasic(id) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
      state: {
        basicLoading: true
      }
    });
    axios.post(url_prefix + MERCHANT.FETCH_SUPPLIER_LIST, {id: +id}).then(res => {
      dispatch({
        type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
        state: {
          basicLoading: false,
          basic: res.data.success ? res.data.data || [] : []
        }
      });
    }).catch(err => {
      console.warn(err);
      dispatch({
        type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
        state: {
          basicLoading: false,
          basic: []
        }
      });
    })
  }
}
// 查询资质信息
export function fetchImages(id) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
      state: {
        imageLoading: true
      }
    });
    axios.post(url_prefix + MERCHANT.FETCH_SUPPLIER_IMAGES, {shopsId: +id, type: 1}).then(res => {
      dispatch({
        type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
        state: {
          imageLoading: false,
          images: res.data.success ? res.data.data || [] : []
        }
      });
    }).catch(err => {
      console.warn(err);
      dispatch({
        type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
        state: {
          imageLoading: false,
          images: []
        }
      });
    })
  }
}
// 查询银行账户
export function fetchAccount(id) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
      state: {
        accountLoading: true
      }
    });
    axios.post(url_prefix + MERCHANT.FETCH_SUPPLIER_ACCOUNT, {supplierId: +id, supplierType: 'SUPPLIER'}).then(res => {
      dispatch({
        type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
        state: {
          accountLoading: false,
          accountList: res.data.success ? res.data.data || [] : []
        }
      });
    }).catch(err => {
      console.warn(err);
      dispatch({
        type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
        state: {
          accountLoading: false,
          accountList: []
        }
      });
    })
  }
}


// 上传图片
export function uploadImage(file, images, basic) {
  let isReturn = images.some(it => {
    return JSON.parse(it.pictureAddress).url === file.url;
  })
  if (isReturn) {
    return {type: ''};
  }
    return dispatch => {
      let params = {
        shopsId: basic[0].id,
        shopsName: basic[0].supplyName,
        type: 1,
        pictureAddress: JSON.stringify(file)
      }
      axios.post(url_prefix + MERCHANT.FETCH_SUPPLIER_ADD_IMAGES, params).then(res => {
        message.success(res.data.success ? '上传成功' : '上传失败');
        if (res.data.success) {
          images.push(res.data.data);
        }
        dispatch({
          type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
              state: {
                  images: [...images]
              }
        });
      });
    }
}

// 删除图片
export function removeImage(file, images, success, fail) {
  return async dispatch => {
    try{
      let url = file.url ? file.url : file.response.data.url;
      let line = images.filter(it => JSON.parse(it.pictureAddress).url === url)[0] || {};
      let res =  await axios.post(url_prefix + MERCHANT.FETCH_SUPPLIER_DELETE_IMAGES, {id: line.id || ''})
      if (res.data.success) {
        message.success('操作成功');
        images = images.filter(it => it.id !== file.uid);
        dispatch({
          type: actionTypes.FETCH_SUPPLIER_VIEW_DATA,
          state: {
              images: [...images]
          }
      });
        success();
      }
      else {
        message.warn('操作失败');
        fail();
      }
    }
    catch (err) {
      console.warn(err);
      message.warn('操作失败');
      fail();
    }
  }
}
