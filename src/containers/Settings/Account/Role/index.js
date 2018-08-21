import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intl from 'react-intl-universal';
import BaseComponent from 'components/Public/BaseComponent';

import { fetchAllRoles, upDateCurrentRole,clean_distributionPower,modifyDistributionPower} from '../../../../actions/Settings/account';
import { ROLES } from '../../../../constants/actionApi.js';

import { Breadcrumb,Form,Input,Row,Col,Button,Table,Modal} from 'antd';
import message from 'components/Common/message';
const FormItem = Form.Item;

import CreateRole from '../../../../components/Settings/Account/Role/CreatRole/index';
import ModifyRole from '../../../../components/Settings/Account/Role/ModifyRole/index';
import DistributionRole from '../../../../components/Settings/Account/Role/DistributionRole/index';
import ModifyDistributionRole from '../../../../components/Settings/Account/Role/ModifyDistributionRole/index';
import DeleteConfirm from 'components/Common/DeleteConfirm/index.js';

import axios from 'api/axios';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

import './style.scss';

const translate = (name,title) => {
  return intl.get(title);
}

class Role extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      visible:false,//创建角色
      visible2:false,//分配角色
      visible3:false,//修改角色
      visible4:false,//修改角色
      visible5:false,//删除角色
      columns:[
        { title: `${translate('角色','lv.settings.account.role.columns1')}ID`, dataIndex: 'id', key: 'id'},
        { title: translate('角色名称','lv.settings.account.role.columns2'), dataIndex: 'name', key: 'name'},
        { title: translate('角色描述','lv.settings.account.role.columns3'), dataIndex: 'describe', key: 'describe',width:500},
        { title: translate('操作','lv.common.operate'), dataIndex: 'control', key: 'control',render:this.rolesControl.bind(this),width:250},
      ]
    }
    $('body').attr('style', 'overflow:hidden !important;');
  }


  rolesControl(text,record,index){
    return (
      <p className="role-control-groups">
        <a href="javascript:void(0)" onClick={this.openModifyRoleModal.bind(this,record)} className="control-look"><span>{translate('修改','lv.common.modify')}</span></a>
        <a href="javascript:void(0)" onClick={this.modifyDistributionRole.bind(this,record)} className="control-look"><span>{translate('分配权限','lv.settings.account.role.control.distribution')}</span></a>
        <a href="javascript:void(0)" onClick={this.deleteRole.bind(this,record)} className="control-look"><span>{translate('删除','lv.common.delete')}</span></a>
      </p>
    )
  }


  getDataSource(){
    var data = this.props.rolesList;
    if(!data.length){
      return [];
    }
    return data.map((item,key) =>{
      return {
        key:key,
        id:item.id,
        name:item.name,
        describe:item.desc,
        control:item
      }
    });
  }


  // 创建角色
  creatRoleModal(){
    this.setState({ visible:true });
  }


  // 取消角色
  onCancelRoleModal(){
    this.setState({ visible:false, });
  }


  // 分配权限
  openDistributionRole(){
    this.setState({ visible2:true, visible:false })
  }


  // 取消权限
  onCancelDistributionRole(){
    var _this = this;
    this.setState({
      visible2:false
    },function(){
      _this.props.clean_distributionPower();
    });
  }


  // 修改角色弹框
  openModifyRoleModal(record){
    this.props.upDateCurrentRole({
      id:record.id,
      name:record.name,
      desc:record.describe || ''
    });
    this.setState({
      visible3:true,
    })
  }


  // 取消修改弹框
  onCancelModifyRoleModal(){
    this.setState({ visible3:false })
  }


  // 修改分配权限弹框
  openModifyDistributionRole(){
    this.setState({ visible4:true })
  }


  // 取消修改分配权限弹框
  cancelModifyDistributionRole(){
    var _this = this;
    this.setState({
      visible4:false
    },function(){
        _this.props.clean_distributionPower();
    })
  }



  // 分配权限-click 请求数据
  modifyDistributionRole(record){
    let _this = this;
    axios.get(`${admin_prefix}${ROLES['res_list']}`, {
      params: {
        roleId: record.id
      }
    }).then(function(res){
      if(res.data.success){
        // 请求成功
        let idsArray = res.data.data.map((item)=>{
          return item.id;
        });
        var promise = _this.props.modifyDistributionPower({
          ids:idsArray,
          record:record,
        });
        promise.then(function(){
          _this.openModifyDistributionRole();
        })
      }else{
        // 请求失败
      }
    })
  }


  // 删除角色
  deleteRole(record){
    this.setState({
      visible5:true,
      currentRecord:record
    });
  }


  // 分页Change-EVENT
  onChangePage(page,pageSize){
    this.props.fetchAllRoles({
      ps:pageSize,
      pn:page
    });
  }


  componentDidMount(){
    this.props.fetchAllRoles({
      ps:this.props.pageSize,
      pn:1
    })
  }

  okDeleteConfirmModal(){
    let _this = this;
    let record = this.state.currentRecord;
    this.setState({
      visible5:false
    },function(){
      axios.get(`${admin_prefix}${ROLES['delete']}`, {params: {roleId:record.id}})
      .then(function(res){
        if(res.data.success){
          _this.props.fetchAllRoles({
            ps:_this.props.pageSize,
            pn:1
          });
          message.success(`${translate('删除成功','lv.common.delete.success')}!`);
        }else{
          // 删除失败
          message.warning(`${translate('该角色正在使用，不能被删除','lv.settings.account.role.message.warning.delete')}!`);
        }
      })
    });
  }

  hideDeleteConfirmModal(){
    this.setState({
      visible5:false
    });
  }

  getTable() {
    if(this.props.rolesList) {
      return (
        <Table
          loading={false}
          className="role-table"
          pagination={{
            defaultCurrent:this.props.currentPage,
            current:this.props.currentPage,
            pageSize: this.props.pageSize,
            onChange:this.onChangePage.bind(this),total:this.props.total
          }}
          dataSource={this.getDataSource()}
          columns={this.state.columns}
        />
      );
    }
  }

  render() {
    return (
        <div className="role-container">

          <div className="role-tips-advice">
            <div onClick={this.creatRoleModal.bind(this)}>
              <span className='i-icon'>&#xe674;</span>
              <span>{translate('创建角色','lv.settings.account.role.set')}</span>
            </div>
            <span style={{color: '#666666'}}>{`*${translate('当有新增的功能菜单，均要角色再次分配权限','lv.settings.account.role.authority')}!`}</span>
          </div>

          <div className="">
            {this.getTable()}
          </div>

          <CreateRole
            visible={this.state.visible}
            onCancel={this.onCancelRoleModal.bind(this)}
            openDistributionRole={this.openDistributionRole.bind(this)}
          />
          <ModifyRole
            visible={this.state.visible3}
            onCancel={this.onCancelModifyRoleModal.bind(this)}
          />
          <DistributionRole
            allPowerList={this.props.allPower}
            currentRole={this.props.currentRole}
            visible={this.state.visible2}
            onCancel={this.onCancelDistributionRole.bind(this)}
          />
          <ModifyDistributionRole
            allPowerList={this.props.allPower}
            visible={this.state.visible4}
            onCancel={this.cancelModifyDistributionRole.bind(this)}
          />

          <DeleteConfirm
            visible={this.state.visible5}
            title={`${translate('角色管理','lv.settings.account.role.info.manage')}`}
            contentText={`${translate('删除后，该信息将被清空并不可恢复。您确定要删除该记录吗','lv.settings.account.role.info.deleteconfirm')}？`}
            onOk={this.okDeleteConfirmModal.bind(this)}
            onCancel={this.hideDeleteConfirmModal.bind(this)}
            okText={`${translate('确认','lv.common.confirm')}`}
            cancelText={`${translate('取消','lv.common.cancel')}`}
          />

        </div>
    );
  }
}

function mapStateToProps(state) {
  let roles = state.get('roles').toJS();
  return {
    rolesList: roles.rolesList,
    allPower: roles.allPower,
    currentRole: roles.currentRole,
    currentPage: roles.currentPage,
    pageSize: roles.pageSize,
    total: roles.total,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    upDateCurrentRole:bindActionCreators(upDateCurrentRole, dispatch),
    fetchAllRoles: bindActionCreators(fetchAllRoles, dispatch),
    clean_distributionPower:bindActionCreators(clean_distributionPower, dispatch),
    modifyDistributionPower:bindActionCreators(modifyDistributionPower, dispatch),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Role);




// <div className="role-title">
//   <Breadcrumb.Item>账号管理</Breadcrumb.Item>
//   <Breadcrumb.Item>权限角色配置</Breadcrumb.Item>
// </div>


//   $('ul.checktree').find('.checkbox')
//     .removeClass('checked')
//     .siblings(':checkbox').prop('checked', false)
