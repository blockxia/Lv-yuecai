/**
 * @authors wangqinqin
 * @date    2017-08-08
 * @module  侧边栏导航
 */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu } from 'antd';
import intl from 'react-intl-universal';
import * as Tools from '../../../utils/tools.js';
import { browserHistory } from 'react-router';
import { setCurrentSubMenu, setCurrentSecondMenu, setCurrentSubCode } from '../../../actions/sliderBar';
import './style.scss';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
const ENV = process.env.NODE_ENV;
const RES_CODE = {
  agency: 'Yscadbeabf2mpJdg',
};

// 图片的路径
// const imgPath = ENV === 'dev' ? '/static/images/' : 'http://lvyue-static-test.oss-cn-beijing.aliyuncs.com/pms/zh/static/images/';

class SliderBar extends Component {
  constructor(props) {
    super(props);
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../../locales/${currentLocale}.json`),
      },
    });
  }

  componentDidMount() {
    browserHistory.listen((location) => {
      this.routeSwitch(location.pathname);
    });
    this.routeSwitch(browserHistory.getCurrentLocation().pathname);
    var id = browserHistory.getCurrentLocation().pathname.split('?')[0].substr(2).split('/').join('-');
    if($('#'+id).find('.sub-name').length){
      document.title = $('#'+id).find('.sub-name').text()+' - ' + intl.get('lv.common.global.title');
    }
  }

  // caoxifeng-add split('?')[0] 去除后面？参数匹配
  componentDidUpdate(){
    var id = browserHistory.getCurrentLocation().hash.split('?')[0].substr(2).split('/').join('-');
    if($('#'+id).find('.sub-name').length){
      document.title = $('#'+id).find('.sub-name').text()+' - ' + intl.get('lv.common.global.title');
    }
  }


  /*
  * 路由切换
  */
  routeSwitch = (location) => {
    // caoxifeng-add split('?')[0] 去除后面？参数匹配
    location = location.split('?')[0];
    const find = (str, char, index) => {
      let n = str.indexOf(char);
      for (let i = 0; i < index; i ++) {
        n = str.indexOf(char, n + 1);
      }
      return n;
    };
    const lastIndex = find(location, '/', 2); // 是否有三级菜单
    const currentSecondMenu = lastIndex > -1 ? location.substring(0, lastIndex) : location;
    this.props.setCurrentSubMenu({ currentSubMenu: location }); // 三级
    this.props.setCurrentSecondMenu({ currentSecondMenu: currentSecondMenu }); // 二级
  }

  /**
  * 判断是否为空对象
  * @params obj
  */
  isEmptyObject = (obj) => {
    for (const name in obj) {
      return false; // 返回false，不为空对象
    }
    return true; // 返回true，为空对象
  }

  /**
  * 选择侧边栏
  * @params e 侧边栏key
  */
  selectMenu = (e) => {
    const pathname = this.props.routing.locationBeforeTransitions.pathname;
    if (pathname === e.key) {
      window.location.reload();
      return;
    }
    this.props.setCurrentSubMenu({ currentSubMenu: e.key });
    sessionStorage.setItem('pageUrl', browserHistory.getCurrentLocation().pathname);
  }

  clickMenu = (e) => {
    this.props.setCurrentSecondMenu({ currentSecondMenu: e[e.length - 1] });
  }
  queryCode = (arr, code) => {
    let val = '';
    arr.map((item) => {
      if (item.node.resCode === code) {
        val = code;
      }
    });
    return val;
  }

  /**
    * 判断是否为空对象
    * @params obj
    */
  hasMenu = (obj) => {
    let menuType = [1, 2, 3, 4, 5];
    for (const name in obj) {
      if(obj[name]['node'] && obj[name]['node']['resType'] && $.inArray(obj[name]['node']['resType'], menuType) != -1) {
        return true;
      }
    }
    return false; 
  }
  /**
  * 渲染二级侧边栏
  */
  renderSubMenu = () => {
    const subMenu = this.props.slide;
    const content = [];
    const sLevel = [];
    if (subMenu) {
      const childMap = subMenu;
      for (const item in childMap) {
        if (childMap[item].node && childMap[item].node.resType <= 3 && childMap[item].node.resParentCode) {
          sLevel.push(childMap[item]);
        }
      }
      
      sLevel.map((item) => {
        const child = item.childMap;
        // const img = this.props.currentSubMenu === item.node.resCode
        //   ? item.node.resAttr2 : item.node.resAttr1;
        content.push(
          !this.isEmptyObject(child) && this.hasMenu(child) ? <SubMenu key={item.node.pageUrl} code={item.node.resCode} title={<span><span className="i-icon" dangerouslySetInnerHTML={{ __html: item.node.resAttr1 }} /><span className="sub-name">{item.node.resName}</span></span>}>
            {this.renderLowerMenu(child)}
          </SubMenu> : <MenuItem key={item.node.pageUrl} code={item.node.resCode}>
              <Link to={item.node.pageUrl} id={item.node.pageUrl.substr(1).split('/').join('-')}>
                <div className="i-icon" dangerouslySetInnerHTML={{ __html: item.node.resAttr1 }} />
                <div className="sub-name">{item.node.resName}</div>
              </Link>
            </MenuItem>,
        );
      });
    }
    return content;
  }

  /**
  * 渲染三级菜单
  * param child 三级菜单数据
  */
  renderLowerMenu = (child) => {
    const subMenuArr = [];
    const content = [];
    const channelOrders = this.props.channelOrderStatistics;
    const localOrders = this.props.localOrderStatistics;
    let channelTotal = 0;
    let localTotal = 0;
    if (child) {
      const childMap = child;
      for (const item in childMap) {
        if (childMap[item].node && childMap[item].node.resType <= 11) {
          subMenuArr.push(childMap[item]);
        }
        // subMenuArr.push(childMap[item]);
      }
      channelTotal = channelOrders && this.handleTotal(channelOrders);
      localTotal = localOrders && this.handleTotal(localOrders);
      const newOrder = channelOrders && localOrders ? Object.assign({}, channelOrders, localOrders) : {};
      subMenuArr.map((item) => {
        let count = '';
        count = (newOrder && this.handleOrders(newOrder, item.node.resCode)) || '(0)';
        if (item.node.pageUrl === '/lv/orders/local/all') {
          count = localTotal;
        }
        if (item.node.pageUrl === '/lv/orders/channel/all') {
          count = channelTotal;
        }
        // 限制其他的页面加本地订单数量
        if (browserHistory.getCurrentLocation().hash.indexOf('lv/orders') === -1) {
          count = '';
        }
        content.push(
          <MenuItem key={item.node.pageUrl} code={item.node.resCode}>
            <Link to={item.node.pageUrl} id={item.node.pageUrl.substr(1).split('/').join('-')}>
              <div className="i-icon third"></div>
              <div className="sub-name">{item.node.resName}{(item.node.pageUrl === '/lv/orders/local/all' || item.node.pageUrl === '/lv/orders/channel/all') ? '' : count}</div>
            </Link>
          </MenuItem>,
        );
      });
    }
    return content;
  }
  /**
  * 处理各订单数
  */
  handleOrders = (total, val) => {
    if (val in total) {
      const num = total[val];
      return num > 99 ? '（99+）' : `（${total[val]}）`;
    }
    return '';
  }

  /**
  * 处理总数
  */
  handleTotal = (orders) => {
    let total = 0;
    for (const item in orders) {
      total += Number(orders[item]);
    }
    return total > 99 ? '（99+）' :  `（${total}）`;
  }

  /**
  * 获取展开的列表key
  */
  GetSubMenuKey = () => {
    const subMenu = this.props.slide;
    const content = [];
    if (subMenu) {
      const childMap = subMenu;
      for (const item in childMap) {
        if (childMap[item].node && childMap[item].node.resType <= 3) {
          content.push(childMap[item].node.pageUrl);
        }
      }
    }
    return content;
  }

  render() {
    return (
      <div className="nav">
        <Menu
          mode="inline"
          theme="dark"
          onClick={this.selectMenu}
          selectedKeys={[this.props.currentSubMenu]}
          onOpenChange={this.clickMenu}
          // openKeys={[this.props.currentSecondMenu]}
          openKeys={this.GetSubMenuKey()}
          style={{marginTop: '8px'}}
        >
          { this.renderSubMenu() }
        </Menu>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const routing = state.get('routing') && state.get('routing').toJS() || {};
  const sliderBar = state.get('sliderBar') && state.get('sliderBar').toJS() || {};
  // const slide = sliderBar.sliderBarMsg;
  const app = state.get('app') && state.get('app').toJS() || {};
  const { currentSubMenu, currentMenu, currentSecondMenu, currentMenuCode, channelOrderStatistics, localOrderStatistics } = sliderBar;
  return {
    routing,
    slide: app.sliderPrivilege,
    currentSubMenu,
    currentMenu,
    currentSecondMenu,
    currentMenuCode,
    localOrderStatistics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentSubMenu(params) {
      dispatch(setCurrentSubMenu(params));
    },
    setCurrentSecondMenu(params) {
      dispatch(setCurrentSecondMenu(params));
    },
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SliderBar);
