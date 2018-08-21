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

import './style.scss';

const pmsLogo = require('../../../images/layout/nav-logo.png');

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

  render() {
    // {intl.get('lv.settings.addGroup.headerTitle')}
    return (
      <div>
        <div className="staticHeader fn-clear">
          <div className="staticHeader-logo fn-clear">
            <img src={pmsLogo} alt="pms logo" />
            <span className="staticHeader-logo-txt">{this.props.headerTitle}</span>
            {this.props.showMenuList ? <MenuList /> : null}
          </div>
          {this.props.showName && this.props.usersName ? <div className="staticHeader-content fn-clear">
            <div className="staticHeader-account">
              <Link to="/account/index.html" className="staticHeader-account-txt" id="staticHeader-accountName">{this.props.usersName}</Link>
              <Avatar />
            </div>
          </div> : <Avatar router={this.props} />}
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
