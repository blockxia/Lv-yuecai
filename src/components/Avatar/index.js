/**
 * @authors wangqinqin
 * @date    2017-08-11
 * @module  个人头像下拉列表
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { Link } from 'react-router';
import { Icon, Popover, Modal, Dropdown, Menu } from 'antd';
import { Logout } from '../../actions/logout';
import * as Tools from '../../utils/tools.js';
import './style.scss';
import Modal1 from '../Common/Modal';
import Account from "../Account";
import Config from 'config';
import BaseComponent from 'components/Public/BaseComponent';
// 静态图片的引入
const Imgs = {
  weixin: require('../../images/layout/weixin.png'),
  tel: require('../../images/layout/tel.png'),
  qq: require('../../images/layout/qq.png'),
  contactOwn: require('../../images/layout/contact-own.png'),
  contactTel: require('../../images/layout/contact-tel.png'),
  contactEmail: require('../../images/layout/contact-email.png'),
  weixinScan: require('../../images/layout/weixin-scan.jpg'),
  accountIcon: require('../../images/layout/acconut-icon.png'),
};

const SubMenu = Menu.SubMenu;
const IMAGES_URL = Config.env[Config.scheme].imagesUrl;
const multilingual = Config.env[Config.scheme].multilingual;
const ENV = process.env.NODE_ENV;
// 图片的路径
const imgPath = (ENV === 'dev') ? '/static/images/' : IMAGES_URL;
const contactUs = Config.env[Config.scheme].contactUs;
const exclusiveManager = Config.env[Config.scheme].exclusiveManager;

class Avatar extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      popVisible: false,
      popSubVisible: false,
      currentLocaleName: '',
      isVisible: 'init',
      highlight: '', // 高亮颜色
    };
  }

  /**
  * 联系我们浮层
  */
  // handleContact = () => {
  //   Modal.info({
  //     title: `${intl.get('lv.avatar.subPop.title')}`,
  //     okText: `${intl.get('lv.avatar.subPop.btnSave')}`,
  //     content: (
  //       <div>
  //         <p>{intl.get('lv.avatar.subPop.tips')}</p>
  //         <div className="serviceCenterInfo">
  //           <ul className="serviceInfo">
  //             <li>
  //               <img src={Imgs.weixin} className="icon-weixin" alt="" />
  //               <span>{intl.get('lv.avatar.subPop.weixin')}</span>
  //               <b className="ml5">{intl.get('lv.avatar.subPop.weixinContent')}</b>
  //             </li>
  //             <li>
  //               <img src={Imgs.tel} className="icon-tel" alt="" />
  //               <span>{intl.get('lv.avatar.subPop.tel')}</span>
  //               <b className="ml5">{intl.get('lv.avatar.subPop.telContent')}</b>
  //             </li>
  //             <li>
  //               <img src={Imgs.qq} className="icon-qq" alt="" />
  //               <span>{intl.get('lv.avatar.subPop.qq')}</span>
  //               <b className="ml5">{intl.get('lv.avatar.subPop.qqContent')}</b>
  //             </li>
  //           </ul>
  //           <div className="weixin-scan">
  //             <img src={Imgs.weixinScan} style={{width:'72px',height:'70px'}} alt="" />
  //             <p>{intl.get('lv.avatar.subPop.weixinScan')}</p>
  //           </div>
  //         </div>
  //         <div className="db-infos">
  //           <h3>{intl.get('lv.avatar.subPop.manager')}</h3>
  //           <div className="no-db-info">
  //             {this.props.getConsultant && this.props.getConsultant.name ? this.renderConsultant() : `${intl.get('lv.avatar.subPop.tips')}`}
  //           </div>
  //         </div>
  //       </div>
  //     ),
  //     onOk() {
  //     },
  //   });
  // }
  handleContact = () => {
    Modal.info({
      title: `${intl.get('lv.avatar.subPop.title')}`,
      okText: `${intl.get('lv.avatar.subPop.btnSave')}`,
      content: (
        <div>
          <p>{contactUs.contactUsTips}</p>
          <div className="serviceCenterInfo">
            <ul className="serviceInfo">
              <li>
                {contactUs.img1 ? <img src={imgPath + contactUs.img1} className="icon-weixin" alt="" /> : null }
                <span>{contactUs.title1}</span>
                <b className="ml5">{contactUs.content1}</b>
              </li>
              <li>
                {contactUs.img2 ? <img src={imgPath + contactUs.img2} className="icon-tel" alt="" /> : null }
                <span>{contactUs.title2}</span>
                <b className="ml5">{contactUs.content2}</b>
              </li>
              {contactUs.content3 ? <li>
                <img src={imgPath + contactUs.img3} className="icon-qq" alt="" />
                {/*<span>{intl.get('lv.avatar.subPop.qq')}</span>*/}
                <span>{contactUs.title3}</span>
                <b className="ml5">{contactUs.content3}</b>
              </li> : null }
            </ul>
            {contactUs.qrCodeImg ? <div className="weixin-scan">
              <img src={imgPath + contactUs.qrCodeImg} style={{width:'72px',height:'70px'}} alt="" />
              {/*<p>{intl.get('lv.avatar.subPop.weixinScan')}</p>*/}
              <p>{contactUs.qrCodeContent}</p>
            </div> : null }
          </div>
          {exclusiveManager ? <div className="db-infos">
            <h3>{intl.get('lv.avatar.subPop.manager')}</h3>
            <div className="no-db-info">
              {this.props.getConsultant && this.props.getConsultant.name ? this.renderConsultant() : `${intl.get('lv.avatar.subPop.tips')}`}
            </div>
          </div> : null }
        </div>
      ),
      onOk() {
      },
    });
  }
  /**
  * 退出
  */
  handleLogout = () => {
    this.props.Logout();
  }

  /**
  * 个人头像hover上去弹窗的可见
  */
  handleVisible = (visible) => {
    // 当鼠标移入为true
    if (visible) {
      this.setState({
        popVisible: true,
      });
    } else if (!visible && !this.state.popSubVisible) {
      this.setState({
        popVisible: false,
        highlight: '',
      });
    }
  }

  /**
  * hover多语言上去弹窗的可见
  */
  handleSubVisible = (visible) => {
    // 当鼠标移入为true
    if (visible) {
      this.setState({
        popSubVisible: true,
        highlight: '#ecf8f7',
      });
    } else {
      this.setState({
        popSubVisible: false,
        popVisible: false,
        highlight: '',
      });
    }
  }

  /**
  * 点击个人资料的跳转
  */
  ownPage = () => {
    
    this.setState({visible:true})


  }

  /**
  * 点击多语言的切换
  * @param e 多语言
  */
  handleClick = (e) => {
    if (e.key === 'popPersonal') {
     this.ownPage()
      return;
    } else if (e.key === 'popContactUs') {
      this.handleContact();
      return;
    } else if (e.key === 'popLogout') {
      this.handleLogout();
      return;
    }
    // Tools.setCurrentLocale(e.key);
    // this.setState({
    //   currentLocaleName: Tools.findCurrentLocaleNameByLang(this.props.lang, e.key),
    // });
    location.reload();
  }

  handleMouseOver = () => {
    this.setState({
      highlight: '#ecf8f7',
    });
  }

  handleMouseOut = () => {
    if (!this.state.popSubVisible) {
      this.setState({
        highlight: '',
      });
    }
  }

  /**
  * 创建个人中心弹窗
  */
  createAvatar = () => {
    const avatarUrl = (this.props.users && this.props.users.avatar) ? this.props.users.avatar : Imgs.accountIcon;
    const content = (
      <Menu
        onClick={this.handleClick}
      >
        <Menu.Item className="avatar-own" key="popPersonal">{intl.get('lv.avatar.popPersonal')}</Menu.Item>
        <Menu.Item className="layout avatar-own" key="popLogout">{intl.get('lv.avatar.popLogout')}</Menu.Item>
      </Menu>
    );
    
    return (
      <Dropdown
        dropdownClassName="avatar-dropdown"
        overlay={content}
        placement="bottomCenter"
        // getPopupContainer={() => document.getElementById('avatar-container')}
      >
        <div className="popover-img" style={{ backgroundImage: 'url(' + avatarUrl + ')' }} />
      </Dropdown>
    );
  }

  /**
  * 创建语言弹窗
  */
  renderLang = (data) => {
    const content = [];
    let obj = {};
    const localesKey = Tools.getCurrentLocale();
    const currentLocaleName = Tools.findCurrentLocaleNameByLang(this.props.lang, localesKey);

    const localName = currentLocaleName === '' ? intl.get('defaultLangName') : currentLocaleName;
    data && data.map((item) => {
      obj = {
        langName: item.langName,
        lang: item.lang,
      };

      content.push(
        <Menu.Item
          className="langName"
          key={item.lang}
        >{item.langName}{localName === item.langName ? <Icon type="check-circle-o" /> : null }</Menu.Item>,
      );
    });
    return content;
  }

  /**
  * 联系我们-专属商务经理
  */
  renderConsultant = () => {
    return (
      <div>
        <ul className="consultant-message">
          <li><img src={Imgs.contactOwn} alt="" />{this.props.getConsultant.name}</li>
          <li><img src={Imgs.contactTel} alt="" />{this.props.getConsultant.mobile}</li>
          <li><img src={Imgs.contactEmail} alt="" />{this.props.getConsultant.email}</li>
        </ul>
      </div>
    );
  }
handleCancel=()=>{
  this.setState({
    visible: false,
  });
}

  render() {
    return (
      <div className="avatar-container" id="avatar-container">
        {this.createAvatar()}
        {this.state.visible ? <Modal1
      type="success"
      onCancel={this.handleCancel}
      visible={this.state.visible}
      footerIsNull={true}
      wrapClassName="account-modal"
    >
      <Account
      handleCancel={this.handleCancel}
      formatLayout="pop"
    handlePopCancel={this.hideModal}
        textAlign="center"
        canReq='no'
      />
    </Modal1> : ''}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userInfo = state.get('userInfo').toJS();
  const { lang, users } = userInfo;
  const getConsultant = state.get('getConsultant') && state.get('getConsultant').toJS();
  return {
    lang,
    users,
    getConsultant,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    Logout() {
      dispatch(Logout());
    },
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Avatar);
