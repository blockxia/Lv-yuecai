import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Input, Form, Button, Radio, Row, Col, Modal } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { updateAccount,checkInLoading } from '../../actions/account';
import { updatePassword } from '../../actions/changePassword';
import ImgUpload from '../../components/Common/ImgUpload';
import UpdatePassword from './UpdatePassword';
import StaticHeader from '../../components/Common/StaticHeader';
import * as Tools from '../../utils/tools.js';
import './style.scss';
import Config from 'config';

const url_prefix = Config.env[Config.scheme].prefix;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Imgs = {
  navLogo: require('../../images/layout/nav-logo.png'),
  accountLogo: require('../../images/layout/acconut-icon.png'),
};
class AccountPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      avatar: Imgs.accountLogo,
      visible: false,
      confirmDirty: false,
      btnDisabled: true,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      uploadAvatar: '',
    };
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../locales/${currentLocale}.json`),
      },
    });
  }

  componentDidMount() {
  }

  // 验证真实姓名只能取中英文
  validateRealName = (rule, value, callback) => {
    const reg = /^[A-Za-z\u4e00-\u9fa5]+$/;
    const form = this.props.form;
    if (value) {
      this.setState({
        btnDisabled: false,
      });
    } else if (!value) {
      if (!form.getFieldValue('identityCard') && !form.getFieldValue('email')) {
        this.setState({
          btnDisabled: true,
        });
      } else {
        this.setState({
          btnDisabled: false,
        });
      }
    }
    if (value && !reg.test(value)) {
      callback(`${intl.get('account.realNameError')}`);
    }
    if (value && value.length > 20) {
      callback(`${intl.get('account.realNameTooLong')}`);
    }
    callback();
  }
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  validateIdentityCard = (rule, value, callback) => {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    const form = this.props.form;
    if (value) {
      this.setState({
        btnDisabled: false,
      });
      if (!reg.test(value)) {
        callback(`${intl.get('account.IDCardError')}`);
      }
    } else if (!value) {
      if (!form.getFieldValue('realName') && !form.getFieldValue('email')) {
        this.setState({
          btnDisabled: true,
        });
      } else {
        this.setState({
          btnDisabled: false,
        });
      }
    }
    callback();
  }
  /**
  * 校验邮箱
  */
  validateEmail = (rule, value, callback) => {
    const form = this.props.form;
    const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (value) {
      this.setState({
        btnDisabled: false,
      });
      if (!reg.test(value)) {
        callback(`${intl.get('account.commonlyEmailError')}`);
      }
    } else if (!value) {
      if (!form.getFieldValue('realName') && !form.getFieldValue('identityCard')) {
        this.setState({
          btnDisabled: true,
        });
      } else {
        this.setState({
          btnDisabled: false,
        });
      }
    }
    callback();
  }

  // 上传用户头像
  handleAvatarUrl = (url) => {
    this.setState({
      avatar: url,
      uploadAvatar: url,
    });
  }

  handleOnRemove = (e) => {
    if (e.response.success) {
      this.setState({
        avatar: Imgs.accountLogo,
      });
    }
  }

  handlePreview = (file) => {
    this.setState({
      // previewImage: this.state.avatar,
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleCancel = () => {
    this.props.checkInLoading({
      buttonLoading:false
    })
    this.setState({
      previewVisible: false,
    });
  }
  submit = () => {
    this.props.checkInLoading({
      buttonLoading:true
    })

    this.props.form.validateFields((error, values) => {
      const state = this.state;
      let params = null;
      let avatar = '';
      if (error) {
        this.props.checkInLoading({
          buttonLoading: false
        })
        return;
      }
      if (state.uploadAvatar) {
        avatar = state.uploadAvatar;
      } else if (this.props.users.avatar) {
        avatar = this.props.users.avatar;
      } else {
        avatar = '';
      }
      params = Object.assign(values, {
        //mobile: this.props.users.name,
        avatar: avatar,
      });
      this.props.updateAccount(params);
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const users = this.props.users;

    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
        },
      },
    };
    // const avatarUrl = (users && users.avatar) ? users.avatar : Imgs.accountLogo;
    return (
      <div className="official-account">
       <div className="account-main fn-clear">
          <div className="account-content">
            <Row type="flex" justify="center" className="account-form">
              <Col >
                <Form>
                  <FormItem
                  >
                    {getFieldDecorator('avatar', {
                      initialValue: '',
                      rules: [{
                        message: '',
                      }],
                    })(
                      <div className="avatar-logo">
                        <ImgUpload
                          onComplete={this.handleAvatarUrl}
                          handleOnRemove={this.handleOnRemove}
                          handlePreview={this.handlePreview}
                          action={`${url_prefix}/mng/api/mng/user/image/upload.json`}
                          type="single"
                          initUrl={
                            this.props.users && this.props.users.avatar ? this.props.users.avatar : this.state.avatar
                          }
                        />
                        <div className="icon-cover">{intl.get('lv.common.uploadPicCover')}</div>
                        {/* <div className="modifyText" style={{textAlign: "center"}}>{intl.get('account.picture')}</div> */}
                        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                          <img alt="avatar logo" src={this.state.previewImage} />
                        </Modal>
                      </div>,
                    )}
                  </FormItem>
                  {/* <FormItem
                    {...tailFormItemLayout}
                  >
                    <div>
                    </div>
                  </FormItem> */}
                  <FormItem
                    {...formItemLayout}
                    label={intl.get('account.accountValue')}
                  >
                    <div>
                      <span className="ct-phone" id="phone">{(users && users.mobile) || ''}</span>
                      <UpdatePassword>
                        <Link className="ct-edit r-edit" style={{ float: 'right' }} onClick={this.editPhone}>{intl.get('account.changepassword')}</Link>
                      </UpdatePassword>
                    </div>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={intl.get('account.realName')}
                  >
                    {getFieldDecorator('realName', {
                      initialValue: (users && users.realName) || '',
                      rules: [{
                        message: '',
                      }, {
                        validator: this.validateRealName,
                      }],
                    })(
                      <Input
                        name="realName"
                        id="realName"
                        className="at-cont"
                        type="text"
                        placeholder={intl.get('account.realNameError')}
                      />,
                    )}
                  </FormItem>
                  
                  <FormItem>
                    <Button
                      className="btn btn-primary btn-save j-submit j-save j-save-account"
                      type="primary"
                      htmlType="submit"
                      loading={this.props.account.buttonLoading}
                      disabled={this.props.form.getFieldValue('realName') || this.props.form.getFieldValue('identityCard') || this.props.form.getFieldValue('email') ? false : this.state.btnDisabled}
                      onClick={()=>{this.submit.call(this, 'submit');}}
                    >{intl.get('lv.common.save')}
                    </Button>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userInfo = state.get('userInfo').toJS();
  const { users } = userInfo;

  return {
    users,
    account: state.get('account').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAccount(params) {
      dispatch(updateAccount(params));
    },
    updatePassword(params) {
      dispatch(updatePassword(params));
    },
    checkInLoading(params) {
      dispatch(checkInLoading(params));
    }
  };
}

const Accounts = Form.create()(AccountPage);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Accounts);
