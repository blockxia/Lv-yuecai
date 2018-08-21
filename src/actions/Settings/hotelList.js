/**
 * @author litengfei
 * @date 2017-11-30 
 * @module 门店列表action
 */
import {HOTEL_LIST_MANAGER} from '../../constants/actionTypes';
import intl from 'react-intl-universal';
import { push } from 'react-router-redux';
import cookie from 'utils/cookie';
import message from 'components/Common/message';
import axios from 'api/axios';
import Config from 'config';
const URL_PREFIX = Config.env[Config.scheme].prefix;
// 接口功能枚举
const URL_NAME_GROUP = {
  group_hotel_list: '/crs/setting/group/hotel_list.json',
  group_hotel_unbinding: '/crs/setting/group/unbinding.json',
  group_update_management: '/crs/setting/group/update_management.json',
};

// 页大小
const PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

function dispatchGroupList(dispatch, params={}) {
  params.ps = PAGE_SIZE;
  // 获取房态页房型房号列表
  axios.get(`${URL_PREFIX}${URL_NAME_GROUP['group_hotel_list']}`, { params: params }).then((result) => {
    if (result.data.success) {
      dispatch({
        type: HOTEL_LIST_MANAGER,
        state : {
          hotelList: result.data.data || [],
          hotelTotal: result.data.total,
          currentPage: params.pn || DEFAULT_PAGE,
          displayLoading: 'none',
          searchParams: params,
        }
      });
    }
  });
}

function getGroupList(params) {
  return (dispatch, getState) => {
    dispatch({
      type: HOTEL_LIST_MANAGER,
      state : {
        displayLoading: 'block',
      }
    });
    
    let state = getState(),
      hotelList = state.hotelList,
      searchParams = hotelList.searchParams;

    params = Object.assign({}, searchParams, params);;
    
    dispatchGroupList(dispatch, params);
  };
}

function removeRalation(hotelId, callback) {
  return (dispatch, getState) => {
    let state = getState(),
      hotelList = state.hotelList,
      currentPage = hotelList.currentPage,
      hotelTotal = hotelList.hotelTotal - 1,
      totalPage = hotelTotal % PAGE_SIZE === 0 ? hotelTotal / PAGE_SIZE : Math.ceil(hotelTotal / PAGE_SIZE),
      params = {
        hotelId: hotelId
      };

    // 获取房态页房型房号列表
    axios.get(`${URL_PREFIX}${URL_NAME_GROUP['group_hotel_unbinding']}`, { params: params }).then((result) => {
      if (result.data.success) {
        message.success(intl.get('lv.common.operate.remove.relation.confirm.success'));
        dispatchGroupList(dispatch, {
          pn: totalPage > 0 && totalPage < currentPage ? totalPage : currentPage,
        });
      }
      callback && callback();
    });
  }
}

function modifyCommit(params, modalCancel, callback) {
  return (dispatch, getState) => {
    let state = getState(),
    hotelList = state.hotelList,
    currentPage = hotelList.currentPage,
    hotelTotal = hotelList.hotelTotal - 1,
    totalPage = hotelTotal % PAGE_SIZE === 0 ? hotelTotal / PAGE_SIZE : Math.ceil(hotelTotal / PAGE_SIZE);

    // 获取房态页房型房号列表
    axios.get(`${URL_PREFIX}${URL_NAME_GROUP['group_update_management']}`, { params: params }).then((result) => {
      callback && callback();
      if (result.data.success) {
        message.success(intl.get('lv.settings.group.hotelList.modify.hotel.success'));
        dispatchGroupList(dispatch, {
          pn: totalPage > 0 && totalPage < currentPage ? totalPage : currentPage,
        });
        modalCancel && modalCancel();
      }else{
        if(result.data.code == 300139){
          message.error(intl.get('lv.common.affiliation.managemenHoteNumError'))
        }
      }
    });
  }
}

/**
 * export函数
 */
export {
  getGroupList,
  removeRalation,
  modifyCommit
}