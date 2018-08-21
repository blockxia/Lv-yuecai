/*eslint-disable */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Router, Route, Redirect, IndexRoute, browserHistory, hashHistory, IndexRedirect } from 'react-router';
import { checkAuthWithoutNextFn } from './actions/userInfo.js';

import App from './containers/index.js';
//平台首页
import Welcome from './containers/Welcome/index.js';
// 网络错误页面
import NetworkError from './components/Common/NetworkError';
// import Search from 'antd/lib/transfer/search';

// 404页面
const NotFound = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/NotFound').default)
  }, 'notFound')
}

// 无权限
const PermissionsNo = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/PermissionsNo').default)
  }, 'permissionsNo')
}

// 账号管理
const AccountManager = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Settings/Account').default);
  }, 'account');
};



// 账号管理-员工
const Employees = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Settings/Account/Employees').default);
  }, 'employees');
};

// 账号管理-角色
const Role = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Settings/Account/Role').default);
  }, 'role');
};

// 设置
const platformSetting = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/PlatformSetting').default);
  }, 'platformSetting');
}


// 平台公告
const platformNotice = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/PlatformNotice').default);
  }, 'platformNotice');
}


// 订单
const order = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Order').default);
  }, 'order');
}
// 全部订单
const allOrder = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Order/AllOrders').default);
  }, 'allOrder');
}
// 待分配订单
// const waitAllocateOrder = (location, cb) => {
//   require.ensure([], require => {
//     cb(null, require('./containers/Order/PreAllot').default);
//   }, 'PreAllot');
// }


// 售后服务单
const afterSales = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Order/AfterSales').default);
  }, 'afterSales');
}
// 待分配订单
const unallot = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Order/Unallot').default);
  }, 'unallot');
}

// 待分配订单详情
const unallotDetails = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Order/Details/Unallot').default);
  }, 'unallotDetails');
}
// 已经分配订单详情
const allotedDetails = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Order/Details/Alloted').default);
  }, 'allotedDetails');
}

//首页
const homePage = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/HomePage').default);
  }, 'homePage');
}

//开票信息
const InvoiceMsg = (location,cb) => {
    require.ensure([],require=>{
        cb(null,require('./containers/PlatformSetting/InvoiceMsg').default)
    },'invoiceMsg');
}

//平台账户
const BankPlat = (location,cb) => {
    require.ensure([],require=>{
        cb(null,require('./containers/PlatformSetting/BankPlat').default)
    },'bankPlat');
}


//收获地址
const address=(location,cb) => {
    require.ensure([],require=>{
        cb(null,require('./containers/PlatformSetting/address').default)
    },'address');
}


//结算页面
const settlementPage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./containers/SettlementPage').default);
    }, 'settlementPage');
}

//购物车
const shoppingCart = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/ShoppingCart').default);
  }, 'shoppingCart');
}
//搜索页面
const Search = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Search').default);
  }, 'search');
}
//商品详情
const ItemDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/ItemDetail').default);
  }, 'itemDetail');
}

const OrdersDetail = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/AllOrders/OrdersDetail').default);
  }, 'ordersDetail');

}

//个人资料
const personalProfile = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/PlatformSetting/PersonalProfile').default);
  }, 'personalProfile');
}

//帮助中心
const help = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Help').default);
  }, 'help');
}

//平台介绍
const introduction = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Help/AboutUs/Introduction').default);
  }, 'introduction');
}

//联系我们
const contactUs = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Help/AboutUs/ContactUs').default);
  }, 'contactUs');
}

//配送方式
const method = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Help/Distribution/Method').default);
  }, 'method');
}

//配送范围
const scope = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Help/Distribution/Scope').default);
  }, 'scope');
}

//退款流程
const refund = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Help/Service/Refund').default);
  }, 'refund');
}

//退货流程
const returnGoods = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./containers/Help/Service/ReturnGoods').default);
  }, 'returnGoods');
}

// 路由设置
export default ({ dispatch, history }) => (
  <Router history={history}>
    <Route path="/" component={App} onEnter={bindActionCreators(checkAuthWithoutNextFn, dispatch)}>
      <Route path="welcome" component={Welcome}></Route>
      {/* 首页 */}
      <Route path="main" getComponent={homePage} />
      {/* 搜索 */}
      <Route path="search" getComponent={Search}></Route>
      {/* 详情 */}
      <Route path="itemDetail" getComponent={ItemDetail}></Route>
      {/* 购物车 */}
      <Route path="shoppingCart" getComponent={shoppingCart}></Route>
      {/* 帮助中心 */}
      <Route path="help" getComponent={help}>
          <Route path="aboutUs/introduction" getComponent={introduction}></Route>
          <Route path="aboutUs/contactUs" getComponent={contactUs}></Route>
          <Route path="distribution/method" getComponent={method}></Route>
          <Route path="distribution/scope" getComponent={scope}></Route>
          <Route path="service/refund" getComponent={refund}></Route>
          <Route path="service/returnGoods" getComponent={returnGoods}></Route>
      </Route>
      {/* 结算 */}
      <Route path="settlement/:skuIds" getComponent={settlementPage}></Route>
      {/* <Route path="settlement" getComponent={settlementPage}></Route> */}
      {/* 订单 */}
      <Route path="order" getComponent={order}>
        <Route path="allorder" getComponent={allOrder}></Route>
        <Route path="orderDetail" getComponent={OrdersDetail}></Route>
        {/* <Route path="waorder" getComponent={waitAllocateOrder}></Route> */}
        <Route path="aftersales" getComponent={afterSales}></Route>
        {/* <Route path="unallot" getComponent={unallot}></Route>
        <Route path="unallotd/:orderId" getComponent={unallotDetails}></Route>
        <Route path="alloted/:orderId" getComponent={allotedDetails}></Route> */}
      </Route>
      {/* 设置 */}
      <Route path="settings" getComponent={platformSetting}>
        <Route path="account" getComponent={personalProfile}></Route>
        <Route path="bankAccount" getComponent={BankPlat}></Route>
        <Route path="invoices" getComponent={InvoiceMsg}></Route>
        <Route path="receives" getComponent={address}></Route>
      </Route>
      {/* 信息通知 */}
      <Route path="platformNotice"  getComponent={platformNotice}></Route>

      <Route path="permissionsNo" getComponent={PermissionsNo} />
      <Route path="networkError" component={NetworkError} />
      <Route path="*" getComponent={NotFound} />
    </Route>
  </Router>
)
