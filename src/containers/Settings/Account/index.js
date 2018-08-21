import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseComponent from 'components/Public/BaseComponent';
import Slider from 'components/Common/SliderBar';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
import './style.scss';

export default class Account extends BaseComponent {
  constructor(props, context) {
    super(props, context);
  }

	componentDidMount() {
		let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
		$('.main-content').css('minHeight', clientHeight + 'px').css('maxHeight', clientHeight + 'px');
		$(window).resize(function () {
			let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
			$('.main-content').css('minHeight', clientHeight + 'px').css('maxHeight', clientHeight + 'px');
		});
	}

  render() {
    return (
      <div>
            {this.props.children}
      </div>
    );
  }
}
