/**
 * @author litengfei
 * @date 2017-09-13
 * @module 工具方法
 */

 // 日期月份/天的显示，如果是1位数，则在前面加上'0'
function getFormatDate(arg) {
  if (arg == undefined || arg == '') {
    return '';
  }

  var re = arg + '';
  if (re.length < 2) {
    re = '0' + re;
  }

  return re;
}

// 时分秒的显示，如果是1位数，则在前面加上'0'
function getFormatTime(arg) {
  if (arg === undefined || arg === 0 || arg === '') {
    return '00';
  }

  var re = arg + '';
  if (re.length < 2) {
    re = '0' + re;
  }

  return re;
}

function operateDate(date, days, format, operate){
  if (days === undefined || days === '') {
    days = 1;
  }

  if(typeof date === 'string'){
    date = getDateUtil(date);
  }else if(date !== undefined && date !== null && date.constructor === Date){
    //
  }else{
    //date === undefined || date === '' || date === null
    date = new Date();
  }
  if(operate === 'add'){
    date.setDate(date.getDate() + days);
  }else if(operate === 'minus'){
    date.setDate(date.getDate() - days);
  }
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if(format === 'MM-dd'){
    return getFormatDate(month) + '-' + getFormatDate(day);
  } else if (format === 'yyyy-MM-dd HH:mm:ss') {
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day) + ' ' + getFormatTime(date.getHours()) + ':' + getFormatTime(date.getMinutes()) + ':' + getFormatTime(date.getSeconds());
  } else {
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
  }
}

/**
 * 日期，在原有日期基础上，减少days天数，默认减少1天
 * @param {*日期} date
 * @param {*天数} days
 * @param {*格式} format
 */
function minusDate(date, days, format) {
  return operateDate(date, days, format, 'minus');
}

/**
 * 日期，在原有日期基础上，增加days天数，默认增加1天
 * @param {*日期} date
 * @param {*天数} days
 * @param {*格式} format
 */
function addDate(date, days, format) {
  return operateDate(date, days, format, 'add')
}

/**
 * 获取日期
 * @param {*} date
 * @param {*} format yyyy-MM-dd HH:mm:ss
 */
function getDate(date, format){
  if(typeof date === 'string'){
    date = getDateUtil(date);
  }else if(typeof date === 'number'){
    date = new Date(date);
  }else if(date !== undefined && date !== null && date.constructor === Date){
    //
  }else{
    //date === undefined || date === '' || date === null
    var serverTime = sessionStorage.getItem('serverTime');
    if(serverTime) {
      date = new Date(parseInt(serverTime));
    }else{
      date = new Date();
    }
  }

  var month = date.getMonth() + 1;
  var day = date.getDate();
  if(format === 'dd'){
    return getFormatDate(day);
  }else if(format === 'MM-dd'){
    return getFormatDate(month) + '-' + getFormatDate(day);
  }else if(format === 'MM-dd HH:mm'){
    return getFormatDate(month) + '-' + getFormatDate(day) + ' ' + getFormatTime(date.getHours()) + ':' + getFormatTime(date.getMinutes());
  }else if(format === 'yyyy-MM-dd HH:mm'){
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day) + ' ' + getFormatTime(date.getHours()) + ':' + getFormatTime(date.getMinutes());
  }else if(format==='yyyy-MM-dd HH:mm:ss'){
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day) + ' ' + getFormatTime(date.getHours()) + ':' + getFormatTime(date.getMinutes()) + ':' + getFormatTime(date.getSeconds());
  }else{
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
  }
}

/**
 * 获取星期几
 * @param {*} date
 * @param {*} format yyyy-MM-dd HH:mm:ss
 */
function getDay(date){
  let my_date = Date.parse(new Date(date));
  my_date = new Date(my_date);
  return my_date.getDay();
}

// 天数向上取整
function getDays(start, end){
  let timestampStart = (new Date(start)).getTime(),
    timestampEnd = (new Date(end)).getTime(),
    times = timestampEnd - timestampStart,
    days = Math.ceil(Math.abs(times) / (1000 * 60 * 60 * 24));
  if(times < 0) {
    return 0;
  }else{
    return days === 0 ? 1 : days;
  }
}

/**
 * 获取时间间隔
 * @param {*} start
 * @param {*} end
 */
function rangeDays(start, end){
  return daysDiff(start, end);
}

function getDateTimeStamp(date){
  if(typeof date === 'string'){
    date = new Date(date);
  }else if(date !== undefined && date !== null && date.constructor === Date){
    //
  }else{
    //date === undefined || date === '' || date === null
    date = new Date();
  }
  return date.getTime();
}

// 对比是不是同一天
function daysDiff(start, end){
  let startDate = (new Date(start)).setHours(12, 0, 0, 0),
    timestampStart = (new Date(startDate)).getTime(),
    endDate = (new Date(end)).setHours(12, 0, 0, 0),
    timestampEnd = (new Date(endDate)).getTime(),
    days = timestampEnd - timestampStart;
  return parseInt(Math.abs(days) / (1000 * 60 * 60 * 24));
}

function compareDay(start, end) {
  let startDate = (new Date(start)).setHours(12, 0, 0, 0),
    timestampStart = (new Date(startDate)).getTime(),
    endDate = (new Date(end)).setHours(12, 0, 0, 0),
    timestampEnd = (new Date(endDate)).getTime(),
    days = timestampStart - timestampEnd;
    return parseInt(days / (1000 * 60 * 60 * 24));
}

function compare(one, two) {
  let timeOne = (new Date(one)).setHours(12, 0, 0, 0),
    time1 = (new Date(timeOne)).getTime(),
    timeTwo = (new Date(two)).setHours(12, 0, 0, 0),
    time2 = (new Date(timeTwo)).getTime();
  if (time1 > time2) {
      return '1'
  } else if (time1 < time2) {
      return '-1'
  } else {
      return '0'
  }
}

function getDisDate(date, count, formatExp) {
  let dateTime = (new Date(date)).setHours(12, 0, 0, 0),
    time = (new Date(dateTime)).getTime(),
    newTime = time + count * 24 * 60 * 60 * 1e3;
  return formatExp ? format(new Date(newTime), formatExp) : format(new Date(newTime), "yyyy-MM-dd");
}

function getDateUtil (e) {
  let t, n, r;
  t = $.trim(e).split(" ");
  n = t[0].split(/[\-\/]/);
  r = t[1] ? t[1].split(":") : [0, 0, 0];
  return new Date(n[0], n[1] - 1, n[2], r[0], r[1], r[2] ? r[2] : 0)
}
function format(t, n) {
  t = _getDateUtil(t);
  let r = {
      "M+": t.getMonth() + 1,
      "d+": t.getDate(),
      "h+": t.getHours(),
      "m+": t.getMinutes(),
      "s+": t.getSeconds(),
      "q+": Math.floor((t.getMonth() + 3) / 3),
      S: t.getMilliseconds()
  };
  if (/(y+)/.test(n)) {
      n = n.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (let i in r) if ((new RegExp("(" + i + ")")).test(n)) {
      n = n.replace(RegExp.$1, RegExp.$1.length == 1 ? r[i] : ("00" + r[i]).substr(("" + r[i]).length))
  }
  return n
}

function _getDateUtil(t){
  if ($.type(t) == "string") {
    return getDateUtil(t);
  }
  return t;
}

/**
* 获取一定时间后的几小时
* time  时间
* num 几小时
* return YYYY-MM-dd hh:mm
*/
function getAfterHours (time, num, dateType) {
  time = new Date(Date.parse(time.replace(/-/g, "/"))).getTime()
  const date = new Date(time);
  date.setHours(date.getHours() + (num ? num : 1));
  let  y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let mm = date.getMinutes();
  mm = mm < 10 ? "0" + mm : mm;
  let ss = date.getSeconds();
  ss = ss < 10 ? "0" + ss : ss;
  if (dateType === 'hh:mm:ss') { // 时分秒，接口需要
    return y + '-' + m + "-" + d + " " + h + ":" + mm + ":" + ss;
  } else if (dateType === 'hh:mm') { // 时分
    return y + '-' + m + "-" + d + " " + h + ":" + mm;
  }

}
/**
* 获取时间相差小时数
* s1 第一个时间点
* s2 第二个时间点
* return hour小时数
*/
function getDiffHours(s1, s2) {
  s1 = new Date(s1.replace(/-/g, '/'));
  s2 = new Date(s2.replace(/-/g, '/'));
  var ms = Math.abs(s1.getTime() - s2.getTime());
  return ms / 1000 / 60 / 60;
}

function nightsDiff(date1, date2) {
  var night = parseInt(Math.abs(date2 - date1) / 1e3 / 60 / 60 / 24);
  if (night === 0) {
    night = 1
  }
  return night;
}
// 获取一个月之前的时间
function get3MonthBefor(){
  var resultDate,year,month,date;
  var currDate = new Date();
  year = currDate.getFullYear();
  month = currDate.getMonth()+1;
  date = currDate.getDate();

  switch(month)
  {
    case 1:
      month += 11;
      year--;
      break;
    default:
      month -= 1;
      break;
  }
  month = (month < 10) ? ('0' + month) : month;
  resultDate = year + '-'+month+'-'+date;
  return resultDate;
}

// 获取当前月的第一天
function getCurrentMonthFirst(){
 var date=new Date();
 date.setDate(1);
 return date;
}

// 获取当前月的最后一天
function getCurrentMonthLast(){
 var date=new Date();
 var currentMonth=date.getMonth();
 var nextMonth=++currentMonth;
 var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
 var oneDay=1000*60*60*24;
 return new Date(nextMonthFirstDay-oneDay);
}

//指定几天后或几天前的日期
function GetDateStr(AddDayCount) {   
  var dd = new Date();  
  dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();   
  var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
  var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
  return y+"-"+m+"-"+d;   
} 

function getFirstDayOfYear(date) {
  if (typeof date === 'string') {
    date = getDateUtil(date);
  } else if (typeof date === 'number') {
    date = new Date(date);
  } else if (date !== undefined && date !== null && date.constructor === Date) {
    //
  } else {
    //date === undefined || date === '' || date === null
    var serverTime = sessionStorage.getItem('serverTime');
    if (serverTime) {
      date = new Date(parseInt(serverTime));
    } else {
      date = new Date();
    }
  }
  date.setDate(1);
  date.setMonth(0);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day)
}

/**
 * 截取日期的位数，返回的是字符串，比如 2018-03-18 11：23
 * @param {*} digits 结束位置
 * @param {*} digitsPrev 开始位置
 */
// 
function getInterceptionDate(date, digits, digitsPrev) {
  if (!digits || digits === null || digits === undefined) {
    digits = 10;
  }
  if (!digitsPrev || digitsPrev === null || digitsPrev === undefined) {
    digitsPrev = 0;
  }
  if (typeof date === 'string') {
    date = date.substr(digitsPrev, digits)
  }
  return date;
}
export {
  addDate,
  minusDate,
  getDate,
  getDateUtil,
  getDay,
  getDays,
  daysDiff,
  getDisDate,
  compare,
  rangeDays,
  getDateTimeStamp,
  getAfterHours,
  getDiffHours,
  format,
  nightsDiff,
  compareDay,
  get3MonthBefor,
  getCurrentMonthFirst,
  getCurrentMonthLast,
  GetDateStr,
  getFirstDayOfYear,
  getInterceptionDate,
}
