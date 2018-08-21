/**
 * @authors sunlei
 * @date    2018-08-14
 * @module  搜索页面
 */
import axios from 'api/axios';
import * as actionTypes from '../constants/actionTypes.js';
import {COMMODITY} from '../constants/actionApi.js';
import Config from 'config';

const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

// 查询商品
export function fetchItems(params = {}) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ITEM_LIST,
      state: {
        loading: true
      }
    });
    return axios.post(url_prefix + COMMODITY.FETCH_ITEM_LIST, params).then(res => {
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_ITEM_LIST,
          state: {
            loading: false,
            list: res.data.data || [],
            params,
            total: res.data.total || 0
          }
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_ITEM_LIST,
          state: {
            loading: false,
            list: [],
            params,
            total: 0
          }
        });
      }
    });
  }
}

// 查询商品所属类目
export function fetchCatalogList(params = {}) {
  return dispatch => {
    // dispatch({
    //   type: actionTypes.FETCH_ITEM_LIST,
    //   state: {
    //     loading: true
    //   }
    // });
    return axios.post(url_prefix + COMMODITY.FETCH_SEARCH_CATALOG, params).then(res => {
      if (res.data.success) {
        dispatch({
          type: actionTypes.FETCH_ITEM_LIST,
          state: {
            catalogList: (res.data.data || []).map(it => {
              let nameArr = (it.catalogNamePath || '').split('/').filter(it => !!it);
              let name = '';
              if (nameArr.length) {
                name = nameArr[nameArr.length - 1];
              }
              return {
                id: it.catalogId,
                path: it.catalogPath,
                name: name
              };
            })
          }
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_ITEM_LIST,
          state: {
            catalogList: []
          }
        });
      }
    });
  }
}

export function setCatalogList(list) {
  return {
    type: actionTypes.FETCH_ITEM_LIST,
    state: {
      catalogList: list
    }
  };
}
