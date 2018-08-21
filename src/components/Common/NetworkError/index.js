/**
 * @authors wangqinqin
 * @date    2017-10-30
 * @module  错误页面
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import StaticHeader from '../../../components/Common/StaticHeader';
import * as Tools from 'utils/tools.js';
import './style.scss';
import Config from 'config';

const url_prefix = Config.env[Config.scheme].prefix;

class NetWorkError extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
    };
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../../locales/${currentLocale}.json`),
      },
    });
  }

  componentDidMount() {
  }
  netWorkRefresh = () => {
    sessionStorage.removeItem('pageUrl');
    window.location.href = '/';
  }
  render() {
    const users = this.props.users;

    return (
      <div className="network-error">
        <StaticHeader
          usersName={(users && users.name) || ''}
          showName={true}
          headerTitle=""
        />
        <div className="network-main fn-clear">
          <div className="network-logo"></div>
          <div className="network-txt">{intl.get('lv.common.netWorkTxt')}</div>
          <div className="network-btn" onClick={this.netWorkRefresh}><Button type="primary">{intl.get('lv.common.refreshBtn')}</Button></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userInfo = state.get('userInfo').toJS();
  const { users } = userInfo;
  return {
    users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetWorkError);
