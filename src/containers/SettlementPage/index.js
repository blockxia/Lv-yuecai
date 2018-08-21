/**
 * @authors wangchen
 * @date    2018-08-13
 * @module  结算页面
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, DatePicker, Select, Form, Input, Radio, Popover,  Col, InputNumber ,Icon} from 'antd';
import Table from "components/Common/Table";
import message from "components/Common/message";
import * as Actions from '../../actions/SettlementPage/settlementPage';
import Loading from 'components/Common/Loading';
import Modal from 'components/Common/Modal';
import moment from 'moment';

import './style.scss';
import { formatMoney } from '../../utils/tools';
import { getDate } from '../../utils/date';
import { Record } from 'immutable';
import EditOrder from '../Order/Details/Dialog/EditOrder';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const INFORMATION = {1:'普通发票',2:'增值税发票'};
class SettlementPage extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      priceAll: null,  
      addressArr: [],
      addressIcon: false,  
      information: null,
    }
  }

  componentDidMount() {
    this.getOrderDetails();
  }
  getOrderDetails = () => {
    let params = this.props.params;
    console.log(params.skuIds.split(",").length)
    if(params.skuIds.split("").length == 1){
        params.buyFrom = 2;
    }else if (params.skuIds.split("").length > 1){
      params.buyFrom = 1;
    }
    this.props.fetchList(params);
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.details && JSON.stringify(nextprops.details) != '{}' && !this.state.addressIcon) {
      this.setAddressArr(nextprops.details);
    }
  }
  supplierChange = (orderIndex, supplierId) => {
    let orderCommodityPlatformResult = this.state.orderData.orderCommodityPlatformResult;
    let cOrder = orderCommodityPlatformResult[orderIndex];
    let cSupplier = cOrder.skuSupplierResultList.filter(order => {
      return order.id == supplierId
    })[0];
    cOrder.costPrice = cSupplier.buyPrice;
    this.setState({ orderData: JSON.parse(JSON.stringify(this.state.orderData)) })
  }
  editOrder = (e, currentOrder) => {
    e.preventDefault();
    this.setState({ currentOrder: currentOrder, editOrder: true });
  }
  onCancel = () => {
    this.setState({ editOrder: false });
  }

  setAddressArr = (details) => {
    let purchaserDeliveryResult = details && details.purchaserDeliveryResult || [];
    let invoiceInformationResultList = details && details.invoiceInformationResultList || [];
    if(purchaserDeliveryResult.length>3){
      let addressArr = [purchaserDeliveryResult[0],purchaserDeliveryResult[1],purchaserDeliveryResult[2]]
      this.setState({
        addressArr:addressArr
      })
    }else{
      this.setState({
        addressArr:purchaserDeliveryResult
      })
    }
    if(invoiceInformationResultList.length > 0 && !this.state.information){
      this.setState({
        information: invoiceInformationResultList[0]
      })
    }
  }


  //商品信息
  initTable = () => {
    let rowArray = [];
    let rowEle = null;
    let priceAll = null;
    let orderList = this.props.details && this.props.details.balanceVo;
    orderList && orderList.map((order, index) => {
      rowEle = <tr key={order.skuId} className="tr-content">
        <td>
          <div className="img-content">
            <img src="http://test.static.lvyuetravel.com/lvyue/pimp/image/purchaser/2018-08-13/479b5aedf3ab488ce261b5d82e800dbb.png"/>
            <div>
              <div className="commodityName">{order.commodityName}</div>
              <div className="commodityAttributes">{order.commodityAttributes}</div>
            </div>
          </div>
        </td>
        <td className="price-name">￥{formatMoney(order.price)}</td>
        <td className="price-name">{order.commodityNumber}</td>
        <td className="price-name"><span>￥{formatMoney(order.commodityNumber*order.price)}</span></td>
      </tr>
      priceAll = priceAll + order.commodityNumber*order.price;
      rowArray.push(rowEle);
    })
    return rowArray;
  }


  getPriceAll = () => {
    let priceAll = null;
    if(this.props.details){
      let orderList = this.props.details && this.props.details.balanceVo;
      for(let i in orderList){
        priceAll = priceAll + orderList[i].commodityNumber*orderList[i].price;
      }
    }
      return priceAll;
  }


  //采购门店
  getPurchaserDelivery = (getFieldDecorator,{...formItemLayout}) => {
    let purchaserDeliveryResult = this.props.details && this.props.details.purchaserDeliveryResult || [];
    let purchase = null;
    if(purchaserDeliveryResult.length == 0){
      purchase = <div className="btn-content">
                    <a className="btns"><i style={{marginRight: '10px'}} className="i-icon">&#xe699;</i>{'新增收货地址'}</a>
                </div>
    } else {
      let radio = this.state.addressArr.map((elem,index) => {
        return (
          <Radio value={elem.id} key={index+"radio"} className="purchase-radio"><div className="radio-message"><span>{elem.deliveryUser}</span><span>{elem.deliveryAddress}</span><span>{elem.telphone}</span></div></Radio>
        )
      })
      purchase =  
      <div>
          <FormItem {...formItemLayout}>
            {
              getFieldDecorator('purchaserDeliveryId', {
                initialValue: '',
                rules: [ {
                  required: true, message: '请您选择收货地址!',
                }]
              },
            )(
              <RadioGroup>
                  {radio}
              </RadioGroup>
              )
            }
          </FormItem>
          {purchaserDeliveryResult.length>3 ? <div className="more-address" onClick={this.getMoreAddress.bind(this)}>{'更多地址'} {this.state.addressIcon ? <Icon type="up" /> : <Icon type="down" />}</div> : ''}
      </div>
    }
      return purchase;
  }

  //获取更多地址
  getMoreAddress = () => {
    let purchaserDeliveryResult = this.props.details && this.props.details.purchaserDeliveryResult || [];
    if(purchaserDeliveryResult.length>3){
      let addressArr = [purchaserDeliveryResult[0],purchaserDeliveryResult[1],purchaserDeliveryResult[2]]
      this.setState({
        addressArr: purchaserDeliveryResult,
        addressIcon: !this.state.addressIcon
      })
      if(this.state.addressIcon){
        this.setState({
          addressArr: addressArr
        })
      }
    }
  }

  //获取支付方式
  getBankAccount = () => {
    let bankAccountResult = this.props.details && this.props.details.bankAccountResult || {};
    let bankAccount = null;
    if(bankAccountResult){
      bankAccount = <div className="bank-account">
        <div>账户名称：<span>{bankAccountResult.accountName}</span></div>
        <div>开户银行：<span>{bankAccountResult.bankName}</span></div>
        <div>银行账户：<span>{bankAccountResult.bankCard}</span></div>
      </div>
    }
    return bankAccount;
  }


  //点击选择发票类型
  setInformation = (elem) => {
    if(elem){
      this.setState({
        information: elem
      })
    }
  }

    //发票信息
    getInvoiceInformation = (getFieldDecorator,{...formItemLayout}) => {
      let invoiceInformationResultList = this.props.details && this.props.details.invoiceInformationResultList || [];
      let purchase = null;
      if(invoiceInformationResultList.length == 0){
        purchase = <div className="btn-content">
                      <a className="btns"><i style={{marginRight: '10px'}} className="i-icon">&#xe699;</i>{'新增发票信息'}</a>
                  </div>
      } else {
        let radio = invoiceInformationResultList.map((elem,index) => {
          return (
            <Radio value={elem.id} key={index+"radio"} onClick={this.setInformation.bind(this,elem)}>{INFORMATION[elem.type]}</Radio>
          )
        })
        purchase =  
        <div style={{marginLeft: 27}}>
            <FormItem {...formItemLayout} >
              {
                getFieldDecorator('invoiceType', {
                  initialValue: invoiceInformationResultList[0].id,
                  rules: [ {
                    required: true, message: '请您选择发票信息!',
                  }]
                },
              )(
                <RadioGroup>
                    {radio}
                </RadioGroup>
                )
              }
            </FormItem>
            {this.state.information ? <div className="information-content">
              <div><span>{'账户名称：'}</span>{this.state.information.companyName}</div>
              <div><span>{'纳税人识别码：'}</span>{this.state.information.taxpayerNumber}</div>
              <div><span>{'发票内容：'}</span>{this.state.information.content}</div>
            </div> : ''}
        </div>
      }
        return purchase;
    }

  //收款确认
  confirmGathering(opay){
    this.setState({
      showConfirm: true,
      opay
    })
  }


  //订单确认
  handleConfirm(){
    this.setState({
      showEnsure: true,
    })
  }

  handleEnsure = (callback) => {
    this.props.form.validateFields((err, val) => {
      if (err && Object.keys(err).length) {
        return;
      }
      let opay = this.state.opay;
      if(opay){
        let param = {};
        param.status = 2;
        param.id = opay.id;
        param.orderId = opay.orderId;
        this.props.fetchConfirmGathering(param, () => {
          callback && callback();
          this.setState({showConfirm: false,showEnsure:false, opay: null});
          this.getOrderDetails();
        }, () => {
          callback && callback();
          message.error('操作失败');
        });
      }
    });
  }

  
  render() {
    let orderData = this.state.orderData;
    const payStatus = {
      1: '待确认',
      2: '已确认',
      3: '已驳回'
    }
    const invoiceType = {
      1: '普通发票',
      2: '专用发票'
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='settlement-content'>
      <Form>
        <div className="order-list">
          <table className='order-table'>
            <thead className="ant-table-thead">
              <tr>
                <th>
                  <span>
                    商品名称
                  </span>
                </th>
                <th>
                  <span>
                    单价
                  </span>
                </th>
                <th>
                  <span>
                    数量
                  </span>
                </th>
                <th>
                  <span>
                    小计
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className='ant-table-tbody'>
              {
                this.initTable()
              }
            </tbody>
          </table>
          <div className="table-footer">
            <div className="remarks">
                  <FormItem label="备注" {...formItemLayout}>
                        {
                          getFieldDecorator('purchaseComment', {
                            initialValue: '',
                          },
                        )(
                            <Input  style={{width:300,height:20}}/>
                          )
                        }
                  </FormItem>
            </div>
            <div className="priceAll">
                {'总价：'}<span>￥{formatMoney(this.getPriceAll())}</span>
            </div>
          </div> 
        </div>

        <div className="order-pannel">
            <div className="content-title">
                {'选择采购门店'}
            </div>
            {this.getPurchaserDelivery(getFieldDecorator,{...formItemLayout})}
            
        </div>
        <div className="order-pannel">
            <div className="content-title">
                {'支付方式'}<span>{'请尽快付款到平台指定的以下账户，并在银行付款时注明相应订单号、采购商名称等信息，以加快平台确认订单和发货。'}</span>
            </div>
            {this.getBankAccount()}
        </div>
        
        <div className="order-pannel">
                <div className="content-title">
                    {'发票信息'}<span>{'请指定贵公司的开票信息，平台确认收款后，会尽快为您开具发票。'}</span>
                </div>
                {this.getInvoiceInformation(getFieldDecorator,{...formItemLayout})}
        </div>
        <div className="order-pannel">
          <div className="order-footer">
            <div className="submit-btn">
                {'提交订单'}
            </div>
            <div className="priceAll">
                {'总价：'}<span>￥{formatMoney(this.getPriceAll())}</span>
            </div>
            <span>{'由于订单总金额未满“¥5000.00”，需要支付部分运费，具体运费金额以和平台沟通为准。'}</span>
          </div>
        </div>
       
        {
          this.state.showEnsure && <Modal
            visible={this.state.showEnsure}
            title="提示"
            onOk={this.handleEnsure.bind(this)}
            onCancel={x => this.setState({showEnsure: false})}
            width={630}
          >
          <p style={{textAlign: 'center'}}>{`你确认已经收到来自采购商的款项了吗？`}</p>
          <p style={{textAlign: 'center'}}>{`收款确认后将无法恢复。 `}</p>

        </Modal>}
        {
          this.state.showReject && <Modal
            visible={this.state.showReject}
            title="提示"
            onOk={this.handleReject.bind(this)}
            onCancel={x => this.setState({showReject: false})}
            width={630}
          >
          <p style={{textAlign: 'center'}}>{`你确认要驳回采购商的收款吗？`}</p>
          <p style={{textAlign: 'center'}}>{`驳回确认后将无法恢复。 `}</p>

        </Modal>}
        <Loading display={this.props.loading ? 'block' : 'none'} />
        </Form>
      </div >
    );
  }
}

function mapStateToProps(state) {
  let received = state.get('settlementPage') && state.get('settlementPage').toJS() || {};
  return {
    ...received
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SettlementPage));
