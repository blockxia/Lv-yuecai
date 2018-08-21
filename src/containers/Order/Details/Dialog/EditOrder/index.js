import React, { Component } from 'react';
import { connect } from 'react-redux';
import BaseComponent from 'components/Public/BaseComponent';
import { bindActionCreators } from 'redux';
import { Table, Select, Button, Icon, Radio, Form, Input, InputNumber,Modal } from 'antd';
// import Modal from 'components/Common/Modal';
import { Link } from 'react-router';
import intl from 'react-intl-universal';
import Loading from 'components/Common/Loading';
import Config from 'config';
import message from 'components/Common/message';

import storage from '../../../../../utils/storage';

import './style.scss';

const url_prefix = Config.env[Config.scheme].prefix;
// 渠道类型
// let CHANNEL_STATUS_OBJ = [];

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class EditOrder extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      orderData: JSON.parse(JSON.stringify(this.props.orderData))
    }
  }

  /**
   * 首次加载实例
   */
  componentDidMount() {
  }
  handleSubmit = (cancelLoading) => {
    const _this = this;
    confirm({
      title: '提示',
      content: '你确定要修改订单信息吗？修改后将无法恢复。',
      onOk() {
        _this.props.form.validateFields((err, values) => {
          if (!err) {
            let { commodityNumber, salePrice, opreateComment } = values;
            let params = {
              commodityNumber,
              salePrice,
              opreateComment,
              opreateName: storage.get('userName')
            }
            if (_this.props.orderData) {
              params.sonOrderId = _this.props.orderData.id;
            }
            _this.props.handleSubmit(params);
          } else {
            cancelLoading && cancelLoading();
          }
        })
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    let orderData = this.state.orderData;
    return (
      <Modal
        title='修改订单'
        visible={this.props.editOrder}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
        wrapClassName='order-edit'
        width='300px'
      >
        <Form onSubmit={this.handleSubmit} className="order-edit">
          <FormItem
            {...formItemLayout}
            label='数量'
          >
            {getFieldDecorator('commodityNumber', {
              rules: [{
                required: true,
                message: "请输入数量"
              }],
              initialValue: orderData && orderData.commodityNumber
            })(
              <InputNumber
                min={0}
                // max={99.9}
                precision={0} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='销售价'>
            {getFieldDecorator('salePrice', {
              rules: [{
                required: true,
                message: '请输入销售价'
              }],
              initialValue: orderData && orderData.salePrice
            })(
              <InputNumber
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('opreateComment', {
              initialValue: orderData && orderData.opreateComment
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    // ...state.department,
  };
}

function mapDispatchToProps(dispatch) {
  // return bindActionCreators(department, dispatch);
  return {}
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditOrder));
