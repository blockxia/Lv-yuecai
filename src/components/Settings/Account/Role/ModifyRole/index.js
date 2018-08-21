import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intl from 'react-intl-universal';

import {distributionPower,addRoles,upDateCurrentRole,fetchAllRoles} from '../../../../../actions/Settings/account';
import { ROLES } from '../../../../../constants/actionApi.js';

import { Modal, Form, Input, Icon, Row, Col, Checkbox, Button, Spin } from 'antd';
import message from 'components/Common/message';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const CheckboxGroup = Checkbox.Group;

import axios from 'api/axios.js';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;


import './style.scss';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

class ModifyRole extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      roleNameMsg:'',
      roleNameValidateStatus:'',
      roleDescMsg:'',
      roleDescValidateStatus:'',
      loading: false,
    }
  }

  cancelModalRole() {
    let form = this.props.form;
    this.setState({
      roleNameMsg:'',
      roleDescMsg:'',
      roleNameValidateStatus:'',
      roleDescValidateStatus:''
    })
    this.props.onCancel && this.props.onCancel();
  }


  handleChangeRoleName(e){
    if(e.target.value==''){
      this.setState({
        roleNameValidateStatus:'error',
        roleNameMsg: intl.get('lv.settings.account.role.columns2.placeholder')
      })
    }else if(e.target.value.length>20){
      this.setState({
        roleNameValidateStatus:'error',
        roleNameMsg: intl.get('lv.settings.account.role.columns2.maxlength')
      })
    }
    else{
      this.setState({
        roleNameValidateStatus:'success',
        roleNameMsg:''
      })
    }
    this.props.upDateCurrentRole({
      id:this.props.currentRole.id,
      name:e.target.value,
      desc:this.props.currentRole.desc
    })
  }

  checkRoleNameCanUse(e){
    let _this = this;
    if(!e.target.value || _this.state.roleNameMsg){
      return false;
    };
    axios.get(`${admin_prefix}${ROLES['get_by_name']}`, {
      params: {
        name: this.props.currentRole.name
      }
    }).then(function(res){
      if(res.data.data && (_this.props.currentRole.id==res.data.data.id)){
        // 可以
        _this.setState({
          roleNameValidateStatus:'success',
          roleNameMsg:''
        })
      }else if(res.data.data){
        // 不可以
        _this.setState({
          roleNameValidateStatus:'error',
          roleNameMsg: intl.get('lv.settings.account.role.checkRole.error')
        })
      }else{
        _this.setState({
          roleNameValidateStatus:'success',
          roleNameMsg:''
        })
      }
    })
  }

  handleChangeRoleDesc(e){

    if(e.target.value.length>100){
      this.setState({
        roleDescValidateStatus:'error',
        roleDescMsg: intl.get('lv.settings.account.role.columns3.maxlength')
      })
    }else{
      this.setState({
        roleDescValidateStatus:'success',
        roleDescMsg:''
      })
    }

    this.props.upDateCurrentRole({
      id:this.props.currentRole.id,
      name:this.props.currentRole.name,
      desc:e.target.value
    })
  }

  saveRolesCur(e){
    let switch_save=true;
    let _this = this;
    if(this.props.currentRole.name==''){
      this.setState({
        roleNameValidateStatus:'error',
        roleNameMsg: intl.get('lv.settings.account.role.columns2.placeholder')
      })
      switch_save=false;
    }else if(this.props.currentRole.name.length>20){
      this.setState({
        roleNameValidateStatus:'error',
        roleNameMsg: intl.get('lv.settings.account.role.columns2.maxlength')
      })
      switch_save=false;
    }else if(this.state.roleNameMsg){
      switch_save=false;
    }else if(this.props.currentRole.desc.length>100){
      this.setState({
        roleDescValidateStatus:'error',
        roleDescMsg: intl.get('lv.settings.account.role.columns3.maxlength')
      })
      switch_save=false;
    }else if(this.state.roleDescMsg){
      switch_save=false;
    }else{
      switch_save=true;
    }

    if(switch_save){
      this.setState({
        loading: true,
      });
      // 保存信息
      axios.get(`${admin_prefix}${ROLES['update']}`, {
        params: {
          roleId:this.props.currentRole.id,
          name:this.props.currentRole.name,
          desc:this.props.currentRole.desc
        }
      })
      .then(function(res){
        _this.setState({
          loading: false,
        });
        if(res.data.success){
          // 保存成功
          message.success(intl.get('lv.common.modify.success'))
          _this.props.fetchAllRoles({
            ps:_this.props.pageSize,
            pn:_this.props.currentPage,
          })
          .then(function(){
            _this.props.onCancel && _this.props.onCancel();
          })
        }else{
          // 保存失败
          message.warn(intl.get('lv.common.modify.error'));
        }
      })
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    let form = this.props.form;
    return (
      <Modal
        visible={this.props.visible}
        title="修改角色" footer={null}
        onCancel={this.cancelModalRole.bind(this)}
        maskClosable={false}
        className="role-modal modal-title"
        width={420}
      >
        <div className="create-role-container">
          <Form>
            <FormItem {...formItemLayout} label={intl.get('lv.settings.account.role.columns2')}
              help={this.state.roleNameMsg}
              validateStatus={this.state.roleNameValidateStatus}
              required={true}
            >
              <Input
                placeholder={intl.get('lv.settings.account.role.columns2.placeholder')}
                value={this.props.currentRole.name}
                onChange={this.handleChangeRoleName.bind(this)}
                onBlur={this.checkRoleNameCanUse.bind(this)}
              />
            </FormItem>

            <FormItem {...formItemLayout}
              label={intl.get('lv.settings.account.role.columns3')}
              help={this.state.roleDescMsg}
              validateStatus={this.state.roleDescValidateStatus}
              required={false}
            >
              <TextArea
                placeholder={intl.get('lv.settings.account.role.columns3.placeholder')}
                value={this.props.currentRole.desc}
                onChange={this.handleChangeRoleDesc.bind(this)}
                style={{'resize':'none'}}
                autosize={{minRows: 3,maxRows: 6}}
              />
            </FormItem>

            <Row className="">
              <Col span={24}>
                <FormItem >
                  <Button type="primary" loading={this.state.loading} onClick={this.saveRolesCur.bind(this)}>{intl.get('lv.common.modify.confirmOK')}</Button>
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
    pageSize: roles.pageSize
  };
}

function mapDispatchToProps(dispatch) {
  return {
    upDateCurrentRole:bindActionCreators(upDateCurrentRole, dispatch),
    fetchAllRoles:bindActionCreators(fetchAllRoles, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ModifyRole));
