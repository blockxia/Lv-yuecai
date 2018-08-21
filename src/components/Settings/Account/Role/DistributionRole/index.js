import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Modal, Form, Input, Icon, Row, Col, Checkbox, Button, Spin } from 'antd';
import message from 'components/Common/message';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const CheckboxGroup = Checkbox.Group;

import intl from 'react-intl-universal';

import {fetchAllRoles} from '../../../../../actions/Settings/account';
import { ROLES } from '../../../../../constants/actionApi.js';

import axios from 'api/axios.js';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;


import './style.scss';

const isEmptyObject = (obj) => {
  for (const name in obj) {
    return false;
  }
  return true;
}

class DistributionRole extends Component {

  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      visible: false,
      loading: false,
    };
    this.treeObj=null;
  }

  closeModal() {
    this.setState({
      visible: false,
    }, () => {
      this.props.onCancel && this.props.onCancel();
    });
  }

  getDom(){
     var resAllCheckeds = [];
     const list = this.props.allPowerList;
     for(var key in list){
       if(Object.prototype.toString.call(list[key].node)=="[object Object]"){
         resAllCheckeds.push( this.getMainCheckMenu(list[key]) )
       }
     }
    return (
      <li className="checkbox-list" id="checkbox-all">
        <div className="arrow"></div><div className="checkbox"></div>
        <input type="checkbox"/>
        <label>{intl.get('lv.common.all')}</label>
          <ul>
            {resAllCheckeds}
          </ul>
      </li>
    );
  }


  // 一级
  getMainCheckMenu(checkMenuItem){
    if(isEmptyObject(checkMenuItem.childMap)){
      return (
        <li className="checkbox-list" key={checkMenuItem.node.id}>
          <div className="arrow"></div><div className="checkbox"></div>
          <input type="checkbox" name="test" data-id={checkMenuItem.node.id} data-restype={checkMenuItem.node.resType} data-ss="1" data-checked={checkMenuItem.node.checked}/>
          <label>{checkMenuItem.node.resName}</label>
        </li>
      )
    }else{
      return (
        <li className="checkbox-list" key={checkMenuItem.node.id}>
          <div className="arrow"></div><div className="checkbox"></div>
          <input type="checkbox" name="test" data-id={checkMenuItem.node.id} data-restype={checkMenuItem.node.resType} data-checked={checkMenuItem.node.checked}/>
          <label>{checkMenuItem.node.resName}</label>
          <ul className="checkbox-wrap clearfix">
              {this.getKindChildMenu(checkMenuItem.childMap)}
          </ul>
        </li>
      )
    }
  }


  // 2级
  getKindChildMenu(childMenuItem){
    var tamp = []
    for(var key in childMenuItem){

      if(isEmptyObject(childMenuItem[key].childMap)){
         tamp.push(
          <li className="checkbox-wrap-list clearfix" key={childMenuItem[key].node.id}>
             <div className="arrow"></div><div className="checkbox"></div>
             <input type="checkbox" name="test" data-id={childMenuItem[key].node.id} data-restype={childMenuItem[key].node.resType} data-checked={childMenuItem[key].node.checked}/>
             <label>{childMenuItem[key].node.resName}</label>
          </li>
        )
      }else{
         tamp.push(
          <li className="checkbox-wrap-list clearfix" key={childMenuItem[key].node.id}>
            <div className="arrow"></div><div className="checkbox"></div>
            <input type="checkbox" name="test" data-id={childMenuItem[key].node.id} data-restype={childMenuItem[key].node.resType} data-checked={childMenuItem[key].node.checked}/>
            <label>{childMenuItem[key].node.resName}</label>
            <ul className="checkbox-wrap-group">
               {
                this.getCheckBoxGroup(childMenuItem[key].childMap)
               }
            </ul>
          </li>
        )
      }

    }
    return tamp;
  }


  getCheckBoxGroup(item){
   let options = [];
   for(var key in item){
     options.push(
         <li key={item[key].node.id}>
            <div className="arrow"></div><div className="checkbox"></div>
            <input type="checkbox" name="test" data-id={item[key].node.id} data-restype={item[key].node.resType} data-checked={item[key].node.checked}/>
            <label>{item[key].node.resName}</label>
         </li>
         );
   }
   return options;
 }

 savePowerRole(e){
  var checkedArray = [];
  var _this = this;
  var res1 = $('ul.checktree').find('.checked').next("input");
  var res2= $('ul.checktree').find('.half_checked').next("input");

  res1.each(function(index, el) {
    checkedArray.push($(this).attr("data-id"))
  });
  res2.each(function(index, el) {
    checkedArray.push($(this).attr("data-id"))
  });
  this.setState({
    loading: true,
  });
   axios.get(`${admin_prefix}${ROLES['bind_resource']}`, {
     params: {
       roleId: _this.props.currentRole.id,
       resIds: checkedArray.toString()
     }
   }).then(function(res){
    _this.setState({
      loading: false,
    });
     if(res.data.success){
       message.success(intl.get('lv.settings.account.role.createRole.success'));
       _this.props.fetchAllRoles({
         ps:_this.props.pageSize,
         pn:1
       })
       .then(function(){
         _this.props.onCancel && _this.props.onCancel();
       })
     }
   })
 }


 componentDidMount(){
    if(this.props.visible && $("ul.checktree").length){
      $("ul.checktree").checkTree();
    }
 }

 componentDidUpdate(){
   if(this.props.visible && $("ul.checktree").length){
      $("ul.checktree").checkTree();
   }
 }

 componentWillReceiveProps(nextProps) {
  if (nextProps.visible) {
    this.setState({
      visible: true,
    }, () => {
      setTimeout(() => {
        if (this.props.visible && $("ul.checktree").length) {
          $("ul.checktree").checkTree();
        }
      }, 10);
    });
  }
}

  render() {
    return (
      <div>
      {
        this.props.visible?
      <Modal
        width={860}
        visible={this.state.visible}
        title={intl.get('lv.settings.account.role.control.distribution')}
        footer={null}
        onCancel={this.closeModal.bind(this)}
        maskClosable={false}
        className="role-modal modal-title"
      >
        <div className="distribution-container">
          <div className="distribution-warpper">
            {/* <p className="title">{intl.get('lv.settings.account.role.modal.distribution')}</p> */}
            <div className="user-box">
              {/* <span className="user-tile">{intl.get('lv.settings.account.role.columns0')}</span> */}
              <span className="user-info-item">{intl.get('lv.settings.account.role.modal.roleId')}: {this.props.currentRole.id}</span>
              <span className="user-info-item">{intl.get('lv.settings.account.role.columns2')}: {this.props.currentRole.name}</span>
            </div>
            <div className="checktree-wrapper">
              <div className="tree-tile">{intl.get('lv.settings.account.role.modal.function.list')}
                {/* <span>{intl.get('lv.settings.account.role.modal.distribution')}</span> */}
              </div>
              <form>
                <ul className="checktree">
                {this.getDom()}
                </ul>
              </form>
            </div>
          </div>
        <p className="save_bt_sublimt"><Button type="primary" loading={this.state.loading} onClick={this.savePowerRole.bind(this)}>{intl.get('lv.common.saveSettings')}</Button></p>
        </div>
      </Modal>
      :''
        }
      </div>
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
    fetchAllRoles:bindActionCreators(fetchAllRoles, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps,)(DistributionRole);






// if(this.props.visible && $("ul.checktree").length){
 //  if(!this.treeObj){
    // $("ul.checktree").checkTree();
   //  this.treeObj=true;
 //  }
// }
