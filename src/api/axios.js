import axios from 'axios';
require('es6-promise').polyfill();
import {browserHistory, hashHistory} from 'react-router';
//import {message} from 'antd';
import message from 'components/Common/message';
import msgGlobal from '../utils/msgGlobal.js';
import {getCurrentLocale} from '../utils/tools.js';
import {EMPLOYEES, ROLES} from '../constants/actionApi';
import Config from 'config';
const url_open = Config.env[Config.scheme].openUrl;
import qs from 'qs';
import storage from '../utils/storage';

//获取当前语言设置
const currentLocale = getCurrentLocale();
//读取当前语言配置
const currentLocaleOpt = require(`../locales/${currentLocale}.json`);

//设置antd的message位置及自动关闭时间
const windowHeight = $(window).height(),
  messageHeight = 110;
message.config({
  top: (windowHeight - messageHeight) / 2 - 50,
  duration: 2,
  maxCount: 1,
});

// axios 配置
axios.defaults.timeout = 20000;
// axios.defaults.withCredentials = true
// 配置基本的url
// axios.defaults.baseURL = 'https://api.github.com';
let timer;

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  //自定义header，标志当前是PC版的pimp
  config.headers['fromAgent'] = 'LVPIMP PC';
  let userInfo = {};
  // storage.get('groupId') && (userInfo.groupId = storage.get('groupId'));
  // storage.get('groupName') && (userInfo.groupName = storage.get('groupName'));
  // storage.get('userId') && (userInfo.userId = storage.get('userId'));
  // storage.get('userName') && (userInfo.userName = storage.get('userName'));
  // userInfo.userType = 'PURCHASER';
  if (config.method === 'post') {  
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    config.data = config.data ? config.data : {}
    config.data = qs.stringify(Object.assign(config.data, { busiSystem: 'pimp_pu', ...userInfo}))
  } else {
    config.params = config.params ? config.params : {}
    Object.assign(config.params, { busiSystem: 'pimp_pu'});
    if (!Object.values(EMPLOYEES).some(it => config.url.includes(it)) && !Object.values(ROLES).some(it => config.url.includes(it))) {
      Object.assign(config.params, { ...userInfo});
    }
  }
  
  return config;
}, function(error) {
  // 对请求错误做些什么
  if (error.response) {
    let msg = msgGlobal(error.response.status);
    message.warn(msg);
  }
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
  //clearTimeout(timer);
  // 封装全局提示信息
  var msg = msgGlobal(response.data.code);
  response.data.message = msg;

  var needMessageCode = [-9999, -9998, -9997, -9996];
  if (needMessageCode.indexOf(response.data.code) !== -1) {
    message.warning(msg);
  }

  // 判断登录
  if (response.data.code === -9997) {
    setTimeout(function () {
      window.location.href = url_open;
    }, 1000)
  }
  // 对响应数据做点什么
  return response;
}, function(error) {
  // 例如可以输入一些错误信息
  if (error.response) {
    let msg = msgGlobal(error.response.status);
    message.warn(msg);
  }
  return Promise.reject(error);
});

export default axios;
