/**
 * @authors wangqinqin
 * @date    2017-09-08
 * @module  国家信息查询-区号
 */
import axios from 'api/axios';
import * as actionTypes from '../constants/actionTypes.js';
import {BASIC} from '../constants/actionApi.js';
import Config from 'config';

const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

export function fetchCountry(params) {
  return (dispatch) => {
  return axios.get(`${admin_prefix}${BASIC['get_country_code']}`, { params: params })
      .then((data) => {
        if (data.data.success) {
          dispatch({
            type: actionTypes.FECH_COUNTRY_LIST,
            payload: { country: data.data.data },
          });
        }
      });
  };
}
