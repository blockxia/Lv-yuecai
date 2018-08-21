import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Modal, Form, Input, Icon, Row, Col, Checkbox, Button, Spin } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const CheckboxGroup = Checkbox.Group;

import './style.scss';

const isEmptyObject = (obj) => {
  for (const name in obj) {
    return false;
  }
  return true;
}


export default class DistributionRole extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {

    };
  }


  closeModal(){
    this.props.onCancel && this.props.onCancel();
  }


  getDom(){
    var resAllCheckeds = [];
    const list = this.props.allPowerList;
    for(var key in list){
      if(Object.prototype.toString.call(list[key].node)=="[object Object]"){
        resAllCheckeds.push( this.getMainCheckMenu(list[key]) )
      }
    }
    return resAllCheckeds;
  }

  // 一级
  getMainCheckMenu(checkMenuItem){
    if(isEmptyObject(checkMenuItem.childMap)){
      return (
        <div className="checkbox-list" key={checkMenuItem.node.id}>
          <Checkbox
            data_id={checkMenuItem.node.id}
            data_res-parent_code={checkMenuItem.node.resParentCode}
            data_resCode={checkMenuItem.node.resCode}
            value={checkMenuItem.node.id}
            onChange={this.onChangeTest.bind(this)}
            checked={checkMenuItem.node.checked}
            >
              {checkMenuItem.node.resName}
          </Checkbox>
        </div>
      )
    }else{
      return (
        <div className="checkbox-list" key={checkMenuItem.node.id}>
          <Checkbox
            value={checkMenuItem.node.id}
            data_id={checkMenuItem.node.id}
            data_res-parent_code={checkMenuItem.node.resParentCode}
            data_resCode={checkMenuItem.node.resCode}
            checked={checkMenuItem.node.checked}
            onChange={this.onChangeTest.bind(this)}
          >
              {checkMenuItem.node.resName}
          </Checkbox>
          <div className="checkbox-wrap" style={{background:'#ccc',paddingLeft:'22px'}}>
            {this.getKindChildMenu(checkMenuItem.childMap)}
          </div>
        </div>
      )
    }
  }

  // 2级
  getKindChildMenu(childMenuItem){
    var tamp = []
    for(var key in childMenuItem){

      if(isEmptyObject(childMenuItem[key].childMap)){
         tamp.push(
          <div className="checkbox-wrap-list" key={childMenuItem[key].node.id}>
            <Checkbox
              value={childMenuItem[key].node.id}
              data_id={childMenuItem[key].node.id}
              data_res-parent_code={childMenuItem[key].node.resParentCode}
              data_resCode={childMenuItem[key].node.resCode}
              checked={childMenuItem[key].node.checked}
              onChange={this.onChangeTest.bind(this)}
            >
              {childMenuItem[key].node.resName}
            </Checkbox>
          </div>
        )
      }else{
         tamp.push(
          <div className="checkbox-wrap-list" key={childMenuItem[key].node.id}>
            <Checkbox
              value={childMenuItem[key].node.id}
              data_id={childMenuItem[key].node.id}
              data_res-parent_code={childMenuItem[key].node.resParentCode}
              data_resCode={childMenuItem[key].node.resCode}
              checked={childMenuItem[key].node.checked}
              onChange={this.onChangeTest.bind(this)}
            >
              {childMenuItem[key].node.resName}
            </Checkbox>
            <div className="checkbox-wrap-group" style={{paddingLeft:'22px'}}>
               {
                this.getCheckBoxGroup(childMenuItem[key].childMap)
               }
            </div>
          </div>
        )
      }

    }
    return tamp;
  }

  getCheckBoxGroup(item){
    let options = [];
    for(var key in item){
      options.push(
          <Checkbox
            value={item[key].node.id}
            data_id={item[key].node.id}
            data_res-parent_cod={item[key].node.resParentCode}
            data_resCode={item[key].node.resCode}
            key={item[key].node.id}
            checked={item[key].node.checked}
            onChange={this.onChangeTest.bind(this)}
          >
            {item[key].node.resName}
          </Checkbox>);
    }
    return options;
    // for(var key in item){
    //   options.push({
    //     label:item[key].node.resName,
    //     value:item[key].node.id
    //   })
    // }
  }


onChangeTest(e){
  var domNode = e.target;
  // console.log(domNode);
  this.props.testChecked && this.props.testChecked({
    resCode:domNode.data_resCode,
    id:domNode.data_id,
    resParentCode:domNode.data_res_parent_code,
    value:domNode.value
  })

}

  onChange(checkedList){
    // console.log(checkedList);

  }
  onCheckAllChange(e){
    // console.log(1111);
  }


  savePowerRole(){
    alert(11)
  }

  render() {
    return (
        <Modal visible={this.props.visible} title="创建角色" footer={null} onCancel={this.closeModal.bind(this)}>
        <div className="">
          {this.getDom()}
        </div>
        <div className>
           <Button type="primary" onClick={this.savePowerRole.bind(this)}>保存配置</Button>
        </div>
        </Modal>
    );
  }
}
