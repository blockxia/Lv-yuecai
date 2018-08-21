import axios from 'axios';
import { browserHistory } from 'react-router';
import message from 'components/Common/message';


export function axiosGet(url, params, options) {

  return axios.get(url, {
    params: params,
  })
    .then((response) => {
      const data = response.data;
      let _data;
      if (typeof data === 'string') {
        _data = JSON.parse(data);
      } else {
        _data = data;
      }

      if (!_data.success) {
        // 206 针对cookie不存在的情况，直接到达登录页面
        if (_data.code === 206 && browserHistory.getCurrentLocation().pathname.includes('page')) {
          browserHistory.push('/signin');
          return;
        }
        if (_data.msg) {
          message.error(`错误信息:${_data.msg}`);
        }
      }
      return _data;
    });
}

export function axiosPost(url, params, options) {

  return axios.post(url, {
    params: params,
  })
    .then((response) => {
      const data = response.data;
      let _data;
      if (typeof data === 'string') {
        _data = JSON.parse(data);
      } else {
        _data = data;
      }

      if (_data.code) {
        // 206 针对cookie不存在的情况，直接到达登录页面
        if (_data.code === 206 && browserHistory.getCurrentLocation().pathname.includes('page')) {
          browserHistory.push('/signin');
          return;
        }
        if (_data.msg) {
          message.error(_data.msg);
        }
      }
      return _data;
    });
}
