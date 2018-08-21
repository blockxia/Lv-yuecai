import React, { Component } from 'react';
import { connect } from 'react-redux';
import BaseComponent from 'components/Public/BaseComponent';
import { bindActionCreators } from 'redux';
import { Table, Select, Button, Icon, Radio, Form, Input, InputNumber, Modal } from 'antd';
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
    _this.props.form.validateFields((err, values) => {
      if (!err) {
        let { freightCharge } = values;
        let params = {
          freightCharge,
          opreateName: storage.get('userName')
        }
        if (_this.props.orderData) {
          params.orderId = _this.props.orderData.id;
        }
        _this.props.handleSubmit(params);
      } else {
        cancelLoading && cancelLoading();
      }
    })
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
        title='运费调整'
        visible={this.props.editCarriage}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
        wrapClassName='order-edit'
        width='300px'
      >
        <Form onSubmit={this.handleSubmit} className="order-edit">
          <FormItem
            {...formItemLayout}
            label='运费'
          >
            {getFieldDecorator('freightCharge', {
              rules: [{
                required: true,
                message: "请输入数量"
              }],
              initialValue: orderData && orderData.freightCharge
            })(
              <InputNumber
                min={0}
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')} />
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
