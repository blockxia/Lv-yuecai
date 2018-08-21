import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import BaseComponent from 'components/Public/BaseComponent';
import TimeOut from 'components/Common/TimeOut';
import Header from 'components/Common/HeaderNew';
import Footer from 'components/Common/FooterBar';
import Slider from 'components/Common/SliderBar';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Content, Sider } = Layout
import * as Tools from 'utils/tools.js';
import Config from 'config';
import * as AppActions from '../actions/app';
import Loading from 'components/Common/Loading';
import './style.scss';

const HOTELID = sessionStorage.getItem('hotelId') || '';
const IMAGES_URL = Config.env[Config.scheme].imagesUrl;
const ENV = process.env.NODE_ENV;
// 图片的路径
const imgPath = ENV === 'dev' ? '/static/images/' : IMAGES_URL;

class App extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    let userAgent = navigator.userAgent, //取得浏览器的userAgent字符串
      isChromOrSafari = userAgent.indexOf("Chrome") > -1 || userAgent.indexOf("Safari") > -1,
      isMac = /macintosh|mac os x/i.test(userAgent),
      isWindows = /windows|win32/i.test(userAgent),
      isWeiXin = userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' ? true : false,
      downloadUrl;

    this.state = {
      isChromOrSafari: isChromOrSafari,
      isWeiXin: isWeiXin,
      downloadUrl: downloadUrl,
      timeout: false,
      showShift: false
    };

    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../locales/${currentLocale}.json`)
      }
    });

  }

  componentDidMount() {
    if (!this.state.isChromOrSafari) {
      return;
    }

    // 获取页面权限
    this.props.getPrivilege();
    browserHistory.listen((location) => {
      this.renderSlider(location);
    });
  }

  renderSlider = (location) => {
    this.props.updateSlidePrivilege(location);
  }

  networkTimeOut() {
    this.setState({
      timeout: true,
    });
  }

  render() {
    let contentFlag = false;
    if (this.props.allPrivilege !== null && window.location.pathname.indexOf('/networkError') == -1) {
      contentFlag = true;
    } else if (window.location.pathname.indexOf('/networkError') > -1 || window.location.pathname.indexOf('/permissionsNo') > -1) {
      contentFlag = true;
    }
    return (
      <Layout>
        <Header />
        <Layout className="content-layout">
          <TimeOut visible={this.state.timeout} />
          <div id="networkTimeOut" onClick={this.networkTimeOut.bind(this)}></div>
          {contentFlag ? this.props.children : <Loading display='block' />}
        </Layout>
        <Footer />
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  let userInfo = state.get('userInfo') && state.get('userInfo').toJS() || {};
  let { symbol, users, hotelId } = userInfo;
  const routing = state.get('routing') && state.get('routing').toJS() || {};
  const stateApp = state.get('app') && state.get('app').toJS() || {};
  return {
    symbol,
    users,
    allPrivilege: stateApp.allPrivilege, // 菜单数据
    routing,
    hotelId,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AppActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
