/**
 * @authors wangchen
 * @date    2017-08-20
 * @module  采购底部导航
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import './style.scss';
import {browserHistory} from 'react-router';
import brand from '../../../images/footer/brand.png';
import quality from '../../../images/footer/quality.png';
import logistics from '../../../images/footer/logistics.png';
import service from '../../../images/footer/service.png';




class FooterBar extends Component {
  constructor(props) {
    super(props);
  }

  getFooterHeader = () => {
      let content = null;
      let contentArr = [{title:'放心品牌',img:brand,tag:'旅悦集团直接经营'},{title:'放心品质',img:quality,tag:'品牌商直接采购 品质保证'},{title:'放心物流',img:logistics,tag:'物流公司直接合作配送'},{title:'放心服务',img:service,tag:'客户服务全年无休 用户体验至上'}];
      content = contentArr.map((elem,index) => {
        return(
            <div className="header-sub" key={index+"header"} style={{width:'25%'}}>
                <img src={elem.img}/>
                <div>
                  <div className="header-title">{elem.title}</div>
                  <div className="header-tag">{elem.tag}</div>
                </div>
            </div>
        )
      })
        return content;
  }


  getFooterNav = () => {
    let shopping = [{title:'立即登录'},{title:'如何支付'},{title:'发票说明'},{title:'交易条款'},{title:'交易保障'}];
    let distribution = [{title:'配送方式',router:'/help/distribution/method'},{title:'运费说明',router:'/help/distribution/scope'}];
    let serviceArr = [{title:'退换货流程',router:'/help/service/returnGoods'},{title:'退款流程',router:'/help/service/refund'}];
    let aboutUs = [{title:'关于我们',router:'/help/aboutUs/introduction'},{title:'联系我们',router:'/help/aboutUs/contactUs'}];
    return(
        <div className="footer-nav">
          {this.setFooterNav("物流配送",distribution)}
          {this.setFooterNav("售后服务",serviceArr)}
          {this.setFooterNav("关于我们",aboutUs)}
          {/* {this.setFooterNav("关于我们",aboutUs)} */}
        </div>
    )

  }

  setFooterNav = (title,arr) => {
    return(
      <div className="nav-sub" style={{width:'33.33%'}}>
          <div className="nav-sub-title">{title}</div>
          {arr.map((elem,index) => {
            return(
                <div key={index+"nav-title"} className="nav-sub-subTitle" onClick={this.clickNavRouter.bind(this,elem)}>{elem.title}</div>
            )
          })}
      </div>
    ) 
  }

  clickNavRouter = (elem) => {
    browserHistory.push(elem.router)
  }


  render() {

    return (
      <div className="footBar-content">
        <div className="header-content" >
            {this.getFooterHeader()}
        </div>
          {this.getFooterNav()}
          <div className="footBar-tele">{'客服电话 4008-987-118'}<span>{'7x24小时全年无休'}</span></div>
          <div className="footer-record">{'京ICP备17066056号-1 Copyright 2017 www.lvyuetravel.com all rights reserved'}</div> 
      </div>
    );
  }
}


export default FooterBar
