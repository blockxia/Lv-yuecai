import React, {Component} from 'react';
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
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


var setting = {
  check: {
    enable: true
  },
  data: {
    simpleData: {
      enable: true
    }
  },
  view: {
    showIcon: false,
    showLine: false
  }
};




var zNodes = [
  {
    id:1,
    name: "父节点1",
    checked:true,
    open:true,
    children: [
      {
        id:2,
        name: "子节点1",
        open:true,
      }, {
        id:3,
        name: "子节点2",
        open:true,
        children: [
          {
            id:4,
            name: 'sss',
            name: 'aaa',
            open:true,
          }, {
            id:5,
            name: 111,
            open:true,
          }, {
            id:6,
            name: 222,
            open:true,
          }
        ]
      }
    ]
  },{
    id:7,
    name:"22222",
    open:true,
    children:[
      {name:11,id:111},
      {name:22,id:111}
    ]
  }
];

    // var zNodes =[
    // 			{ id:1, pId:0, name:"随意勾选 1", open:true},
    // 			{ id:11, pId:1, name:"随意勾选 1-1", open:true},
    // 			{ id:111, pId:11, name:"随意勾选 1-1-1"},
    // 			{ id:112, pId:11, name:"随意勾选 1-1-2"},
    // 			{ id:12, pId:1, name:"随意勾选 1-2", open:true},
    // 			{ id:121, pId:12, name:"随意勾选 1-2-1"},
    // 			{ id:122, pId:12, name:"随意勾选 1-2-2"},
    // 			{ id:2, pId:0, name:"随意勾选 2", checked:true, open:true},
    // 			{ id:21, pId:2, name:"随意勾选 2-1"},
    // 			{ id:22, pId:2, name:"随意勾选 2-2", open:true},
    // 			{ id:221, pId:22, name:"随意勾选 2-2-1", checked:true},
    // 			{ id:222, pId:22, name:"随意勾选 2-2-2"},
    // 			{ id:23, pId:2, name:"随意勾选 2-3"}
    // 		];




export default class DistributionRole extends Component {

  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {};
  }

  closeModal() {
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
        <li className="checkbox-list" key={checkMenuItem.node.id}>
          <input type="checkbox" name="test"/>
          <label>{checkMenuItem.node.resName}</label>
        </li>
      )
    }else{
      return (
        <li className="checkbox-list" key={checkMenuItem.node.id}>
          <input type="checkbox" name="test"/>
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
             <input type="checkbox" name="test" />
             <label>{childMenuItem[key].node.resName}</label>
          </li>
        )
      }else{
         tamp.push(
          <li className="checkbox-wrap-list clearfix" key={childMenuItem[key].node.id}>
            <input type="checkbox" name="test" />
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
            <input type="checkbox" name="test"/>
            <label>{item[key].node.resName}</label>
         </li>
         );
   }
   return options;
 }


 componentDidMount(){
    // $("ul.checktree").checkTree();
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
			// $.fn.zTree.getZTreeObj("treeDemo")
 }

 componentDidUpdate(){
    //  $("ul.checktree").checkTree();
       $.fn.zTree.init($("#treeDemo"), setting, zNodes);
      // $.fn.zTree.getZTreeObj("treeDemo")
 }


  render() {
    return (
      <Modal visible={this.props.visible} title="创建角色" footer={null} onCancel={this.closeModal.bind(this)}>
        <div className="distribution-container">
        <h3>分配角色</h3>
        <p>选中复选框即可赋予相应权限，取消选中则取消相应的权限</p>
        <h1>Checkbox 勾选操作</h1>
<h6>[ 文件路径: excheck/checkbox.html ]</h6>
<div className="content_wrap">
	<div className="zTreeDemoBackground left">
		<ul id="treeDemo" className="ztree"></ul>
	</div>

</div>
        <p> <Button type="primary">Primary</Button> </p>
        </div>
      </Modal>
    );
  }
}
