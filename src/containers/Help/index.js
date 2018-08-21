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

export default class Help extends PureComponent {
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
      <Layout className="help-container">
       <Slider />
      <Layout className="help-content">
          <Content>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
