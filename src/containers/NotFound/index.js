/**
 * @authors wangqinqin
 * @date    2017-10-30
 * @module  404页面
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import StaticHeader from '../../components/Common/StaticHeader';
import * as Tools from 'utils/tools.js';
import './style.scss';
import Config from 'config';

const url_prefix = Config.env[Config.scheme].prefix;

class NotFound extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
    };
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../locales/${currentLocale}.json`),
      },
    });
  }

  componentDidMount() {
  }
  handleGoFirstPage = () => {
    window.location.href = '/';
  }
  handleGoBack=()=>{
     window.history.back();
  }
  render() {
    const users = this.props.users;

    return (
      <div className="notfound-error">
        <StaticHeader
          pp={true}
          headerTitle=""
        />
        <div className="notfound-main fn-clear">
          <div className="notfound-logo">
            <p className="notfound-hate">{intl.get("lv.containers.notfound.hate")}</p>
            <p className="notfound-hite">{intl.get("lv.containers.notfound.hite")}</p>
            <div className="notfound-txt">{intl.get('lv.containers.notfound.txt')}</div>
            <div className="notfound-btn" >
              <Button type="primary" onClick={this.handleGoFirstPage.bind(this)}>{intl.get('lv.containers.notfound.gofirst')}</Button>
              <Button type="primary" onClick={this.handleGoBack.bind(this)} style={{ marginLeft: '20px' }}>{intl.get('lv.containers.notfound.goback')}</Button>
            </div>
          </div>


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
)(NotFound);
