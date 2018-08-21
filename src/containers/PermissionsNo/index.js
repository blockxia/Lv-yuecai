/**
 * @authors litengfei
 * @date    2017-12-05
 * @module  
 */
import React, { Component } from 'react';
import { Button, Modal, Form } from 'antd';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import BaseComponent from 'components/Public/BaseComponent';
import * as Tools from '../../utils/tools.js';
import StaticHeader from '../../components/Common/StaticHeader';
import Config from 'config';
import './style.scss';

export default class PermissionsNo extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false,
      disableGroupVisible: false,
    };
  }

  render() {
    return (
      <div>
        <StaticHeader
          showName={false}
          headerTitle=""
          showMenuList={true}
        />
        <div className="permissionsNo-container">
          <div className="permissionsNo-tips1">
            <i className="i-icon">&#xe626;</i>
            <div className="content">
              <p className="cotent-tips1">{intl.get('lv.common.permissions.no')}</p>
              <p className="cotent-tips2">{intl.get('lv.common.permissions.tips.email')}：{intl.get('lv.common.permissions.email')}</p>
            </div>
          </div>  
        </div>
      </div>
    );
  }
}
