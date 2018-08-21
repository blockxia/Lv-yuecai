import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Button, Row, Col, Form, Select, Popover } from 'antd';
import Modal from "components/Common/Modal";
import Loading from "components/Common/Loading";
import Table from "components/Common/Table";
import message from "components/Common/message";
import { formatMoney } from '../../../../utils/tools';
import * as DATE from '../../../../utils/date.js';
import './style.scss';
// import { start } from 'repl';

const FormItem = Form.Item;
const Option = Select.Option;
class AfterSalesDialog extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      optFlag: '',
      rejectConfirm: false
    }
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  rejectHandle = () => {
    this.setState({ optFlag: 1, rejectConfirm: true });
  }
  okHandle = () => {
    this.setState({ optFlag: 2, rejectConfirm: true });
  }
  rejectCancel = () => {
    this.setState({ rejectConfirm: false });
  }
  confirmHandle = () => {
    let optFlag = this.state.optFlag;
    if (optFlag == 1) {
      //驳回
      this.props.rejectHandle();
    } else if (optFlag == 2) {
      //通过
      this.props.okHandle();
    }
  }
  
  render() {
    let orderDetails = this.props.orderDetails;
    function getProductInfo() {

    }
    return (
      <div>
        <Modal
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          width={600}
          title={this.props.title}
          wrapClassName='common-modal after-sales-dialog'
          footer={<Button key='cancel' onClick={this.props.onCancel}>关闭</Button>}
        >
          {this.props.loading ? <Loading /> :
            <div className='after-sales-container'>
              <div className="after-sales-status">
                <div className="label">
                  <i className='i-icon'>&#xe690;</i>
                </div>
                <div className="value ml10">
                  {orderDetails && (orderDetails.saleType == 1 ? '退款' : '退款退货')}
                </div>
              </div>
              <div className="after-sales-details">
                <div className="detail-Item">
                  <div className="label">
                    商品信息：
                  </div>
                  <div className="value">
                    {orderDetails && orderDetails.productName}
                  </div>
                </div>
                {orderDetails && orderDetails.saleType == 1 && <div className="detail-Item">
                  <div className="label">
                    退款金额：
                  </div>
                  <div className="value">
                    {orderDetails && '¥ ' + formatMoney(orderDetails.returnAmount)}
                  </div>
                </div>}
                {orderDetails && orderDetails.saleType == 2 && <div className="detail-Item">
                  <div className="label">
                    数量：
                  </div>
                  <div className="value">
                    {orderDetails && orderDetails.returnNum}
                  </div>
                </div>}
                {orderDetails && orderDetails.saleType == 2 && <div className="detail-Item">
                  <div className="label">
                    销售价：
                  </div>
                  <div className="value">
                    {orderDetails && '¥ ' + formatMoney(orderDetails.salePrice)}
                  </div>
                </div>}
                {orderDetails && orderDetails.saleType == 2 && <div className="detail-Item">
                  <div className="label">
                    退款金额：
                  </div>
                  <div className="value">
                    {orderDetails && '¥ ' + formatMoney(orderDetails.returnAmount)}
                  </div>
                </div>}
                <div className="detail-Item">
                  <div className="label">
                    原因说明：
                  </div>
                  <div className="value">
                    {orderDetails && orderDetails.returnCause}
                  </div>
                </div>
              </div>
              <div className="footer">

              </div>
            </div>
          }
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // const materielList = state.get("materiel").get('materielList');
  return {
    // materielList
  }
}

function mapDispatchToProps(dispatch) {
  // return bindActionCreators(comment, dispatch);
  return {
    // getMaterialList: bindActionCreators(getMaterialList, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AfterSalesDialog));
