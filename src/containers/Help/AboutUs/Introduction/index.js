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

export default class Introduction extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }


  render() {
    return (
      <div className="Introduction-content">
          <div className="help-main-title">
            {'关于旅悦'}
          </div>
          <div className="help-content">
            {'旅悦集团于2016年成立，是携程集团的战略投资公司，由去哪儿网总裁张强先生兼任集团CEO，目前是集酒店管理公司（天津）、信息技术科技公司（北京）、采购贸易公司（成都）于一体的旅游产业集团。旅悦聚焦于旅游产业链实体的建设与运营，旨在利用互联网创新技术为旅游业提供一揽子解决方案。旗下有个性精品客栈、度假酒店品牌花筑、城市设计酒店品牌索性。 花筑品牌，目前有国内直营店27家，海外直营店4家，国内加盟店11家，国内在建店28家，泰国、韩国、越南、柬埔寨、马来西亚等国家在建店10家。计划2018年花筑品牌开业门店数量达到500家。2017年花筑客栈被中国饭店协会评选为“最受欢迎民宿客栈奖”，旅悦也与众多老牌旅游企业一同入围“2017中国旅游业最具影响力匠心企业”。'}
          </div>
      </div>
    );
  }
}
