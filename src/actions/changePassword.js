/**
 * @authors wangqinqin
 * @date    2017-08-14
 * @module  更改密码
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import { push } from 'react-router-redux';
import intl from 'react-intl-universal';
import * as actionTypes from '../constants/actionTypes.js';
import { ACCOUNT } from '../constants/actionApi.js';
import * as Tools from '../utils/tools.js';
import Config from 'config';

const url_open = Config.env[Config.scheme].openUrl;
const url_prefix = Config.env[Config.scheme].prefix;
const url_admin_prefix = Config.env[Config.scheme].adminPrefix;

// const changePasswordUrl = '/user/update_password.json';
// const updateAccountUrl = '/mock/596f24a4a1d30433d837c216/example/mock';
const currentLocale = Tools.getCurrentLocale();
intl.init({
  currentLocale,
  locales: {
    [currentLocale]: require(`../locales/${currentLocale}.json`),
  },
});


export function updatePassword(params) {
  //params = Object.assign(params, {busiSystem: 'ows'});
  return (dispatch) => {
    axios.get(`${url_admin_prefix}${ACCOUNT['update_password']}`, { params: params })
      .then((data) => {
        if (data.data.success) {
          dispatch({
            type: actionTypes.CHANGEPASSWORD_SUCCESS,
            payload: data.data.data,
          });
          // 修改成功
          message.success(`${intl.get('lv.common.modifySuccessLogoin')}`);
          sessionStorage.removeItem('currentMenu');
          sessionStorage.removeItem('currentSubMenu');
          setTimeout(() => {
            window.location.href = url_open;
          }, 500);
        } else {
          dispatch({
            type: actionTypes.CHANGEPASSWORD_FAILURE,
            payload: data.data.data,
          });
          if (data.data.code === 200003) {
            // 密码不正确
            message.warn(`${intl.get('msg.global.code.200003')}`);
          } else {
            message.warn(`${intl.get('lv.common.modify.error')}`);
          }
        }

        return data;
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.CHANGEPASSWORD_FAILURE,
          payload: error,
        });
        message.warn(`${intl.get('lv.common.modify.error')}`);
      });
  };
}
