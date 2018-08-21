/**
 * @authors wangchen
 * @date    2018-07-11
 * @module  商品类目
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Form, Input, InputNumber, Radio ,Select } from 'antd';
import Loading from 'components/Common/Loading';
import Modal from 'components/Common/Modal';
import Button from 'components/Common/Button';
import message from 'components/Common/message';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/Commodity/commodityCategory';
import './style.scss';
import storage from 'utils/storage';

const commodityStatus = {
  1: '启用',
  2: '停用'
};
class CommodityCategory extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showUpdate: false,
      showCreate: false,
      showDetermine: false,
      parentId: null,
      data: [],
      defaultExpandAllRows:true,
      firstName: null,
      secondName: null,
      secondSelect: null,
      line: []
    }
    this.getUpdateColumns = this.getUpdateColumns.bind(this);
    this.lineChange = this.lineChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchList();
    this.getCategorySelect();
    this.getCategorySecondSelect();
  }

  getColumns() {
    return [
      {
        title: '类目名称',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '类目等级',
        dataIndex: 'depth',
        key: 'depth',
        width: '15%',
        render: text => text || '暂无'
      },
      {
        title: '排序',
        dataIndex: 'sequence',
        key: 'sequence',
        width: '15%',
        sorter: (a, b) => a.sequence - b.sequence,
        sortOrder: true,
        render: text => text || '暂无'
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        width: '15%',
        render: (text, row) => {
          let style = text === 2 ? {color: 'red'} : {};
          return <span style={style}>{commodityStatus[text]}</span>
        }
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        width: '15%',
        render: (text, record) => {
          return (<div style={{textAlign: 'center'}}>
            <span onClick={this.updateCategory.bind(this,record)} style={{cursor: 'pointer', color: '#3AA6F5'}}>{`修改`}</span>
          </div>)
        }
      }
    ];
  }




  //将数据合并成树形结构
  toTree(data) {
    data.forEach((item) => {
        delete item.children;
    });
    let map = {};
    data.forEach((item) => {
        map[item.id] = item;
    });
    let val = [];
    data.forEach((item) => {
        let parent = map[item.parentId];
        if (parent) {
            (parent.children || ( parent.children = [] )).push(item);
        } else {
            val.push(item);
        }
    });
    return val;
  }

  //修改数据catalogResults为children
  getTreeData(arr){
    for(let i in arr){
      arr[i].children = arr[i].catalogResults;
      if(arr[i].children){
        this.getTreeData(arr[i].children);
      }
    }
    return arr;
  }

  //打开创建类目框
  createCommodityCategory() {
    this.setState({
      showCreate: true,
    })
  }


  //点击修改按钮(获取一级类目，二级类目名称)
  updateCategory(record){
    this.setState({showUpdate: true, id: record.id, record});
    if(record.depth == 1){
      this.setState({firstName:record.name,secondSelect: false});
    }
    if(record.depth == 2){
      let idArr = record.path.split("/");
      let id = Number(idArr[1]);
      for(let i in this.props.parentData){
        if(id == this.props.parentData[i].id){
          this.setState({firstName:this.props.parentData[i].name})
        }
      }
    }
    if(record.depth == 3){
      let idArr = record.path.split("/");
      let id = Number(idArr[1]);
      let Id = Number(idArr[2]);
      for(let i in this.props.parentData){
        if(id == this.props.parentData[i].id){
          this.setState({firstName:this.props.parentData[i].name})
        }
      }
      for(let i in this.props.secondData){
        if(Id == this.props.secondData[i].id){
          this.setState({secondName:this.props.secondData[i].name,secondSelect:true})
        }
      }
    }
  }

  //修改确定
  handleSubmit(callback) {
    this.props.form.validateFields((err, val) => {
      if (err && Object.keys(err).length) {
        return;
      }
      let id = this.state.id;
      if (id) {
        val.id = id;
      }
      let params = this.state.record;
      params.name = val.name;
      params.status = val.status;
      params.sequence = val.sequence;
      this.props.updateCommodity(params, () => {
        callback && callback();
        this.setState({showUpdate: false, id: null, record: null,firstName:null,secondName:null,secondSelect:false});
        this.props.fetchList();
      }, () => {
        callback && callback();
        message.error('操作失败');
      });
    });
  }

  //新增类目确定按钮(打开设置框)
  createCategorySubmit(callback){
    this.props.form.validateFields((err, val) => {
      if (err && Object.keys(err).length) {
        return;
      }
      let {line, record} = this.state;
      if(line.length == 0){
        message.warn('请您增加类目数据! ');
        callback && callback();
        return;
      }
      let isEmpty = line.some(it => !it.name || !it.sequence);
      if (isEmpty) {
          message.warn('有必填项未填写！');
          this.setState({
              shouldCheck: true
          });
          callback && callback();
          return;
      }
      let param = null;
      let groupId = storage.get('groupId') || 1;
      let groupName = storage.get('groupName') || '旅悦集团';
      if(!val.firstName && !val.secondName) {
       param = line.map(it => Object.assign({}, {
          groupId,
          groupName,
          name: it.name,
          sequence: it.sequence,
          path: "/",
          depth:1,
          parentId:0,
          status:1
        }));
      }
      if(val.firstName && !val.secondName) {
        let path = "/"+val.firstName+"/"
        param = line.map(it => Object.assign({}, {
           groupId,
           groupName,
           name: it.name,
           sequence: it.sequence,
           path: path,
           depth:2,
           parentId:val.firstName,
           status:1
         }));
       }
       if(val.firstName && val.secondName) {
        let path = "/"+val.firstName+"/"+val.secondName+"/"
        param = line.map(it => Object.assign({}, {
           groupId,
           groupName,
           name: it.name,
           sequence: it.sequence,
           path: path,
           depth:3,
           parentId:val.secondName,
           status:1
         }));
       }
      this.setState({
        showDetermine: true,
        param
      })
      
    })
  }


  handleDetermine(callback) {
    if(this.state.param){
        this.props.addCommodity(this.state.param[0], () => {
          message.success('操作成功');
          callback && callback();
          this.setState({
              showDetermine: false, 
              line: [], 
              param:null
          });
          setTimeout(x => {
              this.props.fetchList && this.props.fetchList();
          }, 1000);
      }, () => {
          message.warn('操作失败');
          callback && callback();
      });
    }
  }


  //获取商品类目分级
  getCategorySelect(){
    let params = {"grade":1};
    this.props.queryCommodityParent(params);
  }
  getCategorySecondSelect(){
    let params = {"grade":2};
    this.props.queryCommoditySecond(params);
  }
  // 删除确认
  handleDelete(callback) {
    this.props.deletePrice({id: this.state.id}, () => {
      callback && callback();
      this.setState({showDelete: false, id: null});
      this.props.fetchList();
    }, () => {
      callback && callback();
      message.error('操作失败');
      this.setState({showDelete: false, id: null});
    });
  }


  //构建一级类目下拉框
  parentOption(){
    let option = null;
    if(this.props.parentData.length>0){
      option = this.props.parentData.map((elem,index) => {
        return(
          <Option key = {index} value = {elem.id}>{elem.name}</Option>
        )
      })
        return option;
    }
  }

  //构建二级类目下拉框
  secondOption = () => {
    let optionArr = [];
    let option = null;
    if(this.props.secondData.length>0 && this.state.parentId){
      for(let i in this.props.secondData){
        if(this.state.parentId == this.props.secondData[i].parentId){
          optionArr.push(this.props.secondData[i]);
        }
      }
      if(optionArr.length>0){
        option = optionArr.map((elem,index) => {
          return(
            <Option key={index} value = {elem.id}>{elem.name}</Option>
          )
        })
      }
    }
    return option;
  }

    //构建二级类目下拉框(修改页面)
    getSecondOption = () => {
      let optionArr = [];
      let option = null;
      let record = this.state.record;
      if(this.props.secondData.length>0){
          option = this.props.secondData.map((elem,index) => {
            return(
              <Option key={index} value = {elem.id}>{elem.name}</Option>
            )
          })
      }
      return option;
    }

  //点击一级类目下拉框，存储数据
  setParentData(elem) {
    this.setState({parentId:elem})
  }


  //点击按钮，新增类目信息
  addNewTableData() {
    let data = {"name":"类目名称","sequence":1};
    let arr = this.state.data;
    let newArr = arr.push(data);
    this.setState({
      data: newArr
    })
  }

  setExpandedRowKeys(){
    this.setState({
      defaultExpandedRowKeys:[]
    })
    this.props.fetchList();
  }

  getUpdateColumns() {
    return [
        {
            key: 'value',
            title: <span className="required">{'类目名称'}</span>,
            dataIndex: 'name',
            width: '50%',
            render: (text, record, index) => {
              return <Input className={!text && this.state.shouldCheck ? 'error' : ''} value={text || ''} onChange={e => this.lineChange(index, 'name', e.target.value)} onBlur={e => this.lineChange(index, 'name', e.target.value, true)} />
            }
        },
        {
            key: 'sequence',
            title: <span className="required">{'排序'}</span>,
            dataIndex: 'sequence',
            width: '30%',
            render: (text, record, index) => {
              return <InputNumber 
                  className={!text && this.state.shouldCheck ? 'error' : ''}
                  value ={text || ''} 
                  precision={0} 
                  min={1}
                  max={99}
                  onChange={this.lineChange.bind(this, index, 'sequence')}/>
          }
        },
        {
            key: 'id',
            title: '操作',
            dataIndex: 'id',
            render: (text, record, index) => text ? null : <a onClick={this.lineDelete.bind(this, index)}>{'取消'}</a> 
        }
    ];
  }

    // 属性值 删除行
    lineDelete(idx) {
      let line = this.state.line;
      line.splice(idx, 1);
      this.setState({line: [...line]});
  }
    // 属性值 行内修改
    lineChange(idx, key, value, isTrim) {
        let line = this.state.line;
        line[idx][key] = isTrim ? value.trim() : value;
        this.setState({line: [...line]});
    }

      // 属性值 添加行
    addLine() {
        let line = this.state.line;
        line.push({});
        this.setState({line: [...line]});
    }


  render() {
    const { getFieldDecorator } = this.props.form;
    const {defaultExpandAllRows} = this.state;
    const {list = [], total = 0, params, loading=false, commonLoading=false} = this.props;
    let listData = this.getTreeData(list);
    return (
      <div className="commodity-category-body">
        <div className='opt-container'>
          <div className="opt-right">
            <a href='#' onClick={this.createCommodityCategory.bind(this)}>
              <i className="i-icon">&#xe699;</i>
              新增类目
            </a>
          </div>
        </div>
        {/* <Button onClick={this.setExpandedRowKeys.bind(this)}>展开类目</Button>
        <Button>收起类目</Button>  */}
        <Table
          columns={this.getColumns()}
          rowKey={record => record.id}
          dataSource={listData.map((it, idx) => Object.assign({}, it, {index: idx}))}   //数据源
          locale={
              {
                  emptyText:intl.get("lv.common.noData")
              }
          } 
          pagination={true}
          indentSize={40}
          onChange={this.handleChange}
          defaultExpandedRowKeys={[1,2,3,4]}
        />
        {this.state.showUpdate && <Modal
          visible={this.state.showUpdate}
          title="类目修改"
          width={550}
          onOk={this.handleSubmit.bind(this)}
          onCancel={x => {
            this.setState({showUpdate: false, id: null, record: null,firstName:null,secondName:null,secondSelect:false})}
          }
        >
        <div className="commodity-category-body">
          <Form>
            <div className="row">
              <span className='row-title'>{`上级类目：`}</span>
              <FormItem className="name">
                {
                  getFieldDecorator('parent', {
                    initialValue: this.state.firstName ? this.state.firstName : ''}
                  )(
                        <Select disabled>
                          <Option value=''>选择一级类目</Option>
                          {this.parentOption()}
                        </Select>
                  )
                }
              </FormItem>
              {this.state.secondSelect ? <FormItem className="name">
                {
                  getFieldDecorator('parentId', {
                    initialValue: this.state.secondName ? this.state.secondName : ''}
                  )(
                        <Select disabled>
                          <Option value=''>选择二级类目</Option>
                          {this.getSecondOption()}
                        </Select>
                  )
                }
              </FormItem> : ''}
            </div>
            <div className="row">
              <span className="row-title">{`类目名称：`}</span>
                <FormItem className="input-name">
                {
                  getFieldDecorator('name', {
                    initialValue: this.state.record ? this.state.record.name : '',
                    rules: [{required: true, message: '必填, 类目名称'}]
                  })(
                    <Input/>
                  )
                }
                </FormItem>
            </div>
            <div className="row">
                <span className="row-title">{`状态：`}</span>
                <FormItem>
                  {
                    getFieldDecorator('status', {
                      initialValue: this.state.record ? this.state.record.status : 1,
                      rules: [{required: true, message: '请选择价格状态'}]
                    })(
                      <RadioGroup >
                        <Radio value={1}>{`启用`}</Radio>
                        <Radio disabled={this.state.record && this.state.record.purchase} value={2}>{`停用`}</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
            </div>
            <div className="row">
              <span className="row-title">{`排序：`}</span>
                <FormItem className="name">
                {
                  getFieldDecorator('sequence', {
                    initialValue: this.state.record ? this.state.record.sequence : '',
                    rules: [{required: true, message: '必填, 数字'}]
                  })(
                    <InputNumber min={1} max={100} precision={0}/>
                  )
                }
                </FormItem>
            </div>
          </Form>
        </div>
        </Modal>}

        {this.state.showCreate && <Modal
          visible={this.state.showCreate}
          title="类目新增"
          width={550}
          onOk={this.createCategorySubmit.bind(this)}
          onCancel={x => {
            this.setState({showCreate: false, id: null, record: null,line: []})}
          }
        >
        <div className="commodity-category-body">
          <Form>
            <div className="row">
              <span className='row-title'>{`上级类目：`}</span>
              <FormItem className="name">
                {
                  getFieldDecorator('firstName', {
                    initialValue: this.state.record ? this.state.record.name : ''}
                  )(
                        <Select onChange={this.setParentData.bind(this)}>
                          <Option value=''>选择一级类目</Option>
                          {this.parentOption()}
                        </Select>
                  )
                }
              </FormItem>
              <FormItem className="name">
                {
                  getFieldDecorator('secondName', {
                    initialValue: this.state.record ? this.state.record.name : ''}
                  )(
                        <Select>
                          <Option value=''>选择二级类目</Option>
                          {this.secondOption()}
                        </Select>
                  )
                }
              </FormItem>
            </div>
            <div className="attribute-body">
              <div className="line-btns">
                  <span className="btns">
                      <a onClick={this.addLine.bind(this)}>{'增加属性值'}</a>
                  </span>
              </div>
              <Table 
                  bordered
                  scroll={{y: 210}}
                  columns={this.getUpdateColumns()}
                  dataSource={this.state.line.map((it, idx) => Object.assign({}, it, {key: idx}))}
                  pagination={false}
              />
          </div>

          </Form>
        </div>
        </Modal>}
        {
          this.state.showDetermine && <Modal
            visible={this.state.showDetermine}
            title="提示"
            onOk={this.handleDetermine.bind(this)}
            onCancel={x => this.setState({showDetermine: false,showCreate: false,id: null})}
          >
          <p style={{textAlign: 'center'}}>{`你确定要增加类目吗？增加后将不可删除。`}</p>
          </Modal>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('commodityCategory').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CommodityCategory));
