/**
 * @authors wangchen
 * @date    2018-08-20
 * @module  帮助中心
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Slider from 'components/Common/SliderBar';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {SubMenu} = Menu;
const {Content, Sider} = Layout;
import './style.scss';
import contactImg from '../../../../images/contact.png';

export default class ContactUs extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }


  render() {
    return (
      <div className="Introduction-content">
          <div className="help-main-title">
            {'联系我们'}
          </div>
          <div className="help-content">
            {'客服热线：'}<span>{'4008-987-118'}</span>
          </div>
          <div className="help-content">
            {'总部地址：'}<span>{'北京市海淀区东升科技园A1楼3层旅悦集团'}</span>
          </div>
          <div className="help-img">
            <img src={contactImg} />
          </div>
      </div>
    );
  }
}
