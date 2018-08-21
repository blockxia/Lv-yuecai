import {browserHistory, hashHistory} from 'react-router';
import {getCurrentLocale} from '../utils/tools.js';

//获取当前语言设置
const currentLocale = getCurrentLocale();
//读取当前语言配置
const currentLocaleOpt = require(`../locales/${currentLocale}.json`);

export default function msgInfo(code) {
  switch (code) {
    case - 9999:
      return currentLocaleOpt['msg.global.code.minus9999']
      break;
    case - 9998:
      return currentLocaleOpt['msg.global.code.minus9998']
      break;
    case - 9997:
      return currentLocaleOpt['msg.global.code.minus9997']
      break;
    case - 9996:
      return currentLocaleOpt['msg.global.code.minus9996']
      break;
    case - 9995:
      return currentLocaleOpt['msg.global.code.minus9995']
      break;
    case - 9994:
      return currentLocaleOpt['msg.global.code.minus9994']
      break;
    case - 9993:
      return currentLocaleOpt['msg.global.code.minus9993']
      break;
    case - 9992:
      return currentLocaleOpt['msg.global.code.minus9992']
      break;
    case - 9991:
      return currentLocaleOpt['msg.global.code.minus9991']
      break;
    case - 9990:
      return currentLocaleOpt['msg.global.code.minus9990']
      break;
    case 200010:
      return currentLocaleOpt['msg.global.code.200010']
      break;
    case 200009:
      return currentLocaleOpt['msg.global.code.200009']
      break;
    case 200008:
      return currentLocaleOpt['msg.global.code.200008']
      break;
    case 200007:
      return currentLocaleOpt['msg.global.code.200007']
      break;
    case 200006:
      return currentLocaleOpt['msg.global.code.200006']
      break;
    case 200005:
      return currentLocaleOpt['msg.global.code.200005']
      break;
    case 200004:
      return currentLocaleOpt['msg.global.code.200004']
      break;
    case 200003:
      return currentLocaleOpt['msg.global.code.200003']
      break;
    case 200002:
      return currentLocaleOpt['msg.global.code.200002']
      break;
    case 200001:
      return currentLocaleOpt['msg.global.code.200001']
      break;
    case 1:
      return currentLocaleOpt['msg.global.code.1']
      break;
    case 0:
      return currentLocaleOpt['msg.global.code.0']
      break;
    case 400:
      return currentLocaleOpt['msg.global.status.400']
      break;
    case 401:
      return currentLocaleOpt['msg.global.status.401']
      break;
    case 403:
      return currentLocaleOpt['msg.global.status.403']
      break;
    case 404:
      return currentLocaleOpt['msg.global.status.404']
      break;
    case 405:
      return currentLocaleOpt['msg.global.status.405']
      break;
    case 406:
      return currentLocaleOpt['msg.global.status.406']
      break;
    case 407:
      return currentLocaleOpt['msg.global.status.407']
      break;
    case 408:
      return currentLocaleOpt['msg.global.status.408']
      break;
    case 409:
      return currentLocaleOpt['msg.global.status.409']
      break;
    case 410:
      return currentLocaleOpt['msg.global.status.410']
      break;
      break;
    case 411:
      return currentLocaleOpt['msg.global.status.411']
      break;
    case 412:
      return currentLocaleOpt['msg.global.status.412']
      break;
    case 413:
      return currentLocaleOpt['msg.global.status.413']
      break;
    case 414:
      return currentLocaleOpt['msg.global.status.414']
      break;
    case 415:
      return currentLocaleOpt['msg.global.status.415']
      break;
    case 416:
      return currentLocaleOpt['msg.global.status.416']
      break;
    case 417:
      return currentLocaleOpt['msg.global.status.417']
      break;
    case 500:
      return currentLocaleOpt['msg.global.status.500']
      break;
    case 501:
      return currentLocaleOpt['msg.global.status.501']
      break;
    case 502:
      return currentLocaleOpt['msg.global.status.502']
      break;
    case 503:
      return currentLocaleOpt['msg.global.status.503']
      break;
    case 504:
      return currentLocaleOpt['msg.global.status.504']
      break;
    case 505:
      return currentLocaleOpt['msg.global.status.505']
      break;
    default:
      return currentLocaleOpt['msg.global.default']
  }
}
