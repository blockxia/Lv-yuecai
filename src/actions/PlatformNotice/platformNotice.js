/**
 * @authors wangchen
 * @date    2018-07-06
 * @module  平台公告
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../../constants/actionTypes.js';
import {NOTICE,SETTING} from '../../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;



//公告信息列表查询
export function fetchList(params) {
    return dispatch => {
      dispatch({
        type: actionTypes.FETCH_NOTICE_DATA,
        state: {loading: true}
      });
      axios.post(url_prefix + NOTICE.FETCH_NOTICE_LIST, params).then(res => {
        dispatch({
          type: actionTypes.FETCH_NOTICE_DATA,
          state: {loading: false}
        });  
        if (res.data.success) {
          dispatch({
            type: actionTypes.FETCH_NOTICE_DATA,
            list: res.data.data || [],
            total: res.data.total || 0,
            params
          });
          dispatch({
            type: actionTypes.HEADER_CHANGE,
            state: {
              noticeCount: (res.data.data || []).filter(i => i.isRead === 1).length
            }
          });
        }
        else {
          dispatch({
            type: actionTypes.FETCH_NOTICE_DATA,
            list: [],
            total: 0
          });
        }
      }).catch(err => {
          dispatch({
            type: actionTypes.FETCH_NOTICE_DATA,
            list: [],
            total: 0
          });
        });
    }
}
// 公告信息附件查询
export function fetchAttachmentList(params) {
  return dispatch => {
    axios.post(url_prefix + NOTICE.FETCH_ATTACHMENT_LIST, params).then(res => {
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_ATTACHMENT_DATA,
          attachmentList: res.data.data || [],
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_ATTACHMENT_DATA,
          attachmentList: [],
        });
      }
    }).catch(err => {
        dispatch({
          type: actionTypes.FETCH_ATTACHMENT_DATA,
          attachmentList: [],
        });
      });
  }
}


// 公告信息更新接口
export function fetchUpdateList(params,isUpdate ,successCallback,failCallback) { 
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + NOTICE[isUpdate ? 'FETCH_Update_LIST' : 'FETCH_ADD_LIST'], params);
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

// 公告信息批量置为已读
export function fetsetListisRead(params,successCallback,failCallback) { 
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + NOTICE.FETCH_LIST_ISREAD, params);
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

// 公告信息批量删除
export function fetsetListDelete(params,successCallback,failCallback) { 
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + NOTICE.FETCH_LIST_DELETE, params);
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

// 公告附件删除
export function deleteAttachment(params,successCallback,failCallback) { 
  return async dispatch => {
    try{
      let res = await axios.post(url_prefix + NOTICE.DELETE_ATTACHMENT, params);
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



