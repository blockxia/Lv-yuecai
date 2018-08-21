/**
 * @author litengfei
 * @date 2017-08-15
 * @module 国际化
 */
import * as actionTypes from '../constants/actionTypes.js';
import {BASIC} from '../constants/actionApi.js';

import axios from '../api/axios.js';
import {push} from 'react-router-redux'
import cookie from '../utils/cookie.js';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;

// 获取国际化配置
export const getLocales = () => {
  return dispatch => {
    return;
    axios.get(`${url_prefix}${BASIC['get_lang']}`).then(function(res) {
      dispatch({
        type: actionTypes.GETLOCALES,
        data: {
          locales: res.data.data
        } || {}
      })
    });
  }
}
