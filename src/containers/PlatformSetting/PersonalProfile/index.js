/**
 * @authors wangchen
 * @date    2018-08-16
 * @module  个人资料
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Form, Input, InputNumber, Radio } from 'antd';
import Loading from 'components/Common/Loading';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import UpdatePassword from 'components/Account/UpdatePassword';
import { Link } from 'react-router';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/PlatformSetting/personalProfile';
import './style.scss';
const suplierStatus = {
  1: '正常',
  2: '停用'
};

class PersonalProfile extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showUpdate: false,
    }
  }

  componentDidMount() {
    this.props.fetchList();
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


    updateProfile = () => {
      this.setState({
        showUpdate: true
      })
    }



  //修改确定
  handleSubmit(callback) {
    this.props.form.validateFields((err, val) => {
      if (err && Object.keys(err).length) {
        return;
      }
      console.log(val,'val')
      if(this.props.list){
        let params = this.props.list.addonInfo;
        params.contactName = val.contactName;
        params.address = val.address;
        params.email = val.email;
        this.props.updateProfile(params, () => {
          callback && callback();
          this.setState({showUpdate: false});
          this.props.fetchList();
        }, () => {
          callback && callback();
          message.error('操作失败');
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {list = {}} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    console.log(list,'wangwang')
    return (
      <div className="personalProfile-content">
                <FormItem label="登录账户" {...formItemLayout}>
                  {
                    <div className="login-content">
                        <div>{list && list.addonInfo ? list.addonInfo.loginUser : ''}</div>
                      <UpdatePassword>
                        <Link className="ct-edit r-edit" style={{ float: 'right' }} onClick={this.editPhone}>{intl.get('account.changepassword')}</Link>
                      </UpdatePassword>
                    </div>
                  }
                </FormItem>
                <FormItem label="联系人姓名" {...formItemLayout}>
                  {
                    getFieldDecorator('contactName', {
                      initialValue: list && list.addonInfo ? list.addonInfo.contactName : '',
                      rules: [{required: true, message: '请输入联系人名称'},
                      {
                        validator: this.validateRealName,
                      }
                    ]
                    })(
                      <Input
                        name="realName"
                        id="realName"
                        className="at-cont"
                        type="text"
                        placeholder={intl.get('account.realNameError')}
                      />,
                    )
                  }
                </FormItem>
                <FormItem label="采购商名称" {...formItemLayout}>
                  {
                      <div>{list && list.addonInfo ? list.addonInfo.purchaserName : ''}</div>
                  }
                </FormItem>
                <FormItem label="所在城市" {...formItemLayout}>
                  {
                      <div>{list && list.addonInfo ? list.addonInfo.cityName : ''}</div>
                  }
                </FormItem>
                <FormItem label="联系地址" {...formItemLayout}>
                  {
                    getFieldDecorator('address', {
                      initialValue: list && list.addonInfo ? list.addonInfo.address : '',
                      rules: [{required: true, message: '请您输入地址'}]
                    })(
                      <Input
                        name="realName"
                        id="realName"
                        className="at-cont"
                        type="text"
                        placeholder={'请您输入地址'}
                      />,
                    )
                  }
                </FormItem>
                <FormItem label="邮箱" {...formItemLayout}>
                  {
                    getFieldDecorator('email', {
                      initialValue: list && list.addonInfo ? list.addonInfo.email : '',
                      rules: [{required: true, message: '请您输入正确的邮箱地址'},
                      {
                        validator: this.validateEmail,
                      }
                    ]
                    })(
                      <Input
                        name="realName"
                        id="realName"
                        className="at-cont"
                        type="mail"
                        placeholder={'请您输入正确的邮箱地址'}
                      />,
                    )
                  }
                </FormItem>
                <FormItem label="合同有效期" {...formItemLayout}>
                  {
                      <div>
                        <span className="ct-phone" >{getDate(list && list.addonInfo ?list.addonInfo.contractStartTime : '') || ''}{'至'}{getDate(list && list.addonInfo ?list.addonInfo.contractEndTime : '') || ''}</span>
                      </div>
                  }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                  {
                      <div>
                      <span className="ct-phone" >{suplierStatus[(list && list.addonInfo ? list.addonInfo.status : '')] || ''}</span>
                      </div>
                  }
                </FormItem>
                <Button type="primary" onClick={this.updateProfile} className="update-btn">{'保存'}</Button>
        {
          this.state.showUpdate && <Modal
            visible={this.state.showUpdate}
            title="提示"
            onOk={this.handleSubmit.bind(this)}
            onCancel={x => this.setState({showUpdate: false})}
          >
          <p style={{textAlign: 'center'}}>{`你确定要修改个人资料吗？`}</p>
          </Modal>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('personalProfile').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PersonalProfile));
