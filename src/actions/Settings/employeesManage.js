/**
 * @authors wangqinqin
 * @date    2017-12-12
 * @module  员工设置
 */

import axios from 'api/axios';
import Config from 'config';

import { message } from 'components/Common/message';

import * as actionTypes from '../../constants/actionTypes.js';
import intl from 'react-intl-universal';
import * as Tools from '../../utils/tools.js';

const URL_PREFIX = Config.env[Config.scheme].prefix;

// 接口功能枚举
const URL_NAME = {
  ar_staff_list: '/crs/setting/salesPerson/list.json', // 分页查询
  ar_staff_add: '/crs/setting/salesPerson/create.json', // 员工添加
  ar_staff_update: '/crs/setting/salesPerson/update.json', // 员工更新
  ar_staff_getby_name: '/crs/setting/salesPerson/get_by_name.json', // 根据员工姓名查询员工接口
};

// 查询列表
export const StaffListPage = (params) => {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.LOADDING_STAFFLIST_STATE,
      payload: true,
    });
    let state = getState(),
      employeesManage = state.employeesManage;
    params.pn = params.pn ? params.pn : employeesManage.currentPage;
    return axios.get(`${URL_PREFIX}${URL_NAME['ar_staff_list']}`, { params: params }).then((result) => {
      if (result.data.success) {
        const list = result.data.data;
        dispatch({
          type: actionTypes.FETCH_STAFF_LIST,
          payload: list,
          total: result.data.total,
        });
        dispatch({
          type: actionTypes.UPDATE_EMPLOYEESMANAGE_CURRENT_PAGE,
          payload: params.pn,
        });
      }
      dispatch({
        type: actionTypes.LOADDING_STAFFLIST_STATE,
        payload: false,
      });
    }).catch((error) => {
      message.error(`${intl.get('lv.common.queryResult.error')}`)
      dispatch({
        type: actionTypes.LOADDING_STAFFLIST_STATE,
        payload: false,
      });
    });
  };
};

// 新增员工接口
export const StaffAdd = (addParams) => {
  return (dispatch, getState) => {
    return axios.post(`${URL_PREFIX}${URL_NAME['ar_staff_add']}`, addParams);
  };
};
// 更新员工接口
export const StaffUpdate = (updateParams) => {
  return (dispatch, getState) => {
    return axios.post(`${URL_PREFIX}${URL_NAME['ar_staff_update']}`, updateParams);
  };
};

// 根据员工姓名查询员工接口
export const StaffGetByName = (updateParams) => {
  return (dispatch, getState) => {
    return axios.get(`${URL_PREFIX}${URL_NAME['ar_staff_getby_name']}`, { params: updateParams });
  };
};
// 更新当前是第几页
export const upDateCurrentPage = (params) => {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.UPDATE_EMPLOYEESMANAGE_CURRENT_PAGE,
      payload: params.pn
    })
  }
}

// 清除所有的数据
export const cleanAllData = (params) => {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.CLEAN_EMPLOYEESMANAGE_DATE,
      payload: {
        employeesList: null, // 列表数据
        loadingState: true,
        pageSize: 20,
        currentPage: 1,
        total: 0,
      }
    })
  }
}
