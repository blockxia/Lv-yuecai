/**
 * @authors wangqinqin
 * @date    2017-08-17
 * @module  静态导航，用于个人资料、创建门店页面
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import Avatar from '../../Avatar';
import { Link } from 'react-router';
import * as Tools from '../../../utils/tools.js';
import MenuList from '../Header/menuList.js';
import Config from 'config';

import './style.scss';

const pmsLogo = require('../../../images/layout/nav-logo.png');

const IMAGES_URL = Config.env[Config.scheme].imagesUrl;
const ENV = process.env.NODE_ENV;
const imgPath = (ENV === 'dev') ? '/static/images/' : IMAGES_URL;

class StaticHeader extends Component {
  constructor(props) {
    super(props);
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../../locales/${currentLocale}.json`),
      },
    });
  }

  goToNav = () => {
    sessionStorage.removeItem('currentMenuCode');
    sessionStorage.removeItem('pageUrl');
    window.location.href = `${Config.env[Config.scheme].openUrl}/welcomeNavBar`;
  }

  render() {
    // {intl.get('lv.settings.addGroup.headerTitle')}
    return (
      <div>
        <div className="staticHeader fn-clear">
          <div className="logo">
            <div className="header-logo" style={{backgroundImage:"url("+ imgPath +"logo.png)"}} />
          </div>
          <div className="hotel-info">
            <span className="staticHeader-logo-txt">{intl.get('lv.common.production.name')}</span>
          </div>
          {/*<div className="staticHeader-logo fn-clear">
            <img src={pmsLogo} alt="pms logo" />
            <span className="staticHeader-logo-txt">{this.props.headerTitle}</span>
            {this.props.showMenuList ? <MenuList /> : null}
          </div>*/}
          <div className="fn-right">
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
        <div className="staticHeader-side-left" />
        <div className="staticHeader-side-right" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StaticHeader);
