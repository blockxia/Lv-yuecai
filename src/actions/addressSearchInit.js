/**
 * @authors sunlei
 * @date    2018-07-17
 * @module  地址搜索组件-pms数据
 */
import { ADDRESS_SEARCH_INIT } from '../constants/actionTypes';
import intl from 'react-intl-universal';
import { message } from 'components/Common/message';
import axios from 'api/axios';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;
const pms_prefix = Config.env[Config.scheme].pmsPrefix;

// 获取国家
function getCountry(params) {
  params = Object.assign({}, params, {
    type: 1,
  });
  return (dispatch) => {
    axios.get(`${pms_prefix}/sys/get_location.json?lang=zh-CN`, { params: params }).then((result) => {
      if (result.data.success) {
        dispatch({
          type: ADDRESS_SEARCH_INIT,
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
    axios.get(`${pms_prefix}/sys/get_location.json`, { params: params }).then((result) => {
      if (result.data.success) {
        dispatch({
          type: ADDRESS_SEARCH_INIT,
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
    axios.get(`${pms_prefix}/sys/get_location.json`, { params: params }).then((result) => {
      if (result.data.success) {
        dispatch({
          type: ADDRESS_SEARCH_INIT,
          state : {
            city: result.data.data,
          }
        });
      };
    });
  };
}


// 获取城市  包含城镇数据(选址助手页面专用)
function getSpecialCity(params) {
  return (dispatch) => {
    axios.get(`${pms_prefix}/sys/get_location.json`, { params: params }).then((result) => {
      if (result.data.success) {
        dispatch({
          type: ADDRESS_SEARCH_INIT,
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
    axios.get(`${pms_prefix}/sys/get_location.json`, { params: params }).then((result) => {
      if (result.data.success) {
        dispatch({
          type: ADDRESS_SEARCH_INIT,
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
      type: ADDRESS_SEARCH_INIT,
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
      type: ADDRESS_SEARCH_INIT,
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
      type: ADDRESS_SEARCH_INIT,
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
      type: ADDRESS_SEARCH_INIT,
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
      type: ADDRESS_SEARCH_INIT,
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
  getSpecialCity,
  getRegion,
  clearCountryData,
  clearProvinceData,
  clearCityData,
  clearRegionData,
  clearData
}