/**
 * @authors wangchen
 * @date    2018-08-13
 * @module 结算页面
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../../constants/actionTypes.js';
import {SETTLEMENT} from '../../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;  
  
  
  
  
  //结算页详情信息
  export function fetchList(params) {
    return dispatch => {
      axios.post(url_prefix + SETTLEMENT.FETCH_ALL_SETTLEMENT, params).then(res => {
        if (res.data.success) {
          dispatch({
            type: actionTypes.FETCH_SETTLEMENT_LIST,
            details: res.data.data || {}
          });
        }
        else {
          dispatch({
            type: actionTypes.FETCH_SETTLEMENT_LIST,
            details: {}
          });
        }
      }).catch(err => {
        dispatch({
          type: actionTypes.FETCH_SETTLEMENT_LIST,
          details: {}
        });
      });
    }
  }