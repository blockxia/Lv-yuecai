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
import Loading from 'components/Common/Loading';
import { formatNumberNormal2 } from 'utils/tools.js';
import storage from 'utils/storage';
import './style.scss';

const url_prefix = Config.env[Config.scheme].prefix;
const Option = Select.Option;

let STATE_CONTENT = {};
const MONEY_MAX = 99999999.99;
const MONEY_MIN = 1;

class PaymentDialog extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.oldPriceList = [];
    this.state = {
      buttonLoading: false,
      payPricePre: '',
      payPrice: null,
      payType: null,
      confirmVisible: false,
      confirmParams: {},
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
    let payComment = $('#payComment').val(),
      payPrice = $('#payPrice').val(),
      moneyExp = /^(0|[1-9][0-9]{0,7})+\.?\d{0,2}$/,
      result = this.props.orderPurchaseResult,
      bankAccountResult = this.props.bankAccountResult;

    if (this.state.payType == null) {
      message.warn('请选择支付方式');
      callBack && callBack();
      return;
    }
    if (!payComment) {
      message.warn('请输入付款备注');
      callBack && callBack();
      return;
    }
    if (!payPrice) {
      message.warn('请输入付款金额');
      callBack && callBack();
      return;
    }
    if (!moneyExp.test(payPrice)) {
      message.warn('请输入正确的付款金额');
      callBack && callBack();
      return;
    }
    let params = {
      orderId: result && result.id,
      orderNumber: result && result.orderNumber,
      payPrice: (Number(payPrice) * 10000).toFixed(0),
      payType: this.state.payType,
      accountId: storage && storage.get('userId'),
      payComment: payComment,
      accountName: bankAccountResult && bankAccountResult.accountName,
      bankName: bankAccountResult && bankAccountResult.bankName,
      bankCard: bankAccountResult && bankAccountResult.bankCard,
    }
    callBack && callBack();
    this.setState({
      confirmVisible: true,
      confirmParams: params,
    })
    // const promise = this.props.cancelOrder(params);
    // promise.then((data) => {
    //   callBack && callBack();
    //   if (data.data.success) {
    //     message.success('取消订单成功');
    //     this.onCancel();
    //     this.props.callBackFunc && this.props.callBackFunc({ orderId: this.props.orderId });
    //   } else {
    //     message.warn('取消订单失败');
    //   }
    // })
  }
  showHandler = () => {
    this.setState({ visible: true }, () => {
      this.props.fetchPayType({
        typeCodes: 'payModel',
      })
    });
  }
  onCancel = () => {
    this.setState({
      visible: false,
      payPricePre: '',
      payPrice: null,
      payType: null,
      confirmVisible: false,
      confirmParams: {},
    });
  }
  payTypeChange = (e) => {
    this.setState({ payType: e });
  }
  priceKeyUp = (e) => {
    let moneyExp = /^(0|[1-9][0-9]{0,7})+\.?\d{0,2}$/,
      currentTarget = e.srcElement || e.target,
      moneyValue = currentTarget.value,
      moneyId = currentTarget.id;

    if (moneyValue !== '' && !moneyExp.test(moneyValue) || parseInt(moneyValue) < MONEY_MIN || parseInt(moneyValue) > MONEY_MAX) {
      currentTarget.value = this.state.payPricePre;

    } else {
      this.setState({ payPricePre: moneyValue });

    }
  }
  moneyKeyBlur(e) {
    let moneyExp = /^(0|[1-9][0-9]{0,8})+\.?\d{0,2}$/,
      currentTarget = e.srcElement || e.target,
      moneyValue = currentTarget.value,
      moneyId = currentTarget.id;
    if (moneyValue !== '' && moneyExp.test(moneyValue) || parseInt(moneyValue) < MONEY_MIN || parseInt(moneyValue) > MONEY_MAX) {
      this.setState({ payPrice: formatNumberNormal2(moneyValue) });
    }
  }
  changePayPrice = (e) => {
    this.setState({ payPrice: e.target.value });
  }
  renderContent = () => {
    let pamentList = this.props.pamentList,
      bankAccountResult = this.props.bankAccountResult,
      result = this.props.orderPurchaseResult;
    let total = 0; 
    if (result && result.saleTotalPrice && result.freightCharge) {
      total = (Number(result.saleTotalPrice) + Number(result.freightCharge) / 10000).toFixed(2);
    } else {
      total = (Number(result && result.saleTotalPrice) / 10000).toFixed(2);
    }
    return(<div>
      <div className="pament-top">
        <div>
          <span>付款金额：</span>
          <Select
            style={{ width: 120 }}
            onChange={this.payTypeChange}
            placeholder="请选择支付方式"
          >
            {pamentList && pamentList.map((item, i) => {
              return (<Option key={item.weight} value={item.weight && item.weight.toString()}>{item.name}</Option>)
            })}
          </Select>
          {this.state.payType ? <Input
            type="text"
            style={{width: 140, marginLeft: '10px'}}
            onKeyUp={this.priceKeyUp.bind(this)}
            onBlur={this.moneyKeyBlur.bind(this)}
            value={this.state.payType == 1 ? total : this.state.payPrice}
            id="payPrice"
            disabled={this.state.payType == 1 ? true : false}
            placeholder="请输入付款金额"
            onChange={this.changePayPrice}
          /> : null }
        </div>
        <div className="mt10 mb10">
          <span>付款备注：</span>
          <Input type="text" id="payComment" style={{width: 300}} placeholder="已经通过招商银行转账，转账日起12.23。请查收。" maxLength="50" />
        </div>
        <div className="ft-red">
          注意：请确认已经将货款支付到平台指定的默认账户。
        </div>
        <div className="mt40">
          平台账户信息
        </div>
        <div className="mt10">
          <span>账户名称：</span>
          <span>{bankAccountResult && bankAccountResult.accountName}</span>
        </div>
        <div className="mt10">
          <span>开户银行：</span>
          <span>{bankAccountResult && bankAccountResult.bankName}</span>
        </div>
        <div className="mt10">
          <span>银行账户：</span>
          <span>{bankAccountResult && bankAccountResult.bankCard}</span>
        </div>
      </div>
    </div>)
  }
  confirmCancel = () => {
    this.setState({ confirmVisible: false })
  }
  confirmOk = (callBack) => {
    
    let params = this.state.confirmParams;
    const promise = this.props.confirmAddPay(params);
    promise.then((data) => {
      callBack && callBack();
      if (data.data.success) {
        message.success('付款成功');
        this.confirmCancel();
        this.onCancel();
        this.props.callBackFunc && this.props.callBackFunc({ orderId: this.props.orderId });
      } else {
        message.warn('付款失败');
      }
    })
  }
  render() {
    const { children } = this.props;
    return (
      <div className="allorder-detail-payment">
        <span onClick={this.showHandler}>{children}</span>
        <DialogTips
          visible={this.state.visible}
          content={<div className="allorder-detail-payment-content">{this.renderContent()}</div>}
          onCancel={this.onCancel}
          onOk={this.onOk}
          title="确认付款"
          wrapClassName="allorder-detail-payment-modal"
          width={650}
        />
        {/* 二次确认 */}
        <DialogTips
          visible={this.state.confirmVisible}
          content={<div className="allorder-detail-payment-content">你确认已经将此款项支付给平台了吗？确认后将无法恢复。</div>}
          onCancel={this.confirmCancel}
          onOk={this.confirmOk}
          title="确认付款"
          wrapClassName="allorder-detail-payment-modal"
        />
        <Loading display={this.props.paymentLoading ? 'block' : 'none'} />
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
)(PaymentDialog);
