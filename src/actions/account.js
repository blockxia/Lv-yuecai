/**
 * @authors wangqinqin
 * @date    2017-08-14
 * @module  个人中心
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import * as actionTypes from '../constants/actionTypes.js';
import {ACCOUNT} from '../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';

const url_prefix = Config.env[Config.scheme].prefix;
const url_admin_prefix = Config.env[Config.scheme].adminPrefix;

// const updateAccountUrl = '/user/update.json';
// const updateAccountUrl = '/mock/596f24a4a1d30433d837c216/example/mock';

const currentLocale = Tools.getCurrentLocale();
intl.init({
  currentLocale,
  locales: {
    [currentLocale]: require(`../locales/${currentLocale}.json`),
  },
});

// 导航
export function updateAccount(params) {
  return (dispatch) => {
    axios.get(`${url_admin_prefix}${ACCOUNT['update_account']}`, { params: params }).then((data) => {
        dispatch({
          type: actionTypes.UPDATE_ACCOUNT,
          payload: {
            buttonLoading:false
          }
        });
        
        if (data.data.success) {
          /*
          dispatch({
            type: actionTypes.UPDATE_ACCOUNT,
            payload: data.data.data,
          });
          */
          message.success(`${intl.get('lv.common.modify.success')}`);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          dispatch({
            type: actionTypes.UPDATE_FAILURE,
            payload: data.data.data,
          });
          message.warn(`${intl.get('lv.common.modify.error')}`);
        }

        return data;
      }).catch((error) => {
        dispatch({
          type: actionTypes.UPDATE_FAILURE,
          payload: error,
        });
        message.warn(`${intl.get('lv.common.modify.error')}`);
      });
  };
}

export const checkInLoading = (params) => {
  return {
    type:actionTypes.LOADDING_USER_BUTTON_STATE,
    payload:{
      buttonLoading:params.buttonLoading
    }
  }
}   
