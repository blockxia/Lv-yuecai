/**
 * @authors wangqinqin
 * @date    2018-08-15
 * @module  订单详情-确认收货
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import Config from 'config';
import { Form, Modal, Button, Input, Select, Table, Popover, Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BaseComponent from 'components/Public/BaseComponent';
import message from 'components/Common/message';
import DialogTips from 'components/Common/DialogTips';
import './style.scss';

const url_prefix = Config.env[Config.scheme].prefix;

class ConfirmReceived extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.oldPriceList = [];
    this.state = {
      buttonLoading: false,
    };
  }
  /**
  * 首页实例化
  */
  componentDidMount() {
  }

  componentWillUnMount() {
  }

  onOk = (callBack) => {
    let params = {};
    let orderDetails = this.props.orderDetails,
      productionResult = orderDetails && orderDetails.orderCommodityPurchaserResults;
    
    let waitGoods = productionResult && productionResult.filter((item) => {
      return item.status && (Number(item.status) === 4);
    });
    let filterWaitGoods = waitGoods && waitGoods.reduce((prev, cur) => {
      return prev += (cur.id) + ',';
    }, '');
    filterWaitGoods  = filterWaitGoods && filterWaitGoods.substr(0, filterWaitGoods.length - 1);

    if (this.props.id) {
      params = {
        sonOrderIds: this.props.id,
      }
    } else {
      params = {
        sonOrderIds: filterWaitGoods,
      }
    }
    
    const promise = this.props.confirmReceived(params);
    promise.then((data) => {
      callBack && callBack();
      if (data.data.success) {
        message.success('收货成功');
        this.onCancel();
        this.props.callBackFunc && this.props.callBackFunc({ orderId: this.props.orderId });
      } else {
        message.warn('收货失败');
      }
    })
  }
  showHandler = () => {
    this.setState({ visible: true });
  }
  onCancel = () => {
    this.setState({ visible: false });
  }
  renderContent = () => {
    if (this.props.id) {
      let record = this.props.record;
      return (<span>
        <p>你要确认收货吗？确认后将无法恢复。</p>
        <p>请确认已经收到以下货物：</p>
        <div>{record.commodityName}</div>
      </span>)
    } else {
      let orderDetails = this.props.orderDetails,
        productionResult = orderDetails && orderDetails.orderCommodityPurchaserResults;
      let waitGoods = productionResult && productionResult.filter((item) => {
        return item.status && (Number(item.status) === 4);
      });

      return (<span>
        <p>你要确认收货吗？确认后将无法恢复。</p>
        <p>请确认已经收到以下货物：</p>
        <ul>
          {waitGoods && waitGoods.map((item, i) => {
            return (<li key={i}>{item.commodityName}</li>)
          })}
        </ul>
      </span>)
    }
    
  }
  render() {
    const { children } = this.props;
    return (
      <div className="allorder-detail-cancel">
        <span onClick={this.showHandler}>{children}</span>
        <DialogTips
          visible={this.state.visible}
          content={<div className="allorder-detail-received-content">{this.renderContent()}</div>}
          onCancel={this.onCancel}
          onOk={this.onOk}
          title="确认收货"
          wrapClassName="allorder-detail-received-modal"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmReceived);
