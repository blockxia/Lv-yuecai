/**
 * @authors wangqinqin
 * @date    2018-08-15
 * @module  取消订单
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

class CancelOrders extends BaseComponent {
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
    const record = this.props.record;
    const params = {
      orderId: this.props.orderId,
      purchaserId: this.props.purchaserId,
      cancelComment: $('#cancelComment').val(),
    }
    if (!params.cancelComment) {
      message.warn('请输入订单取消原因');
      callBack && callBack();
      return;
    }
    const promise = this.props.cancelOrder(params);
    promise.then((data) => {
      callBack && callBack();
      if (data.data.success) {
        message.success('取消订单成功');
        this.onCancel();
        this.props.callBackFunc && this.props.callBackFunc({ orderId: this.props.orderId });
      } else {
        message.warn('取消订单失败');
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
    return (<span>
      <p>你确定要取消此订单吗？ 订单取消后将无法恢复。</p>
      <p>如果取消，请说明订单取消原因</p>
      <Input type="text" placeholder="请输入订单取消原因" style={{ width: '300px', marginTop: '10px' }} id="cancelComment" maxLength="50" />
    </span>)
  }
  render() {
    const { children } = this.props;
    return (
      <div className="allorder-detail-cancel">
        <span onClick={this.showHandler}>{children}</span>
        <DialogTips
          visible={this.state.visible}
          content={<div className="allorder-detail-cancel-content">{this.renderContent()}</div>}
          onCancel={this.onCancel}
          onOk={this.onOk}
          title="取消订单"
          wrapClassName="allorder-detail-cancel-modal"
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
)(CancelOrders);
