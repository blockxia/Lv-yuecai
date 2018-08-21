/**
 * @authors wangqinqin
 * @date    2017-08-10
 * @module  底部导航
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import './style.scss';

const ENV = process.env.NODE_ENV;

// 图片的路径
const imgPath = ENV === 'dev' ? '/static/images/' : 'http://lvyue-static-test.oss-cn-beijing.aliyuncs.com/pms/zh/static/images/';

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  /**
  * 创建底部导航
  */
  renderFooter = () => {
    const content = [];
    const footer = this.props.footer;
    const childMap = footer.childMap;
    const fLevel = [];
    for (const item in childMap) {
      const node = childMap[item].node;
      if (node && node.resType === 12) {
        fLevel.push(childMap[item]);
      }
    }
    fLevel.map((item) => {
      content.push(
        <li className="button-ground" key={item.node.resCode}>
          <div className="button-ground-item pos-relative">
            <img src={imgPath + item.node.resAttr1} alt="" />
          </div>
        </li>,
      );
    });
    return content;
  }

  getTitleByType(type){
    let title = '';
    if(type === 'tH2xc5OFHd7q79J5K35qwBUM'){
      title = intl.get('lv.rooms.footer.orderState.waitHandle');
    }else if(type === 'tH2xc5OFuxTZfbLA4z23CXgD'){
      title = intl.get('lv.rooms.footer.orderState.unallocated');
    }else if(type === 'tH2xc5OFuxTZfbLAHWZmOgWj'){
      title = intl.get('lv.rooms.footer.orderState.arrive.today');
    }else if(type === 'tH2xc5OFuxTZfbLAxGjDjejO'){
      title = intl.get('lv.rooms.footer.orderState.leave.today');
    }else if(type === 'tH2xc5OFuxTZfbLAjdsMRCmC'){
      title = intl.get('lv.rooms.footer.orderState.here.today');
    }
    return title;
  }

  getButtonGroup(){
    let buttonGroup = new Array('tH2xc5OFHd7q79J5K35qwBUM', 'tH2xc5OFuxTZfbLA4z23CXgD', 'tH2xc5OFuxTZfbLAHWZmOgWj', 'tH2xc5OFuxTZfbLAxGjDjejO', 'tH2xc5OFuxTZfbLAjdsMRCmC');
    return buttonGroup.map((item, i) => {
      let clickParams = {
        type: item,
        title: this.getTitleByType(item),
        count: this.props.orderStatistics[item],
      };
      return (
        <li key={i}>
          <div className="button-ground-item" onClick={this.props.orderStateClick.bind(this, clickParams)}>{clickParams.title}<i className="i-icon-s">{this.props.orderStatistics[item]}</i></div>
        </li>
      );
    }, this);
  }

  getSmartLock() {
    if(this.props.roomsPrivilege.smartLock){
      return (
        <li className="button-ground" onClick={this.props.smartLock.bind(this)}>
          <div className="button-ground-item pos-relative">
            <i className="i-icon">&#xe62d;</i>
          </div>
        </li>
      );
    }else{
      return null;
    }
  }

  render() {
    let msgFlag = null,
      noticeCount = null,
      blackboardFlag = null;
    if(this.props.remindStatistics) {
      let remindEventCount = this.props.remindStatistics.remindEventCount,
        orderMsgCount = this.props.remindStatistics.orderMsgCount,
        hotelMsgCount = this.props.remindStatistics.hotelMsgCount,
        totalCount = remindEventCount + orderMsgCount + hotelMsgCount;

      if(totalCount && totalCount > 0){
        msgFlag = <i className="circle-red" />;
      }
    }

    if(this.props.frontUnremindCount > 0){
      noticeCount = <span className="notice-count">{this.props.frontUnremindCount}</span>;
    }

    if(this.props.blackboardContent && this.props.blackboardContent.content !== '' && $.trim(this.props.blackboardContent.content) !== ''){
      blackboardFlag = <i className="circle-red" />;
    }

    return (
      <div className="footer">
        <div className="fn-left">
          <ul className="button-group">
            {this.getButtonGroup()}
          </ul>
        </div>
        <div className="fn-right mr25">
          <ul className="footer-tips-main">
            {this.renderFooter()}
            {this.getSmartLock()}
            <li className="button-ground" onClick={this.props.blackboard.bind(this)}>
              <div className="button-ground-item pos-relative">
                {blackboardFlag}
                <i className="i-icon">&#xe634;</i>
              </div>
            </li>
            <li className="button-ground" onClick={this.props.frontRemindClick.bind(this)}>
              <div className="button-ground-item pos-relative">
                {noticeCount}
                <i className="i-icon">&#xe62c;</i>
              </div>
            </li>
            <li className="button-ground legend" >
              <div className="button-ground-item pos-relative">
                <i className="i-icon">&#xe631;</i>
              </div>
              <div className="legend-group theme-default">
                <div className="legend-triangle"><i></i></div>
                <div className="legend-item"><i className="i-icon fill-icon union-room"><i></i></i>{intl.get('lv.rooms.footer.display.union-room')}</div>
                <div className="legend-item"><i className="i-icon fill-icon check-in-icon"><i></i></i>{intl.get('lv.rooms.footer.display.check-in-icon')}</div>
                <div className="legend-item"><i className="i-icon fill-icon not-arrived-icon"><i></i></i>{intl.get('lv.rooms.footer.display.not-arrived-icon')}</div>
                <div className="legend-item"><i className="i-icon fill-icon checked-out-icon"><i></i></i>{intl.get('lv.rooms.footer.display.checked-out-icon')}</div>
                <div className="legend-item"><i className="i-icon custom-icon lock-state1"><i>&#xe61f;</i></i>{intl.get('lv.rooms.footer.display.lock-state1')}</div>
                <div className="legend-item"><i className="i-icon custom-icon lock-state2"><i>&#xe61f;</i></i><i className="i-icon lock-state-icon">&#xe63d;</i><span>{intl.get('lv.rooms.footer.display.lock-state2')}</span></div>
                <div className="legend-item"><i className="i-icon custom-icon lock-state3"><i>&#xe61f;</i></i><i className="i-icon lock-state-icon">&#xe648;</i><span>{intl.get('lv.rooms.footer.display.lock-state3')}</span></div>
                <div className="legend-item"><i className="i-icon custom-icon lock-state4"><i>&#xe61f;</i></i><i className="i-icon lock-state-icon">&#xe649;</i><span>{intl.get('lv.rooms.footer.display.lock-state4')}</span></div>
                <div className="legend-item"><i className="i-icon custom-icon price-difference"><i>&#xe643;</i></i>{intl.get('lv.rooms.footer.display.price-difference')}</div>
                <div className="legend-item"><i className="i-icon custom-icon pay-type"><i>&#xe64b;</i></i>{intl.get('lv.rooms.footer.display.pay-type1')}</div>
                <div className="legend-item"><i className="i-icon custom-icon pay-type"><i>&#xe64c;</i></i>{intl.get('lv.rooms.footer.display.pay-type2')}</div>
                <div className="legend-item"><i className="i-icon custom-icon pay-type"><i>&#xe64a;</i></i>{intl.get('lv.rooms.footer.display.pay-type3')}</div>
              </div>
            </li>
            <li className="button-ground noticePanelBtn" onClick={this.props.showNoticePanel.bind(this)}>
              <div className="button-ground-item pos-relative">
                {msgFlag}
                <i className="i-icon">&#xe62e;</i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const footer = state.get('header').toJS();
  return {
    footer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);
