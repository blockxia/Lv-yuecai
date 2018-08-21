/**
 * @authors wangqinqin
 * @date    2017-08-11
 * @module  登出action
 */

import { push } from 'react-router-redux';
import axios from 'api/axios';
import Config from 'config';
import message from 'components/Common/message';
import { USER } from '../constants/actionApi.js';

const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;
const url_open = Config.env[Config.scheme].openUrl;

// 退出
export function Logout(params) {
  return dispatch =>
    axios.get(`${admin_prefix}${USER['logout']}`, { data: params })
      .then((data) => {
        if (data.data.success) {
          // 退出需要清除导航的选中设置
          sessionStorage.removeItem('currentMenu');
          sessionStorage.removeItem('currentSubMenu');
          sessionStorage.removeItem('currentSecondMenu');
          sessionStorage.removeItem('attachments');
          sessionStorage.removeItem('currentMenuCode');
          sessionStorage.removeItem('pageUrl');
          window.location.href = url_open;
        } else {
        	message.error('退出失败');
        }
      });
}
