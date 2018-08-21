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

const { TextArea } = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class CancelOrder extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
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
        let { cancelComment } = values;
        let params = {
          cancelComment,
          opreateName: storage.get('userName')
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
        title='取消订单'
        visible={this.props.cancelOrder}
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
        wrapClassName='order-cancel'
        width='300px'
      >
        <div>
          你确定要取消该订单吗？
  如果取消，请说明订单取消原因(必填)：
        </div>
        <Form onSubmit={this.handleSubmit} className="order-cancel">
          <FormItem
            {...formItemLayout}
            label=''
          >
            {getFieldDecorator('cancelComment', {
              rules: [{
                required: true,
                message: "请输入取消原因"
              }]
            })(
              <TextArea placeholder="请输入取消原因" rows={4} />
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


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CancelOrder));
