import React, { Component } from 'react';
import { Input, Select, Form, Button, Upload, Radio, Modal } from 'antd';
import message from 'components/Common/message';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { updatePassword } from '../../actions/changePassword';
import * as Tools from '../../utils/tools.js';
import './style.scss';

const FormItem = Form.Item;

class UpdatePasswordPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      visible: false,
      confirmDirty: false,
      repeatPasswordHelp: '',
      repeatPasswordStatus: '',
    };
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../locales/${currentLocale}.json`),
      }
    });
  }

  showModelHandler = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.props.form.validateFields((error, values) => {
      let params = null;
      const form = this.props.form;
      const repeatPasswordValue = form.getFieldValue('repeatPassword');
      // 校验重复密码不存在的情况
      if (!repeatPasswordValue) {
        this.setState({
          repeatPasswordHelp: `${intl.get('account.ConfirmpasswordError')}`,
          repeatPasswordStatus: 'error',
        });
        return;
      }
      if (error) {
        return;
      }
      if (this.state.repeatPasswordHelp) {
        return;
      }
      // if (!values.newPassword || !values.oldPassword) {
      //   return;
      // }
      params = Object.assign(values, {});
      this.props.updatePassword(params);
    });
    // this.setState({
    //   visible: false,
    // });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields(['oldPassword', 'newPassword', 'repeatPassword']);
    this.setState({
      repeatPasswordHelp: '',
      repeatPasswordStatus: '',
    });
  }

  // 修改密码
  editPhone = () => {
    this.setState({
      visible: true,
    });
  }

  /**
  * 校验重复密码 是否为空、是否和新密码不一致
  */
  validatePassword = () => {
    const form = this.props.form;
    const repeatPasswordValue = form.getFieldValue('repeatPassword');
    const newpasswordValue = form.getFieldValue('newPassword');
    if (!repeatPasswordValue) {
      this.setState({
        repeatPasswordHelp: `${intl.get('account.ConfirmpasswordError')}`,
        repeatPasswordStatus: 'error',
      });
      return;
    }
    if (repeatPasswordValue && repeatPasswordValue !== newpasswordValue) {
      this.setState({
        repeatPasswordHelp: `${intl.get('account.passwordDifferentError')}`,
        repeatPasswordStatus: 'error',
      });
      return;
    } else {
      this.setState({
        repeatPasswordHelp: '',
        repeatPasswordStatus: '',
      });
    }
  }

  /**
  * 校验旧密码 是否满足密码规则
  */
  validateOldPassword = (rule, value, callback) => {
    // const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    if (!value) {
      callback(`${intl.get('account.oldpasswordError')}`);
    }
    // if (value && !reg.test(value)) {
    //   callback(`${intl.get('account.oldpasswordErrorRule')}`);
    // }
    const form = this.props.form;
    if (value && form.getFieldValue('repeatPassword') && form.getFieldValue('newPassword') !== form.getFieldValue('repeatPassword')) {
      this.setState({
        repeatPasswordHelp: `${intl.get('account.passwordDifferentError')}`,
        repeatPasswordStatus: 'error',
      });
    }
    callback();
  }

  /**
  * 校验新密码，是否满足规则
  */
  validateNewPassword = (rule, value, callback) => {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    const form = this.props.form;
    const repeatPasswordValue = form.getFieldValue('repeatPassword');

    if (!value) {
      callback(`${intl.get('account.newpasswordError')}`);
    }
    if (value && !reg.test(value)) {
      callback(`${intl.get('account.newpasswordErrorRule')}`);
    }
    if (repeatPasswordValue && value !== repeatPasswordValue) {
      this.setState({
        repeatPasswordHelp: `${intl.get('account.passwordDifferentError')}`,
        repeatPasswordStatus: 'error',
      });
      return;
    } else if (repeatPasswordValue && value === repeatPasswordValue) {
      this.setState({
        repeatPasswordHelp: '',
        repeatPasswordStatus: '',
      });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayoutChild = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    const { children } = this.props;

    return (
      <span>
        <span onClick={this.showModelHandler}>{ children }</span>
        <Modal
          title={intl.get('account.changepassword')}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={intl.get('account.determine')}
          cancelText={intl.get('account.cancel')}
          wrapClassName="update-password-modal"
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label={intl.get('account.oldpassword')}
              {...formItemLayoutChild}
              required={true}
            >
              {getFieldDecorator('oldPassword', {
                validateTrigger: ['onBlur'],
                rules: [{
                  validator: this.validateOldPassword,
                }],
              })(
                <Input
                  type="password"
                  placeholder={intl.get('account.oldpasswordError')}
                />,
              )}
            </FormItem>
            <FormItem
              label={intl.get('account.newpassword')}
              {...formItemLayoutChild}
              required={true}
            >
              {getFieldDecorator('newPassword', {
                validateTrigger: ['onBlur'],
                rules: [{
                  validator: this.validateNewPassword,
                }],
              })(
                <Input
                  type="password"
                  placeholder={intl.get('account.newpasswordErrorRule')}
                />,
              )}
            </FormItem>
            <FormItem
              label={intl.get('account.Confirmpassword')}
              {...formItemLayoutChild}
              help={this.state.repeatPasswordHelp}
              validateStatus={this.state.repeatPasswordStatus}
            >
              {getFieldDecorator('repeatPassword', {
                rules: [{
                  required: true,
                }],
              })(
                <Input
                  type="password"
                  onBlur={this.validatePassword}
                  placeholder={intl.get('account.ConfirmpasswordError')}
                />,
              )}
            </FormItem>
          </Form>  
        </Modal>
      </span>
    );
  }
}

function mapStateToProps(state) {
  const userInfo = state.get('userInfo').toJS();
  const { users } = userInfo;

  return {
    users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePassword(params) {
      dispatch(updatePassword(params));
    },
  };
}

const UpdatePassword = Form.create()(UpdatePasswordPage);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdatePassword);
