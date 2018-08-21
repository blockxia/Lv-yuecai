/**
 * @authors litengfei
 * @date    2017-11-23
 * @module  创建角色
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intl from 'react-intl-universal';

import {distributionPower, upDateCurrentRole,fetchAllRoles} from '../../../../../actions/Settings/account';
import { ROLES } from '../../../../../constants/actionApi.js';

import { Modal, Form, Input, Icon, Row, Col, Checkbox, Button, Spin } from 'antd';
import message from 'components/Common/message';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const CheckboxGroup = Checkbox.Group;

import axios from 'api/axios';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

import './style.scss';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

class CreateRole extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      loading:false
    }
  }


  // 关闭创建角色弹框
  cancelModalRole() {
    let form = this.props.form;
    form.resetFields();
    this.setState({
      loading:false
    });
    this.props.onCancel && this.props.onCancel();
  }


  // 返回创建角色弹框
  goBack() {
    let form = this.props.form;
    form.resetFields();
    this.props.onCancel && this.props.onCancel();
  }


  // 检查角色是否可用-是否被添加过
  handleBlurRoleName(e) {
    let form = this.props.form;
    if (form.getFieldValue('username')) {
      this.checkRoleCanUse();
    }
  }


  // 检查角色方法-FUNCTION
  checkRoleCanUse() {
    let form = this.props.form
    axios.get(`${admin_prefix}${ROLES['get_by_name']}`, {
      params: {
        name: form.getFieldValue('username')
      }
    }).then(function(res) {
      if (res.data.success) {
        if (res.data.data) {
          // 不可以使用
          form.setFields({
            username: {
              value: form.getFieldValue('username'),
              errors: [new Error(intl.get('lv.settings.account.role.checkRole.error'))]
            }
          })
        }
      }
    })
  }


  // 提交添加角色-进行-下一步分配权限
  handleSubmit(e) {
    e.preventDefault();
    let _this = this;
    let form = this.props.form;
    if(form.getFieldError('username')){
      return false;
    }
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading:true });
        axios.get(`${admin_prefix}${ROLES['add']}`, {
          params: {
            name: values.username,
            desc: values.description || '',
          }
        }).then(function(res) {
          _this.setState({ loading:false });
          if (res.data.success) {
            // 刷新当前页面
            _this.props.fetchAllRoles({
              ps:_this.props.pageSize,
              pn:1
            });
            // 更新当前角色-个人信息
            _this.props.upDateCurrentRole({id: res.data.data, name: values.username, desc: values.description});
            var promise = _this.props.distributionPower({});
            promise.then(function() {
              form.resetFields();
              _this.props.openDistributionRole && _this.props.openDistributionRole()
            })
          } else {
            // 添加角色失败
          }
        })
      }
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        visible={this.props.visible}
        title={intl.get('lv.settings.account.role.createRole.title')}
        footer={null}
        onCancel={this.cancelModalRole.bind(this)}
        maskClosable={false}
        className="role-modal modal-title"
        width={420}
      >
        <div className="create-role-container">
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormItem {...formItemLayout} label={intl.get('lv.settings.account.role.columns2')}>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: intl.get('lv.settings.account.role.columns2.placeholder')
                  },
                  {
                    max:20,
                    message: intl.get('lv.settings.account.role.columns2.maxlength'),
                  }
                ]
              })(<Input placeholder={intl.get('lv.settings.account.role.columns2.placeholder')} onBlur={this.handleBlurRoleName.bind(this)}/>)}
            </FormItem>

            <FormItem {...formItemLayout} label={intl.get('lv.settings.account.role.columns3')}>
              {getFieldDecorator('description', {
                rules: [
                  {
                    max:100,
                    message: intl.get('lv.settings.account.role.columns3.maxlength'),
                  }
                ]
              })(<TextArea  style={{'resize':'none'}} autosize={{minRows: 3,maxRows: 6}} placeholder={intl.get('lv.settings.account.role.columns3.placeholder')}/>)}
            </FormItem>

            <Row className="">
              <Col className="text-center">
                <FormItem >
                  <Button type="primary" htmlType="submit"  loading={this.state.loading} style={{
                    width: '150px'
                  }}>{intl.get('lv.settings.account.role.nextStep')}</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  let roles = state.get('roles').toJS();
  return {
    currentRole: roles.currentRole,
    currentPage: roles.currentPage,
    pageSize: roles.pageSize,
    total: roles.total,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    distributionPower: bindActionCreators(distributionPower, dispatch),
    upDateCurrentRole: bindActionCreators(upDateCurrentRole, dispatch),
    fetchAllRoles: bindActionCreators(fetchAllRoles, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CreateRole));
