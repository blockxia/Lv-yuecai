import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intl from 'react-intl-universal';

import { Modal, Form, Input, Icon, Row, Col, Checkbox, Button, Spin } from 'antd';
import message from 'components/Common/message';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

import {fechEmployees, cleanCurrentUser, cleanAllRole} from '../../../../../actions/Settings/account';
import { ROLES } from '../../../../../constants/actionApi.js';

import axios from 'api/axios.js';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

const translate =(name,title)=>{
  return intl.get(title);
}

import './style.scss';

const options = [
  { label: 'Apple', value: '1' },
  { label: 'Pear', value: '2' },
  { label: 'Orange', value: '3' }
];

class AddRoleModal extends Component {

  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      userCheckIds: null,
      loading: false,
    }
  }

  onChange(checkedValues) {
    this.setState({userCheckIds: checkedValues})
  }

  getRoleListOptioins() {
    let list = this.props.allRoles;
    let currentUser = this.props.currentUser;
    let plainOptions = [];
    let defaultCheckedList = null;
    list.map((item) => {
      plainOptions.push({label: item.name, value: item.id})
    })
    return (<CheckboxGroup options={plainOptions} key={currentUser.userId} defaultValue={currentUser.ids || []} onChange={this.onChange.bind(this)}/>);
  }

  handleClickSaveRoleUser() {
    let _this = this;
    _this.setState({
      loading:true
    });
    axios.get(`${admin_prefix}${ROLES['privilege_auth']}`, {
      params: {
        userId: this.props.currentUser.userId,
        roleIds: this.state.userCheckIds?this.state.userCheckIds.toString():this.props.currentUser.ids?this.props.currentUser.ids.toString():[]
      }
    }).then(function(res) {
      _this.setState({
        loading:false
      });
      if (res.data.success) {
        message.success(translate('保存成功！','lv.common.msg.save.success'));
        _this.props.onCancel();
        setTimeout(function() {
          _this.props.fechEmployees({
            name:_this.props.searchData.userName?_this.props.form.getFieldValue('prefix')+'-'+ _this.props.searchData.userName:'',
            realName:_this.props.searchData.userRealName,
            ps:_this.props.pageSize,
            pn:_this.props.currentPage
          });
          _this.props.cleanAllRole();
          _this.props.cleanCurrentUser();
        }.bind(_this), 200);
      }else{
        message.warn(translate('保存失败！','lv.common.msg.save.error'));
      }
    })
  }

  closeModal() {
    this.props.cleanAllRole();
    this.props.cleanCurrentUser();
    this.props.onCancel();
  }

  getDom() {
    return (
      <div>
        <div className="role-add-container">
          {/* <p className="role-add-advice">{translate('选中复选框即可赋予相应角色，取消选中则取消相应权限。超级管理员默认拥有所有权限','lv.common.tips.employee.info.text')}</p> */}
          <div className="user-box">
            {/* <span className="user-tile"><span style={{color:'red'}}>*</span>{translate('员工信息','lv.common.title.Employee.info')}</span> */}
            <span className="user-info-item" style={{paddingLeft: 8}}>{translate('员工账号','lv.settings.account.employees.accountno')} ：{this.props.currentUser.name}</span>
            <span className="user-info-item">{translate('员工姓名','lv.settings.account.employees.name')} ：{this.props.currentUser.realName}</span>
          </div>
          <div className="role-list">
            <div className="user-tile"><span style={{color:'red'}}>*</span>{translate('角色列表','lv.common.title.role.list')}</div>
            {/* <div className="user-tile-notes">{translate('选中复选框即可赋予相应角色，取消选中则取消相应权限。超级管理员默认拥有所有权限','lv.common.tips.employee.info.text')}</div> */}
            {this.getRoleListOptioins()}
          </div>
        </div>
        <div className="role-sublimit">
          <Button type="primary" loading={this.state.loading} onClick={this.handleClickSaveRoleUser.bind(this)}>{translate('保存配置','lv.common.saveSettings')}</Button>
        </div>
      </div>
    )
  }

  render() {
    const currentUser = this.props.currentUser;
    const allRoles = this.props.allRoles.length;
    return (
      <div>
      {
        this.props.visible?
        <Modal
          visible={this.props.visible}
          footer={null}
          title={translate('分配角色','lv.settings.account.employees.allocationRole')}
          maskClosable={false}
          className="modal-title"
          onCancel={this.closeModal.bind(this)}
        >
          {this.getDom()}
        </Modal>:''
      }
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
    fechEmployees: bindActionCreators(fechEmployees, dispatch),
    cleanAllRole: bindActionCreators(cleanAllRole, dispatch),
    cleanCurrentUser: bindActionCreators(cleanCurrentUser, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps,)(AddRoleModal);
