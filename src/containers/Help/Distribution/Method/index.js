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

export default class Method extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }


  render() {
    return (
      <div className="Introduction-content">
          <div className="help-main-title">
            {'配送方式'}
          </div>
          <div className="help-title">{'第三方配送'}</div>
          <div className="help-content">
            {'(1).悦采网委托第三方快递公司为客户提供送货服务。'}
          </div>
          <div className="help-content">
            {'(2).客户可以在悦采网网站“我的订单”查询货物配送信息，也可以登录第三方快递网站查询快递信息。'}
          </div>
          <div className="help-content">
            {'(3).第三方快递支持客户打开运输包装验货，商品包装完好，客户可以先签收，如果发现商品有质量问题可以致电悦采网客服进行售后处理。均 可送达。'}
          </div>
          <div className="help-title">{'注意事项'}</div>
          <div className="help-content">
            {'(1).请在提交订单时准确选择地址信息，否则有可能导致货到付款订单无法送达和配送超时。'}
          </div>
          <div className="help-content">
            {'(2).签收时请注意检查外包装和配件是否齐全完整，签收后如果发现异常可以致电大茶网客服。'}
          </div>
      </div>
    );
  }
}
