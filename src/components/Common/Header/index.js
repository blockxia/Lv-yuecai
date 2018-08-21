/**
 * @authors litengfei
 * @date    2017-11-21
 * @module  头部导航
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import intl from 'react-intl-universal';
import { bindActionCreators } from 'redux';
import { Row, Col, Menu, Dropdown, Icon, Layout, Button, Modal, Popover } from 'antd';
import { LayoutHeader } from '../../../actions/header';
import { browserHistory } from 'react-router';
import { GetSlide, setCurrentMenu, setCurrentMenuCode } from '../../../actions/sliderBar';
import { updateSlidePrivilege, getPrivilege } from '../../../actions/app';
import { Logout } from '../../../actions/logout';
import { NewPopClearData } from '../../../actions/newPopAddress';
import Avatar from '../../Avatar';
import MenuList from './menuList.js';
import * as Tools from '../../../utils/tools.js';
import { getDate } from 'utils/date';
import cookie from 'utils/cookie.js'; 

import { observer } from 'utils/observer.js';

import './style.scss';

import axios from 'api/axios';
import Config from 'config';
const URL_PREFIX = Config.env[Config.scheme].prefix;
const IMAGES_URL = Config.env[Config.scheme].imagesUrl;
const logoSuffix = Config.env[Config.scheme].logoSuffix;
const logoHeight = Config.env[Config.scheme].logoHeight;
// 提醒url
const URL_REMIND = {
  quantity_statistics: '/crs/remind/group/unread_count.json',
  order_local_search: '/order/local/list/search.json'
};

const { Header, Content, Sider } = Layout;
const MenuItem = Menu.Item;
const ENV = process.env.NODE_ENV;

// 图片的路径
const imgPath = (ENV === 'dev') ? '/static/images/' : IMAGES_URL;

const quneryOrders = [];
function isEmptyObject(data) {
  for (const i in data) {
    return true;
  }
  return false;
}

function filter(data) {
  for (const item in data) {
    if (data[item] && data[item].node && data[item].node.resType === 2) {
      quneryOrders.push({ node: data[item].node });
    } else {
      if (data[item].childMap) {
        const sub = data[item].childMap;
        for (const i in sub) {
          if (sub[i].node.resType === 2) {
            quneryOrders.push(sub[i]);
          }
          if (isEmptyObject(sub[i].childMap)) {
            filter(sub[i]);
          }
        }
      }
    }
  }
}

let STAY_STATE,
  SEARCHORDERS_EXPLAIN,
  FIRST_LEVEL = {
    '/task': true,
    '/settings': true,
  };

class LvYueHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      remindStatistics: null,
      ordersTips: false,
      searchResult: null,
      quickSearch: false,
    };
    // 设置多语言
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../../locales/${currentLocale}.json`),
      },
    });

  }
  // 获取hotelId
  componentWillMount() {
    const groupId = sessionStorage.getItem('attachments') || '';

  }
  // 敲回车、切换、刷新
  componentDidMount() {
    browserHistory.listen((location) => {
      this.props.updateSlidePrivilege(location);
    });
  }

  componentDidUpdate(){
    
  }


  /*
  * 路由切换
  */
  routeSwitch = (location) => {
    const find = (str, char, index) => {
      let n = str && str.indexOf(char);
      for (let i = 0; i < index; i ++) {
        n = str && str.indexOf(char, n + 1);
      }
      return n;
    };
    this.props.LayoutHeader();
    const lastIndex = find(location, '/', 1); // 是否有二级菜单
    
    const currentMenu = lastIndex > -1 ? location.substring(0, lastIndex) : location;
    this.props.setCurrentMenu({ currentMenu: currentMenu });
    // 新增
    if (sessionStorage.getItem('currentMenuCode') === 'gL4icSy1' &&
      sessionStorage.getItem('pageUrl') === '/lv/central/hotelReserve' &&
      browserHistory.getCurrentLocation().hash.substr(1) === '/lv/central/hotelReserve?from=addGroup') {
      return;
    } else {
      // sessionStorage.setItem('pageUrl', browserHistory.getCurrentLocation().hash.substr(1));
      let currentHash = location,
        currentUrl = currentHash;
      if(!FIRST_LEVEL[currentHash]){
        sessionStorage.setItem('pageUrl', currentUrl);
      }
    }

    if(location === '#/'){
      const nav = this.props.nav;
      const childMap = nav.childMap;
      const fLevel = [];
      for (const item in childMap) {
        const node = childMap[item].node;
        if (node && node.resType === 1) {
          fLevel.push(childMap[item]);
        }
      }
      if(fLevel && fLevel[0] && fLevel[0].node && fLevel[0].node.pageUrl) {
        $('#routeSwitch').trigger('click', {url: '#' + fLevel[0].node.pageUrl});
        window.location.href = '#' + fLevel[0].node.pageUrl;
      }
    }
    // this.props.LayoutHeader();
    //this.hideRoomQuickSearch();
  }

  queryCode = (arr, code) => {
    let val = '';

    arr && arr.map((item) => {
      if (item.node.resCode && item.node.resCode.toString() === code && code.toString()) {
        val = code;
      }
    });
    return val;
  }
  /**
  * 切换menu
  * @params e 导航的key
  */
  selectMenu = (e) => {
    const pathname = this.props.routing.locationBeforeTransitions.pathname;
    if (pathname === e.key) {
      window.location.reload();
      return;
    }
    sessionStorage.setItem('pageUrl', browserHistory.getCurrentLocation().pathname);
    this.props.setCurrentMenu({ currentMenu: e.key });
    this.props.GetSlide({
      resCode: e.item.props.code,
      includeChildren: 1,
      pageUrl: e.key,
    });
  }

  /**
  * 退出
  */
  handleLogout = (e) => {
    e.preventDefault();
    this.props.Logout();
  }

  /**
  * 点击新增门店，出现弹窗
  */
  handleAddHotel = () => {
    this.setState({
      visible: true,
    });
  }

  /**
  * 隐藏弹窗
  */
  hideModal = () => {
    this.setState({
      visible: false,
    });
    this.props.NewPopClearData();
  }

  /**
  * 创建dom
  */
  createDom = () => {
    const hotel = this.props.attachments;
    const firstHotelId = this.props.hotelId || '';
    
    let msgFlag = null,
      menuItem = null;
    if(this.state.remindStatistics) {
      let remindEventCount = this.state.remindStatistics;

      if(remindEventCount && remindEventCount > 0){
        msgFlag = <i className="circle-red" />;
      }

    }

    return (
      <div className="lv-header" id="lv-header-con">
        <div className="logo">
          <div className="header-logo" style={{backgroundImage:"url("+ imgPath +"logo.png)", height: logoHeight}} />
        </div>
        <div className="hotel-info">
            <span className="logo-txt">{intl.get('lv.common.production.name')}</span>
        </div>
        <div className="fn-right">
          <div className="nav-right">
            <span id="routeSwitch"></span>
            <Menu
              mode="horizontal"
              className="menu"
              onClick={this.selectMenu}
              selectedKeys={[this.props.currentMenu]}
            >
              {this.renderHeader()}
            </Menu>
          </div>
          <div className="other-background">
            <div className="account">
              <Avatar router={this.props} />
            </div>
            <div className="link">
              <span onClick={this.goToNav} >
                <i className="i-icon i-icon-link">&#xe6c9;</i>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  goToNav = () => {
    sessionStorage.removeItem('currentMenuCode');
    sessionStorage.removeItem('pageUrl');
    window.location.href = `${Config.env[Config.scheme].openUrl}/welcomeNavBar`;
  }

  /**
  * 酒店列表
  * param data 酒店列表数据
  */
  renderHotel = (data) => {
    const hotelArr = [];

    data.map((item) => {
      hotelArr.push(
        <MenuItem key={item.id} name={item.name}>
          <span>{item.name}</span>
        </MenuItem>,
      );
    });
    return hotelArr;
  }
  handleOrders = (data) => {
    for (const i in data) {
      const num = data[i];
      return num > 99 ? '99+' : `${data[i]}`;
    }
    return '';
  }

  /**
  * 创建导航
  */
  renderHeader = () => {
    const content = [];
    const headerPrivilege = this.props.headerPrivilege;

    headerPrivilege && headerPrivilege.map((item) => {
      // const img = this.props.currentMenu !== item.node.resCode
      //   ? item.node.resAttr2 : item.node.resAttr1;
      // const img = item.node.resAttr1;
      // const img = item.node.resAttr1.toString();
      let count = '';
      count = (this.handleOrders(this.props.channelOrderStatistics)) || '';
      content.push(
        <MenuItem key={item.node.pageUrl} code={item.node.resCode}>
          <Link to={item.node.pageUrl} id={item.node.pageUrl.substr(1).split('/').join('-')}>
            <div className="i-icon" dangerouslySetInnerHTML={{ __html: item.node.resAttr1 }} />
            <div className="header-name">{item.node.resName}</div>
          </Link>
        </MenuItem>,
      );
    });
    return content;
  }

  render() {
    return (
      <Header className="header">
        {
          this.createDom()
        }
      </Header>
    );
  }
}

function mapStateToProps(state) {
  const routing = state.get('routing').toJS();
  const sliderBar = state.get('sliderBar') && state.get('sliderBar').toJS() || {};
  const userInfo = state.get('userInfo') && state.get('userInfo').toJS() || {};
  const app =  state.get('app') && state.get('app').toJS() || {};
  const currentMenu = sliderBar.currentMenu;
  const attachments = userInfo.attachments;
  const nav = state.get('header') && state.get('header').toJS() || {};
  const { sliderBarMsg, channelOrderStatistics } = sliderBar;
  const group = userInfo && userInfo.group;
  return {
    routing,
    nav,
    headerPrivilege: app.headerPrivilege, // 导航的数据
    currentMenu,
    attachments,
    sliderBarMsg,
    channelOrderStatistics,
    groupInfo: group,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    GetSlide: bindActionCreators(GetSlide, dispatch),
    setCurrentMenu: bindActionCreators(setCurrentMenu, dispatch),
    Logout: bindActionCreators(Logout, dispatch),
    LayoutHeader: bindActionCreators(LayoutHeader, dispatch),
    setCurrentMenuCode: bindActionCreators(setCurrentMenuCode, dispatch),
    updateSlidePrivilege: bindActionCreators(updateSlidePrivilege, dispatch),
    getPrivilege: bindActionCreators(getPrivilege, dispatch),
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LvYueHeader);
