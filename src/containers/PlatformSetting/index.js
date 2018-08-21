import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Slider from 'components/Common/SliderBar';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
import './style.scss';

export default class PlatformSetting extends PureComponent {
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
      <Layout className="main-container">
        <Slider />
        <Layout className="main-content">
          <Content>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
