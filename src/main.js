import React from 'react';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import moment from 'moment';
import { LocaleProvider } from 'antd';
import { getCurrentLocale } from './utils/tools';
import cookie from 'utils/cookie.js';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import jaJP from 'antd/lib/locale-provider/ja_JP';
import koKR from 'antd/lib/locale-provider/ko_KR';

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';

import './stylesheet/index.scss';
// 路由
import Routers from './router.js';

// store设置
import configure from './store';
//公共样式
import './stylesheet/common.scss'
moment.locale('zh-cn');
const store = configure();
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState (state) {
      return state.get('routing').toJS();
  }
});

history.listen((location) => { return location; });

let locale = zhCN,
  currentLocale = getCurrentLocale();
if (currentLocale == 'en-US') {
  // moment.locale('en-US');
  locale = enUS;
} else if (currentLocale == 'ja-JP') {
  // moment.locale('ja-JP');
  locale = jaJP;
} else if (currentLocale == 'ko') {
  // moment.locale('ko');
  locale = koKR;
} else {
  // moment.locale('zh-cn');
  locale = zhCN;
}

ReactDOM.render(
  <LocaleProvider locale={locale}>
    <Provider store={store}>
        <Routers dispatch={store.dispatch} history={history}></Routers>
    </Provider>
  </LocaleProvider>
  ,
  document.getElementById('app'),
);
