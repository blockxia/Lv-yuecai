/**
 * @author litengfei
 * @date 2017-08-15
 * @module 工具方法
 */
import cookie from './cookie.js';

const defaultLang = { "lang": "zh-CN", "langName": "中文(简体)", "icon": "" };

/**
 * 获取当前的语言设置，如未取到值则默认为中文（简体）
 */
function getCurrentLocale() {
  return defaultLang.lang || cookie.get('locale') || defaultLang.lang;
}

/**
 * 设置当前的语言
 * @param {语言类型} lang
 */
function setCurrentLocale(lang) {
  cookie.set('locale', lang, {
    domain: '.lvyuetravel.com',
    path: '/',
  });

  // cookie.set('locale', lang, {
  //   domain: '.fangapo.cn',
  // });
}

/**
 * 使用lang获取当前的langName
 * @param {全部语言} locales
 * @param {当前lang} lang
 */
function findCurrentLocaleNameByLang(locales, lang) {
  let length = locales.length,
    i = 0,
    rsLocale = defaultLang;
  for (; i < length; i++) {
    let locale = locales[i];
    if (locale.lang === lang) {
      rsLocale = locale;
      break;
    }
  }
  return rsLocale.langName;
}

/**
 * 数字格式化
 * @param {数字} num
 * @param {小数位数} precision
 * @param {分隔符} separator
 */
function formatNumber(num, precision, separator) {
  let parts;
  /* 判断是否为数字*/
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    num = Number(num);
    /* 处理小数点位数*/
    num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
    /* 分离数字的小数部分和整数部分*/
    parts = num.split('.');
    /* 整数部分加[separator]分隔, 借用一个著名的正则表达式*/
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));
    let n = parts.join('.');
    if (n.indexOf('.') == -1) {
      n += '.00';
    } else if (n.indexOf('.') == n.length - 1) {
      n += '00';
    } else if (n.indexOf('.') == n.length - 2) {
      n += '0';
    }
    return n;
  }
  return NaN;
}

/**
 * 使用自千分位格式化money，保留两位小数
 * 系统中的金钱读取时都需要除以100，保存时需要乘以100
 * @param {*} num
 */
function formatMoney(num, precisionParam) {
  num = num / 10000;
  if (precisionParam === undefined || precisionParam === null) {
    // 默认保留两位小数
    return formatNumber(num, 2, ',');
  } else {
    return formatNumberNormal(num, 0);
  }
}

// 渠道金钱分割特殊处理
function formatMoneyChannel(num, precisionParam) {
  if (precisionParam === undefined || precisionParam === null) {
    // 默认保留两位小数
    return formatNumber(num, 2, ',');
  } else {
    return formatNumberNormal(num, 0);
  }
}

/**
 * 数字格式化，非金融
 * @param {数字} num
 * @param {小数位数} precision
 * @param {分隔符} separator
 */
function formatNumberNormal(num, precision) {
  let parts;
  /* 判断是否为数字*/
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    num = Number(num);
    /* 处理小数点位数*/
    num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
    return num;
  }
  return NaN;
}

/**
 * 格式化为一位小数的数字
 */
function formatNumber1Precision(num) {
  return formatNumberNormal(num, 1);
}

/**
 * 格式化为两位小数的数字
 */
function formatNumber2Precision(num) {
  return formatNumber(num, 2);
}

/**
 * 格式化为两位小数的数字
 */
function formatNumberNormal2(num) {
  return formatNumberNormal(num, 2);
}


function isLogin() {
  return cookie.get('ly_admin_token') ? true : false;
}
/**
 * 时间戳转换成YYYY-MM-DD
 */
function formartDate(dateString) {
  if (!dateString || dateString == '-') {
    return '-';
  }
  var d = new Date(dateString);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  if (d.getMonth() + 1 < 10) {
    month = '0' + (d.getMonth() + 1);
  }
  if (day < 10) {
    day = '0' + day;
  }
  return `${d.getFullYear()}-${month}-${day}`;
}
/**
 * 获取当前时间并转换成YYYY-MM-DD
 */
function getCurrentDate() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  if (d.getMonth() + 1 < 10) {
    month = '0' + (d.getMonth() + 1);
  }
  if (day < 10) {
    day = '0' + day;
  }
  return `${d.getFullYear()}-${month}-${day}`;
}
/**
 * 时间戳转换成YYYY-MM-DD H:M:S
 */
function formartDateTime(dateString) {
  if (!dateString || dateString == '-') {
    return '-';
  }
  var d = new Date(dateString);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var hour = d.getHours();
  var minute = d.getMinutes();
  var secont = d.getSeconds();
  if (d.getMonth() + 1 < 10) {
    month = '0' + (d.getMonth() + 1);
  }
  if (day < 10) {
    day = '0' + day;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (secont < 10) {
    secont = '0' + secont;
  }

  return `${d.getFullYear()}-${month}-${day} ${hour}:${minute}:${secont}`;
}
/**
 * 获取多少天以后的日期
 */
function addDate(date, days) {
  var d = new Date(date);
  d.setDate(d.getDate() + days);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var val = d.getFullYear() + "-" + month + "-" + day;
  return val;
}
/**
 * 获取多少天以前的日期
 */
function subtractDate(date, days) {
  var d = new Date(date);
  d.setDate(d.getDate() - days);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var val = d.getFullYear() + "-" + month + "-" + day;
  return val;
}
/**
 * 获取日期相差天数
 */
function getDifferDays(date1, date2) {
  date1 = new Date(date1.replace(/-/g, "/"));
  date2 = new Date(date2.replace(/-/g, "/"));
  var time = date2.getTime() - date1.getTime();
  var days = parseInt(time / (1000 * 60 * 60 * 24));
  return days;
}
/**
 * 比较日期大小
 */
function CompareDate(d1, d2) {
  return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}

function getParamString(url, name) {
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&#]*)(\\s|&|#|$)', 'i');
  if (reg.test(url)) {
    return RegExp.$2.replace(/\+/g, ' ');
  }
}
export {
  getCurrentLocale,
  setCurrentLocale,
  findCurrentLocaleNameByLang,
  isLogin,
  formartDate,
  formartDateTime,
  formatMoney,
  addDate,
  subtractDate,
  getCurrentDate,
  getDifferDays,
  CompareDate,
  formatNumber,
  getParamString,
  formatNumberNormal2,
}
