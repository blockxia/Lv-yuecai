/**
 * @authors litengfei
 * @date    2017-11-21
 * @module  头部导航
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import intl from 'react-intl-universal';
import { bindActionCreators } from 'redux';
import { Row, Col, Menu, Dropdown, Icon, Layout, Button, Modal, Popover,Input,Affix } from 'antd';
import { LayoutHeader, fetchCatlogs, fetchCartNum } from '../../../actions/header';
import { GetSlide, setCurrentMenu, setCurrentMenuCode } from '../../../actions/sliderBar';
import { updateSlidePrivilege, getPrivilege } from '../../../actions/app';
import { fetchList } from '../../../actions/PlatformNotice/platformNotice';
import * as shoppingCart from '../../../actions/ShoppingCart/shoppingCart';
import { NewPopClearData } from '../../../actions/newPopAddress';
import MenuList from './menuList.js';
import * as Tools from '../../../utils/tools.js';
import { getDate } from 'utils/date';
import { formatMoney } from 'utils/tools';
import cookie from 'utils/cookie.js'; 
import message from 'components/Common/message';

import { observer } from 'utils/observer.js';

import './style.scss';

import axios from 'api/axios';
import Config from 'config';
const URL_PREFIX = Config.env[Config.scheme].prefix;
const IMAGES_URL = Config.env[Config.scheme].imagesUrl;
const logoSuffix = Config.env[Config.scheme].logoSuffix;
const logoHeight = Config.env[Config.scheme].logoHeight;
// 提醒url
const URL_REMIND = {
  quantity_statistics: '/crs/remind/group/unread_count.json',
  order_local_search: '/order/local/list/search.json'
};

const { Header, Content, Sider } = Layout;
const MenuItem = Menu.Item;
const ENV = process.env.NODE_ENV;

// 图片的路径
const imgPath = (ENV === 'dev') ? '/static/images/' : IMAGES_URL;

const quneryOrders = [];
function isEmptyObject(data) {
  for (const i in data) {
    return true;
  }
  return false;
}

function filter(data) {
  for (const item in data) {
    if (data[item] && data[item].node && data[item].node.resType === 2) {
      quneryOrders.push({ node: data[item].node });
    } else {
      if (data[item].childMap) {
        const sub = data[item].childMap;
        for (const i in sub) {
          if (sub[i].node.resType === 2) {
            quneryOrders.push(sub[i]);
          }
          if (isEmptyObject(sub[i].childMap)) {
            filter(sub[i]);
          }
        }
      }
    }
  }
}

let MENU_LIST = [
    '/platformNotice',
    '/order',
    '/settings'
];

  const initQuery = location => {
    let arr = decodeURI(location.search).replace('?', '');
    if (arr) {
      let params = {};
      arr.split('&').map(it => {
        let [key, value] = it.split('=');
        params[key] = value;
      })
      return params;
    }
    return null;
  }
class LvYueHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      showInline: false,
      showSubMenu: false,
      subMenus: null
    };
    // 设置多语言
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../../locales/${currentLocale}.json`),
      },
    });
    this.search=null;
    this.search1=null;
  }
  // 获取hotelId
  componentWillMount() {
    const groupId = sessionStorage.getItem('attachments') || '';

  }
  // 敲回车、切换、刷新
  componentDidMount() {
    this.props.fetchNotice();
    this.props.fetchCartNum();
    this.props.fetchCartList();
    let pathname = location.pathname;
    let search = initQuery(location);
    if (pathname === '/search') {
      this.setState({value: search.name || '', path: search.path || ''})
    }
    else {
      this.setState({value: '', path: ''})
    }
    this.props.fetchCatlogs();
    browserHistory.listen((location) => {
      this.props.updateSlidePrivilege(location);
    });
  }
  componentWillReceiveProps(next) {
    if (this.props.routing.locationBeforeTransitions.pathname === '/search' && next.routing.locationBeforeTransitions.pathname !== '/search') {
      this.setState({value: '', path: ''})
    }
  }

  /**
   *  点击头部固定菜单
   */
  headerMenuClick(url, resCode) {
    // console.log(url, resCode);
    const pathname = this.props.routing.locationBeforeTransitions.pathname;
    if (pathname === url) {
      window.location.reload();
      return;
    }
    sessionStorage.setItem('pageUrl', browserHistory.getCurrentLocation().pathname);
    this.props.setCurrentMenu({ currentMenu: url });
    this.props.GetSlide({
      resCode: resCode,
      includeChildren: 1,
      pageUrl: url,
    });
  }
  /**
  * 创建dom
  */
  createDom = () => {
    const users = this.props.users || null;
    const {headerPrivilege, catlogs=[], noticeCount=0, cartNum=0, cartList=[]} = this.props;

    return (
      <div className="lv-persional-header" id="lv-header-con">
        <div className="first-container">
          <div className="first-line padding-line">
            <span className="title">{intl.get('lv.common.production.welcome')}</span>
            <span className="user-info-line"><span>{`您好，`}</span>{
              users 
                ? <span className="user-name" title={users.realName}>{users.realName}</span> 
                : <span>{'请'}<a className="login-btn">{'登录'}</a></span>
            }</span>
            <span className="menu-list">
              {
                (headerPrivilege && headerPrivilege.length) && MENU_LIST.map((it, idx) => {
                  let item = headerPrivilege.filter(i => i.node.pageUrl === it)[0];
                  return (<a key={idx} className="menu-btn" 
                    id={item.node.pageUrl.substr(1).split('/').join('-')}
                    onClick={this.headerMenuClick.bind(this, item.node.pageUrl, item.node.resCode)}>
                    {item.node.resName}{
                      item.node.pageUrl.includes('/platformNotice') && noticeCount
                        ? <i className="sup-title">{noticeCount > 99 ? '99+' : noticeCount}</i>
                        : null
                    }
                  </a>)
                })
              }
            </span>
          </div>
        </div>
        <div className="search-line padding-line">
            <div className="search-box">
              <div className="persional-search">
                <Input.Search
                  ref={ele => this.search = ele}
                  className="search-input-wrap"
                  placeholder=""
                  onSearch={value => {
                    this.setState({path: ''});
                    browserHistory.push(`/search?name=${value}&pn=1&ps=20`)
                  }}
                  style={{ width: '100%' }}
                  value={this.state.value || ''}
                  onChange={e => this.setState({value: e.target.value})}
                />
                <a className="search-icon-btn" onClick={this.search && this.search.onSearch}></a>
              </div>
              <span className="hot-word">
                {
                  ['床垫', '床单', '慕斯家居', '窗帘', '咖啡'].map((it, idx) => {
                    return <a className="hot-word-item" key={idx} 
                      onClick={x => {
                        this.setState({value: it});
                        if (this.search && this.search.input) {
                          this.search.input.input.value = it;
                          this.search.onSearch(it);
                        }
                      }}>{it}</a>
                  })
                }
              </span>
            </div>
            <div className="shopping-cart">
              <a href="#" onClick={x => this.setState({showCartList1: !this.state.showCartList1})}>{cartNum ? <span className="count">{cartNum}</span> : null}</a>
              {this.state.showCartList1 ? this.createCart(cartList) : null}
            </div>
        </div>
        <Affix className="affix-wrap" offsetTop={0} onChange={affix => this.setState({isAffix: affix})}>
          <div className="affix-container" onMouseEnter={x => this.setState({showSubMenu: true})}
             onMouseLeave={x => this.setState({showSubMenu: false, menuId: null, subMenus: null})}>
            <div className="menu-line padding-line">
              {this.state.isAffix && <div className="small-logo"></div>}
              <div className="menu-list">
                {
                  // ['首页', '布草', '易耗品', '床垫', '卫浴用品', '客房用品', '餐具', 'IT产品'].map((it, idx) => {
                  [{name: '首页'}].concat(catlogs).map((it, idx) => {
                    return <a key={idx} className={this.state.path && +this.state.path.split('|')[0] === it.id ? 'active' : ''} onMouseOver={x => {
                      if (idx) {
                        this.setState({showSubMenu: true, menuId: it.id, subMenus: it.catalogResults});
                      }
                    }} onClick={x => {
                      const pathname = this.props.routing.locationBeforeTransitions.pathname;
                      if (idx) {
                        this.setState({value: '', path: it.id.toString(), showSubMenu: false, menuId: null, subMenus: null});
                        browserHistory.push(`/search?catalogId=${it.id}&pn=1&ps=20&path=${it.id}`);
                      }
                      else {
                        if (pathname === '/main') {
                          window.location.reload();
                        }
                        else {
                          browserHistory.push('/main');
                        }
                      }
                    }}>{it.name}</a>
                  })
                }
              </div>
              {this.state.isAffix && <div className="menu-right">
                {this.state.showInline && <div className="inline-search">
                  <a className="toggle-btn" onClick={x => this.setState({showInline: false})}>>></a>
                  <Input.Search
                    ref={ele => this.search1 = ele}
                    className="search-input-wrap"
                    placeholder=""
                    onSearch={value => {
                      this.setState({path: ''});
                      browserHistory.push(`/search?name=${value}&pn=1&ps=20`)
                    }}
                    style={{ width: '100%' }}
                    value={this.state.value || ''}
                    onChange={e => this.setState({value: e.target.value})}
                  />
                </div>}
                <a className="search" onClick={x => {
                  if (this.state.showInline) {
                    if (this.search1 && this.search1.input) {
                      let val = this.search1.input.input.value;
                      this.search1.onSearch(val);
                    }
                  }
                  else {
                    this.setState({showInline: true});
                  }
                }}></a>
                <a className="mine" onClick={x => browserHistory.push('/settings')}></a>
                <span style={{position: 'relative'}}>
                <a className="cart" onClick={x => this.setState({showCartList2: !this.state.showCartList2})}>
                  
                </a>
                {this.state.showCartList2 ? this.createCart(cartList) : null}
                </span>
              </div>}
            </div>
            {this.state.showSubMenu && <div className="sub-menu"  onMouseEnter={x => this.setState({showSubMenu: true})}>
                <div className="catlogs-list">
                {
                  (this.state.subMenus || []).map((it, idx) => {
                    return (
                      <div key={idx} className="sub-menu-item">
                        <a className="catlogs2" onClick={x => {
                          this.setState({value: '', path: [this.state.menuId, it.id].join('|')});
                          browserHistory.push(`/search?catalogId=${it.id}&pn=1&ps=20&path=${this.state.menuId}|${it.id}`);
                        }}>{it.name}</a>
                        <div className="sub-sub-menu">
                          {
                            (it.catalogResults || []).map((l, i) => {
                              return <a key={i} className="catlogs3" onClick={x => {
                                this.setState({value: '', path: [this.state.menuId, it.id, l.id].join('|')});
                                browserHistory.push(`/search?catalogId=${l.id}&pn=1&ps=20&path=${this.state.menuId}|${it.id}|${l.id}`);
                              }}>{l.name}</a>
                            })
                          }
                        </div>
                      </div>
                    );
                  })
                }
                </div>
            </div>
            }
          </div>
        </Affix>
      </div>
    );
  }

  // 小购物车列表
  createCart = (list) => {
    return list && list.length ? <div className="shopping-cart-list">
        <div className="items-list">
          {
            list.map((it, idx) => {
              return (<div className="line" key={idx}>
                <img className="item-img" src={it.imageUrl} />
                <div className="item-info">
                  <span className="first-line">{it.commodityName}</span>
                  <span className="second-line">{`${it.commodityAttributes} x${it.commodityNumber}`}</span>
                </div>
                <div className="item-price">
                  {`￥${formatMoney(it.price)}`}
                </div>
                <div className="btns">
                  <a onClick={x => {
                    this.props.deleteCartItem({id: it.id}, () => {
                      this.props.fetchCartList();
                    }, () => {message.warn('操作失败')});
                  }}>{'删除'}</a>
                </div>
              </div>)
            })
          }
        </div>
        <div className="total-line">
          <div className="total-count">
            <span className="first">{'商品合计：'}</span>
            <span className="second">{`￥${formatMoney(list.map(it => it.price * it.commodityNumber || 0).reduce((total, it) => total += it))}`}</span>
          </div>
          <div className="btns"><Button size="large" type="primary" onClick={x => {
            browserHistory.push('/shoppingCart');
          }}>{'去购物车结算'}</Button></div>
        </div>
      </div> : null;
  }
  goToNav = () => {
    sessionStorage.removeItem('currentMenuCode');
    sessionStorage.removeItem('pageUrl');
    window.location.href = `${Config.env[Config.scheme].openUrl}/welcomeNavBar`;
  }

  render() {
    return (
      <Header className="persional-header">
        {
          this.createDom()
        }
      </Header>
    );
  }
}

function mapStateToProps(state) {
  const routing = state.get('routing').toJS();
  const sliderBar = state.get('sliderBar') && state.get('sliderBar').toJS() || {};
  const userInfo = state.get('userInfo') && state.get('userInfo').toJS() || {};
  const app =  state.get('app') && state.get('app').toJS() || {};
  const currentMenu = sliderBar.currentMenu;
  const attachments = userInfo.attachments;
  const nav = state.get('header') && state.get('header').toJS() || {};
  const { sliderBarMsg, channelOrderStatistics } = sliderBar;
  const group = userInfo && userInfo.group;
  return {
    routing,
    nav,
    headerPrivilege: app.headerPrivilege, // 导航的数据
    currentMenu,
    attachments,
    sliderBarMsg,
    channelOrderStatistics,
    groupInfo: group,
    users: userInfo && userInfo.users,
    catlogs: state.get('catlogs').toJS().list || [],
    cartNum: nav.cartNum || 0,
    noticeCount: nav.noticeCount || 0,
    cartList: nav.cartList || []
  };
}

function mapDispatchToProps(dispatch) {
  return {
    GetSlide: bindActionCreators(GetSlide, dispatch),
    setCurrentMenu: bindActionCreators(setCurrentMenu, dispatch),
    LayoutHeader: bindActionCreators(LayoutHeader, dispatch),
    setCurrentMenuCode: bindActionCreators(setCurrentMenuCode, dispatch),
    updateSlidePrivilege: bindActionCreators(updateSlidePrivilege, dispatch),
    getPrivilege: bindActionCreators(getPrivilege, dispatch),
    fetchCatlogs: bindActionCreators(fetchCatlogs, dispatch),
    fetchNotice: bindActionCreators(fetchList, dispatch),
    fetchCartNum: bindActionCreators(fetchCartNum, dispatch),
    fetchCartList: bindActionCreators(shoppingCart.fetchList, dispatch),
    deleteCartItem: bindActionCreators(shoppingCart.deleteCommodity, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LvYueHeader);
