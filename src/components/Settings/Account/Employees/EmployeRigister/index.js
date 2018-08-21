import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intl from 'react-intl-universal';
import message from 'components/Common/message';

import { Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

import {distributionRoles,fechEmployees} from '../../../../../actions/Settings/account';
import {EMPLOYEES} from '../../../../../constants/actionApi.js';

import axios from 'api/axios.js';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

import GetCountryCodeBat from 'components/Common/GetCountryCodeBat';

const translate =(name,title)=>{
  return intl.get(title);
}

import './style.scss';

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 25 }, sm: { span: 17 } }
};


class EmployeRigister extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      confirmDirty: false, //确认密码
      userPhoneIsRegister: false, //手机号是否被注册
      userNameIsRegister: false, //员工姓名是否被注册
      userId: null, //用户的id
      count: 60, //倒计时
      liked: true, //验证码
      loading: false,
    }
  }


  checkPhoneNumber() {
    let form = this.props.form;
    let phoneCanUse = false;
    form.validateFields(['phone'], {}, (err) => {
      if (err) {
        phoneCanUse = false;
      } else {
        phoneCanUse = true;
      }
    });
    return phoneCanUse;
  }


  getVerifyCode() {
    // 检查用户信息的完整性
    let res = this.checkPhoneNumber();
    if (res && this.state.liked && !this.state.userPhoneIsRegister) {
      this.sendVerifyCode();
      this.state.liked = false;
      // 定时器
      this.timer = setInterval(function() {
        var count = this.state.count;
        count -= 1;
        if (count < 1) {
          this.setState({liked: true});
          count = 60;
          clearInterval(this.timer);
        }
        this.setState({count: count});
      }.bind(this), 1000);
    }
  }


  sendVerifyCode() {
    let that = this;
    let form = this.props.form;
    let userPhone = form.getFieldValue('phone');
    let userCurrentCountry = form.getFieldValue('prefix');

    axios.get(`${admin_prefix}/sys/sms-code.json`, {
      params: {
        country: userCurrentCountry,
        mobile: userPhone
      }
    }).then(function(res) {
      if (!res.data.success) {
        that.setState({liked: true});
        form.setFields({
          captcha: {
            value: '',
            errors: [new Error(translate('短信验证码发送太频繁','lv.common.msg.verification.many'))]
          }
        });
        clearInterval(that.timer);
      }
    })
  }


  handlePhonCheck(rule, value, callback) {
    this.setState({
      userPhoneIsRegister:false
    });
    var currentCountry = this.props.form.getFieldValue('prefix');
    var phone = Number(currentCountry) == 86 ? /^1\d{10}$/ : /^\d{1,11}$/;
    if (value && !phone.test(value)) {
      callback(translate('手机号格式有错误','lv.common.msg.phone.error'))
    } else {
      callback();
    }
  }


  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  }


  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(translate('两次密码不一致，请重新输入','lv.common.msg.no.same.pwd'));
    } else {
      callback();
    }
  }


  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    const password = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }

    if (value && !password.test(value)) {
      callback(translate('6~20位数字+字母密码，字母区分大小写','lv.common.msg.format.pwd'))
    }
    callback();
  }

  checkUserNameIsRegiter() {
    let userName = this.props.form.getFieldValue('username');
    if(userName) {
      axios.get(`${admin_prefix}${EMPLOYEES['query_user_by_realname']}`, {
        params: {
          realName: $.trim(userName)
        }
      }).then(function(res) {
        if (res.data.success) {
          if(res.data.data) {
            message.warn('员工姓名已存在，请输入后缀如“张三1”区分');
            $('#username').focus();
            this.setState({
              userNameIsRegister: true,
            });
          }else{
            this.setState({
              userNameIsRegister: false,
            });
          }
        }
      });
    }
  }

  checkPhoneIsRegiter() {
    let res = this.checkPhoneNumber();
    let _this = this;
    let form = this.props.form;
    let userPhone = form.getFieldValue('phone') || '';
    let userCurrentCountry = form.getFieldValue('prefix');

    return axios.get(`${admin_prefix}${EMPLOYEES['check_account']}`, {
      params: {
        userName: userCurrentCountry + '-' + userPhone
      }
    }).then(function(res) {
      if (res.data.success) {
        if (res.data.data) {
          // 已经注册
          _this.setState({userPhoneIsRegister: true, userId: res.data.data.id});
        } else {
          // 还没有注册
          _this.setState({userPhoneIsRegister: false, userId: null});
        }
      }
    })
  }


  dealCountry(areaCode) {
    if (areaCode.length == 4) {
      return areaCode;
    } else if (areaCode.length == 3) {
      return '0' + areaCode;
    } else if (areaCode.length == 2) {
      return '00' + areaCode;
    } else {
      return '000' + areaCode;
    }
  }


  handleSubmit(e) {
    e.preventDefault();
    this.props.defaultUserPhone && this.checkPhoneIsRegiter();
    let form = this.props.form;
    let userPhone = form.getFieldValue('phone');
    form.validateFields((err, values) => {
      if (!err) {
        this.nextDistribution(values);
      }
    });
  }


  nextDistribution(data) {
    let form = this.props.form;
    let userCurrentCountry = form.getFieldValue('prefix');
    let userPhone = form.getFieldValue('phone');
    let userCaptcha = form.getFieldValue('captcha');
    let userName = form.getFieldValue('username');
    let _this = this;
    
    if(this.state.userNameIsRegister){
      message.warn('员工姓名已存在，请输入后缀如“张三1”区分');
      $('#username').focus();
      return;
    }

    this.setState({
      loading: true,
    });
    axios.get(`${admin_prefix}${EMPLOYEES['add_new']}`, {
      params: {
        mobile: userCurrentCountry + '-' + userPhone,
        //captcha: userCaptcha,
        password: data.password,
        realName: data.username
      }
    }).then(function(res) {
      _this.setState({
        loading: false,
      });
      if (res.data.success) {
          let objUser = {
            userId: res.data.data.id,
            name: data.phone,
            realName: data.username,
            ids:[]
          }
        _this.props.distributionRoles(objUser);
        clearInterval(_this.timer);
        _this.setState({
          confirmDirty: false,
          userPhoneIsRegister: false,
          userId: null,
          count: 60,
          liked: true,
        });
        // 刷新页面
        _this.props.fechEmployees({
          ps:_this.props.pageSize,
          pn:1
        });
        _this.props.cleanSeachWhile();
        _this.props.setDefaultUserPhone('');
        _this.props.setDefaultUserCountry('');
        _this.props.openAddRoleMadel && _this.props.openAddRoleMadel();
      }
    })
  }


  goBack() {
    clearInterval(this.timer);
    this.setState({
      confirmDirty: false,
      userPhoneIsRegister: false,
      userId: null,
      count: 60,
      liked: true,
    });
    this.props.setDefaultUserPhone('');
    this.props.setDefaultUserCountry('');
    this.props.onCancel && this.props.onCancel()
  }


  openAddEmploye() {
    let form = this.props.form;
    clearInterval(this.timer);
    this.setState({
      confirmDirty: false,
      userPhoneIsRegister: false,
      userId: null,
      count: 60,
      liked: true,
    });
    this.props.setDefaultUserPhone(form.getFieldValue('phone'));
    this.props.setDefaultUserCountry(form.getFieldValue('prefix'));
    this.props.openAddEmployeMadel();
  }


  // 是否已经注册
  if_RigsterMessage() {
    return this.state.userPhoneIsRegister
      ? (
        <div className="employees-user-message" onClick={this.openAddEmploye.bind(this)}>{translate('该账号已经存在','lv.common.title.account.in.has')},<span style={{
          color: '#45b9b0'
        }}>{translate('立即添加','lv.common.title.add.now')}</span>
        </div>
      )
      : '';
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {

    const {getFieldDecorator} = this.props.form;
    const {countryList} = this.props;
    //const verify_text = this.state.liked ? translate('获取验证码','lv.common.getVerifyCode') : this.state.count + translate('秒后重发','lv.common.verifyCodeRepeat');
    const disabledSwitch = this.state.userPhoneIsRegister ? true : false;

    const prefixSelector = countryList && countryList.length&& getFieldDecorator('prefix', {
      initialValue: this.props.defaultUserCountry || parseInt(countryList[0].code).toString()
    })(
      <GetCountryCodeBat getCountrycodeId="search-country-register" dataList={countryList}/>
    );

    return (
      <div>
        {this.props.visible?
        <Modal
          visible={this.props.visible}
          footer={null}
          width={420}
          title={translate('注册员工账号','lv.common.title.regist.employee')}
          onCancel={this.goBack.bind(this)}
          className="modal-title"
          maskClosable={false}
        >
          <div className="register-employees-container">
            <div className="error-msg-box">{this.if_RigsterMessage()}</div>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormItem {...formItemLayout} label={translate('员工账号','lv.settings.account.employees.accountno')}   className="phone-addon">
                {getFieldDecorator('phone', {
                  initialValue:this.props.defaultUserPhone,
                  rules: [
                    {
                      required: true,
                      message: translate('请输入手机号!','lv.common.telphonePlaceholder')
                    }, {
                      validator: this.handlePhonCheck.bind(this)
                    }
                  ]
                })(<Input addonBefore={prefixSelector} style={{
                  width: '100%'
                }} placeholder={translate('请输入手机号','lv.common.telphonePlaceholder')} onBlur={this.checkPhoneIsRegiter.bind(this)}/>)}
              </FormItem>

              {/* <FormItem {...formItemLayout} label={translate('验证码','lv.common.label.verification.code')}>
                <Row gutter={8}>
                  <Col span={14}>
                    {getFieldDecorator('captcha', {
                      rules: [
                        {
                          required: true,
                          message: translate('请输入你的验证码!','lv.common.title.input.verification')
                        }
                      ]
                    })(<Input maxLength="4" size="large" placeholder={translate('请输入你的验证码','lv.common.title.input.verification')}/>)}
                  </Col>
                  <Col span={10}>
                    <Button style={{width:'100%'}} size="large" onClick={this.getVerifyCode.bind(this)}>{verify_text}</Button>
                  </Col>
                </Row>
              </FormItem> */}

              <FormItem {...formItemLayout} label={translate('员工姓名','lv.settings.account.employees.name')}>
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: translate('请输入你的姓名!','lv.common.msg.enter.your.name')
                    },
                    {
                      max:10,
                      message: translate('最多可以输入10个','lv.common.msg.can.input.text'),
                    }
                  ]
                })(<Input onBlur={this.checkUserNameIsRegiter.bind(this)} placeholder={translate('请输入员工姓名','lv.settings.account.employees.inputname')}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={translate('登录密码','lv.common.title.login.pwd')} hasFeedback>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: translate('请输入你的密码!','lv.common.title.please.input.your.pwd')
                    }, {
                      validator: this.checkConfirm
                    }
                  ]
                })(<Input type="password" placeholder={translate('请输入6-20位数字＋字母密码，字母区分大小写','lv.common.tips.pwd.format.text')}/>)}
              </FormItem>

              <FormItem {...formItemLayout} label={translate('确认密码','account.Confirmpassword')} hasFeedback>
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: translate('请输入你的确认密码!','lv.common.title.input.your.pwd')
                    }, {
                      validator: this.checkPassword
                    }
                  ]
                })(<Input type="password" onBlur={this.handleConfirmBlur} placeholder={translate('请再次输入确认密码','lv.common.title.pwd.sure.again')}/>)}
              </FormItem>

              <Row>
                <Col className="text-center">
                  <FormItem>
                    <Button type="primary" loading={this.state.loading} style={{
                      width: '150px'
                    }} htmlType="submit" disabled={disabledSwitch}>{translate('下一步分配角色','lv.common.title.next.dispatch.role')}</Button>
                  </FormItem>
                </Col>
              </Row>

            </Form>
          </div>
        </Modal>:''}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let employees = state.get('employees').toJS();
  return {
    currentPage: employees.currentPage,
    pageSize: employees.pageSize,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    distributionRoles: bindActionCreators(distributionRoles, dispatch),
    fechEmployees:bindActionCreators(fechEmployees, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps,)(Form.create()(EmployeRigister));