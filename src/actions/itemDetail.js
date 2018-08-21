/**
 * @authors sunlei
 * @date    2018-08-16
 * @module  商品详情
 */
import axios from 'api/axios';
import * as actionTypes from '../constants/actionTypes.js';
import {COMMODITY} from '../constants/actionApi.js';
import Config from 'config';
import message from 'components/Common/message';

const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

// 查询商品
export function fetchItemDetail(params = {}) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ITEM_DETAIL,
      state: {
        loading: true
      }
    });
    return axios.post(url_prefix + COMMODITY.FETCH_ITEM_DETAIL, params).then(res => {
      if (res.data.success) {
        let data = res.data.data || {};
        if (data.spuInfoAttributeResults instanceof Array && data.spuInfoAttributeResults.length) {
          data.spuInfoAttributeResults.forEach(it => {
            if (data.skuResultList instanceof Array && data.skuResultList.length) {
              data.skuResultList.map(i => {
                it.attributeValueResult = (it.attributeValueResult || []).concat((i.skuAttributes || []).filter(l => l.attributeId === it.id))
              })
            }
          })
        }
        dispatch({
          type: actionTypes.FETCH_ITEM_DETAIL,
          state: {
            loading: false,
            detail: res.data.data || {}
          }
        });
      }
      else {
        dispatch({
          type: actionTypes.FETCH_ITEM_DETAIL,
          state: {
            loading: false,
            detail: {}
          }
        });
      }
    });
  }
}

// 添加购物车
export function addCart(params, success) {
  return async dispatch => {
    try {
      let res = await axios.post(url_prefix + COMMODITY.ADD_CART, {...params});
      if (res.data.success) {
        message.success('添加成功');
        success();
      }
      else {
        message.fail('添加失败');
      }
    }
    catch (err) {

    }
  }
}

export function setCatalogList(list) {
  return {
    type: actionTypes.FETCH_ITEM_DETAIL,
    state: {
      catalogList: list
    }
  };
}
