import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intl from 'react-intl-universal';

import { Modal, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Al } from 'antd';
import message from 'components/Common/message';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

import {distributionRoles,fechEmployees} from '../../../../../actions/Settings/account';
import {EMPLOYEES, ROLES} from '../../../../../constants/actionApi.js';

import GetCountryCodeBat from 'components/Common/GetCountryCodeBat';

import axios from 'api/axios.js';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

const translate =(name,title)=>{
  return intl.get(title);
}

import './style.scss';

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
};

class AddEpyesForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      userPhoneIsRegister: true, //手机号是否被注册
      userId: null, //用户的id
      count: 60, //倒计时
      liked: true, //验证码,
      errorCode: -1,
      loading: false,
    }
  }

  checkPhoneNumber() {
    let form = this.props.form;
    let phoneCanUse=false;
    form.validateFields(['phone'], {}, (err) => {
      if (err) {
        phoneCanUse=false;
      } else {
        phoneCanUse=true;
      }
    });
    return phoneCanUse;
  }

  // 获取验证码
  getVerifyCode() {
    if(!this.state.userId && this.state.errorCode !== -1){
      //message.warn(intl.get('lv.settings.account.employees.add.error'));
      return;
    }
    // 检查用户信息的完整性
    let res = this.checkPhoneNumber();
    if (res && this.state.liked && this.state.userPhoneIsRegister) {
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

  //  检查用户是否已经注册
  checkPhoneIsRegiter() {
    let res = this.checkPhoneNumber();
    let _this = this;
    let form = this.props.form;
    let userPhone = form.getFieldValue('phone') || '';
    let userCurrentCountry = form.getFieldValue('prefix');

    if(res){
      axios.get(`${admin_prefix}${EMPLOYEES['check_account']}`, {
        params: {
          userName: userCurrentCountry + '-' + userPhone
        }
      }).then(function(res) {
        if (res.data.success) {
          if (res.data.data) {
            _this.setState({
              userPhoneIsRegister: true,
              userId:res.data.data.userId,
              realName: res.data.data.realName,
              errorCode: -1,
            });
          } else {
            // 还没有注册
            _this.setState({
              userPhoneIsRegister: false,
              userId:null
            });
          }
        }else{
          if(res.data && res.data.code === 200002) {
            
          }else{
            _this.setState({
              userPhoneIsRegister: true,
              errorCode: res.data.code,
              userId:null
            });
          }
        }
      }).catch(function (error) {
        message.warn(translate('请求错误！','lv.common.msg.request.error'));
      });
    }
  }

  // 发送验证码
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
    }).catch(function (error) {
      message.warn(translate('验证码发送失败！','lv.common.msg.send.error'));
    });
  }

  // 手机号验证
  handlePhonCheck(rule, value, callback) {
    this.setState({
      userPhoneIsRegister:true
    });
    var currentCountry = this.props.form.getFieldValue('prefix');
    var phone = Number(currentCountry) == 86 ? /^1\d{10}$/ : /^\d{1,11}$/;
    if (value && !phone.test(value)) {
      callback(translate('手机号格式有错误','lv.common.msg.phone.error'))
    } else {
      callback();
    }
  }

  // 处理国家信息
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

  // 返回
  goBack() {
    clearInterval(this.timer);
    this.setState({
      userPhoneIsRegister:true,
      liked:true,
      count:60,
      userId:null,
      errorCode: -1,
      realName: ''
    });
    this.props.setDefaultUserPhone('');
    this.props.setDefaultUserCountry('');
    this.props.onCancel && this.props.onCancel();
  }

  // 添加角色
  handleSubmit = (e) => {
    e.preventDefault();
    if(!this.state.userId && this.state.errorCode !== -1){
      //message.warn(intl.get('lv.settings.account.employees.add.error'));
      return;
    }
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
    let userPhone = form.getFieldValue('phone');
    let userCaptcha = form.getFieldValue('captcha');
    let userName = form.getFieldValue('username');
    let _this = this;
    this.setState({
      loading: true,
    });
    axios.get(`${admin_prefix}${EMPLOYEES['add_exsit']}`, {
      params: {
        userId: this.state.userId,
        realName: userName,
      }
    }).then(function(res) {
      if (res.data.success) {
        // 查询自己的角色
        _this.searchUserRole(_this.state.userId, data);
      }else{
        _this.setState({
          loading: false,
        });
        // 数据重复
        if(res.data.code=='-9990'){
          message.warning(translate('你已经添加过了！','lv.common.msg.add.has'))
        }

        if(res.data.code === 520005) {
          message.warning(intl.get('msg.global.code.minus9996'));
        }
      }
    }).catch(function (error) {
      _this.setState({
        loading: false,
      });
    });
  }

  searchUserRole(userId, data) {
    var _this = this;
    axios.get(`${admin_prefix}${ROLES['get_by_userid']}`, {
      params: {
        userId: userId
      }
    }).then(function(res) {
      _this.setState({
        loading: false,
      });
      if (res.data.success) {
        let objUser = {
          userId: userId,
          name: data.phone,
          realName: data.username,
          ids: res.data.data.map((item) => {
            return item.id
          })
        }
        _this.props.distributionRoles(objUser);
      }else{
        message.warning(translate('角色查询失败！','lv.common.msg.search.role.error'));
      }
    }).then(function() {
      _this.setState({
        loading: false,
      });
      // 清空操作
      clearInterval(_this.timer);
      _this.props.setDefaultUserPhone('');
      _this.props.setDefaultUserCountry('');
      _this.setState({
        userPhoneIsRegister:true,
        liked:true,
        count:60,
        userId:null,
        errorCode: -1,
        realName: ''
      });
      // 刷新页面
      _this.props.fechEmployees({
        ps:_this.props.pageSize,
        pn:1
      });
      // 清除搜索条件
      _this.props.cleanSeachWhile();
      _this.props.openAddRoleMadel && _this.props.openAddRoleMadel()
    }).catch(function (error) {
      _this.setState({
        loading: false,
      });
      message.warning(translate('角色查询失败！','lv.common.msg.search.role.error'));
    });
  }

  closeModal() {
    clearInterval(this.timer);
    this.props.setDefaultUserPhone('');
    this.props.setDefaultUserCountry('');
    this.setState({
      userPhoneIsRegister:true,
      liked:true,
      count:60,
      userId:null,
      errorCode: -1,
      realName: '',
    });
    this.props.onCancel && this.props.onCancel();
  }

  // 打开注册弹框
  openRigister() {
    let form = this.props.form;
    this.props.setDefaultUserPhone(form.getFieldValue('phone'));
    this.props.setDefaultUserCountry(form.getFieldValue('prefix'));
    this.setState({
      userPhoneIsRegister:true,
      liked:true,
      count:60,
      userId:null,
      errorCode: -1,
      realName: ''
    })
    clearInterval(this.timer);
    this.props.openRigisterMadel();
  }

  // 是否已经注册
  if_RigsterMessage() {
    return this.state.userPhoneIsRegister ? '' : (<div className="employees-user-message" onClick={this.openRigister.bind(this)}>该账号不存在,是否<span style={{color:'#45b9b0'}}>立即注册</span></div>);
  }

  getErrorMsg() {
    if(!this.state.userPhoneIsRegister){
      return (<div className="employees-user-message" >{intl.get('lv.settings.account.employees.add.error200002')}<span style={{color:'#45b9b0'}} onClick={this.openRigister.bind(this)}>{intl.get('lv.settings.account.employees.add.error200002.register')}</span></div>);
    }else{
      if(this.state.errorCode === 400001) {
        return (<div className="employees-error-message" ><span>{intl.get('lv.settings.account.employees.add.error400001')}</span></div>);
      }else if(this.state.errorCode === 400006){
        return (<div className="employees-error-message" ><span>{intl.get('lv.settings.account.employees.add.error400006')}</span></div>);
      }else{
        return null;
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  countryCodeBatCallBack(id) {
    let form = this.props.form;
    form.setFields({
      prefix: {
        value: id
      }
    });
    $('#phone').focus();
    $('#phone').blur();
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {countryList} = this.props;
    //const verify_text = this.state.liked ? translate('获取验证码','lv.common.getVerifyCode') : this.state.count + translate('秒后重发','lv.common.verifyCodeRepeat');
    const disabledSwitch = this.state.userPhoneIsRegister ? false : true;

    const prefixSelector = countryList && countryList.length&& getFieldDecorator('prefix', {
      initialValue: parseInt(countryList[0].code).toString()
    })(
      <GetCountryCodeBat onChange={this.countryCodeBatCallBack.bind(this)} getCountrycodeId="search-country-dialog" dataList={countryList}/>
    );

    return (
      <div>
      {this.props.visible?
        <Modal
          visible={this.props.visible}
          footer={null}
          title={translate('添加员工账号','lv.settings.account.employees.control.adds')}
          className="modal-title"
          maskClosable={false}
          onCancel={this.closeModal.bind(this)}
          width={420}
        >
        <div className="add-employees-container">
          <Row className="add-employees-advice">{translate('请你仔细核对手机号码和邮箱，以免为其他无关人员授权，给你造成不必要的损失','lv.common.tips.member.introduce.text')}</Row>
          <div className="error-msg-box">{this.getErrorMsg()}</div>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormItem {...formItemLayout} label={translate('员工账号','lv.settings.account.employees.accountno')}  className="phone-addon">
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
              })(<Input addonBefore={prefixSelector} onBlur={this.checkPhoneIsRegiter.bind(this)}  style={{
                width: '100%'
              }} placeholder={translate('请输入手机号','lv.common.telphonePlaceholder')}/>)}
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
                initialValue:this.state.realName,
                rules: [
                  {
                    required: true,
                    message: translate('请输入你的姓名!','lv.common.msg.enter.your.name'),
                  },
                  {
                    max:10,
                    message: translate('最多可以输入10个','lv.common.msg.can.input.text'),
                  }
                ]
              })(<Input readOnly placeholder={translate('请输入员工姓名','lv.settings.account.employees.inputname')} />)}
            </FormItem>

            <Row>
              <Col className="text-center">
                <FormItem >
                  <Button type="primary" loading={this.state.loading} htmlType="submit" style={{
                    width: '150px'
                  }} disabled={disabledSwitch}>{translate('下一步分配角色','lv.common.title.next.dispatch.role')}</Button>
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

export default connect(mapStateToProps, mapDispatchToProps,)(Form.create()(AddEpyesForm));








// form.setFields({
//   phone: {
//     value: userPhone,
//     errors: [new Error('你还没有注册赶紧去注册')]
//   }
// });
//
//   componentWillMount() {}
