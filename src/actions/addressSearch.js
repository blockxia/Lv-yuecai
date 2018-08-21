/**
 * @authors litengfei
 * @date    2017-11-28
 * @module  地址搜索组件
 */
import { ADDRESS_SEARCH } from '../constants/actionTypes';
import intl from 'react-intl-universal';
import message from 'components/Common/message';
import axios from 'api/axios';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

// 获取国家
function getCountry(params) {
  params = Object.assign({}, params, {
    type: 1,
  });
  return (dispatch) => {
    axios.get(`${admin_prefix}/mng/api/pcms/location/queryCountryByLang/queryCondition.json?lang=zh-CN`, { params: params }).then((result) => {
      if (result.data.success) {
        dispatch({
          type: ADDRESS_SEARCH,
          state : {
            country: result.data.data,
          }
        });
      };
    });
  };
}

// 获取省份
function getProvince(params) {
  return (dispatch) => {
    axios.get(`${admin_prefix}/mng/api/pcms/location/queryProvinceByCountryId/queryCondition.json`, { params: params }).then((result) => {
      if (result.data.success) {
        dispatch({
          type: ADDRESS_SEARCH,
          state : {
            province: result.data.data,
          }
        });
      };
    });
  };
}

// 获取城市
function getCity(params) {
  return (dispatch) => {
    axios.get(`${admin_prefix}/mng/api/pcms/location/queryCityByProvinceId/queryCondition.json`, { params: params }).then((result) => {
      if (result.data.success) {
        dispatch({
          type: ADDRESS_SEARCH,
          state : {
            city: result.data.data,
          }
        });
      };
    });
  };
}

// 获取行政区
function getRegion(params) {
 return (dispatch) => {
    axios.get(`${admin_prefix}/mng/api/pcms/location/queryRegionByCityId/queryCondition.json`, { params: params }).then((result) => {
      if (result.data.success) {
        dispatch({
          type: ADDRESS_SEARCH,
          state : {
            region: result.data.data,
          }
        });
      };
    });
  };
}

// 清空选中的国家数据
function clearCountryData() {
  return (dispatch) => {
    dispatch({
      type: ADDRESS_SEARCH,
      state : {
        country: [],
      }
    });
  };
}

// 清空选中的省份数据
function clearProvinceData() {
  return (dispatch) => {
    dispatch({
      type: ADDRESS_SEARCH,
      state : {
        province: [],
      }
    });
  };
}

// 清空选中的城市数据
function clearCityData() {
  return (dispatch) => {
    dispatch({
      type: ADDRESS_SEARCH,
      state : {
        city: [],
      }
    });
  };
}

// 清空选中的区域数据
function clearRegionData() {
  return (dispatch) => {
    dispatch({
      type: ADDRESS_SEARCH,
      state : {
        region: [],
      }
    });
  };
}

// 清空选中的数据
function clearData() {
  return (dispatch) => {
    dispatch({
      type: ADDRESS_SEARCH,
      state: { 
        //country: [],
        province: [],
        city: [],
        region: [],
      },
    });
  };
}

/**
 * export函数
 */
export {
  getCountry,
  getProvince,
  getCity,
  getRegion,
  clearCountryData,
  clearProvinceData,
  clearCityData,
  clearRegionData,
  clearData
}