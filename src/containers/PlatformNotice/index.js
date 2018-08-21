/**
 * @authors wangchen
 * @date    2018-07-06
 * @module  平台公告
 */
import React, { PureComponent ,Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {  Table, Form, Input, InputNumber, Radio,Layout,Select,DatePicker,Icon,Upload,Checkbox} from 'antd';
import Slider from 'components/Common/SliderBar';
import Button from 'components/Common/Button';
import Loading from 'components/Common/Loading';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import {NOTICE} from '../../constants/actionApi';
import Config from 'config';
import AddNotice from './SubPage/Add';
const url_prefix = Config.env[Config.scheme].prefix;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../actions/PlatformNotice/platformNotice';
const {Header, Content, Sider} = Layout;
import './style.scss';

const noticeStatus = {
  1: '正常',
  2: '失效'
};

class PlatformNotice extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showCheck: false,
      showUpdate: false,
      record: null,
      attachmentJson: null,
      selectedRowKeys:[],
      fileList: []
    }
  }


  componentDidMount() {
		let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
		$('.main-content').css('minHeight', clientHeight + 'px').css('maxHeight', clientHeight + 'px');
		$(window).resize(function () {
			let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
			$('.main-content').css('minHeight', clientHeight + 'px').css('maxHeight', clientHeight + 'px');
    });
    //this.props.fetchList({ps: 10, pn: 1});
  }
  
  getAttachmentColumns(){
    return [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        render: text => text || '暂无'
      },{
        title: '文件名称',
        dataIndex: 'attachmentName',
        key: 'attachmentName',
        render: text => text || '暂无'
      },{
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            this.state.showCheck ?
          <div style={{textAlign: 'center'}}>
            <span style={{cursor: 'pointer'}}>
            <a href={record.attachmentAddress} target="_blank"><Icon type="download" /></a>
            </span>
          </div> : 
          <div style={{textAlign: 'center'}}>
            <span onClick={this.deleteAttachment.bind(this,record)} style={{cursor: 'pointer'}}>
            <Icon type="delete" />
          </span>
          </div>  
        )
      }
    }
    ]
  }


  getColumns() {
    return [
      {
        title: '标题',
        dataIndex: 'titleName',
        key: 'titleName',
        render: (text,record) => {
          let mail = record.isRead === 1 ? <Icon type="mail" style={{color: 'red',fontSize:22,marginLeft:5,cursor: 'pointer'}} /> : null ;
          return <span>{text}{mail}</span>
        }
      },
      {
        title: '对象',
        dataIndex: 'objectTypeName',
        key: 'objectTypeName',
        render: text => text || '暂无'
      },
      {
        title: '重要程度',
        key: 'importantTypeName',
        dataIndex: 'importantTypeName',
        render: text => text || '暂无'
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: text => {
          let style = text === 2 ? {color: 'red'} : {};
          return <span style={style}>{noticeStatus[text]}</span>
        }
      },
      {
        title: '发布人',
        key: 'noticeTypeName',
        dataIndex: 'noticeTypeName',
        render: text => text || '暂无'
      },
      {
        title: '发布时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: text => text ? getDate(text, 'yyy-MM-DD HH:mm') : '暂无'
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (<div style={{textAlign: 'center'}}>
            <span onClick={this.checkBtn.bind(this,record)} style={{cursor: 'pointer', color: '#3AA6F5'}}>{`查看`}</span>
            {/* {record.purchase ? null : <span onClick={this.updateBtn.bind(this,record)} style={{cursor: 'pointer', color: '#3AA6F5',marginLeft: '10px'}}>{`修改`}</span>} */}
          </div>)
        }
      }
    ];
  }


  //删除公告信息附件
  deleteAttachment(record){
    let params = {id:record.id};
    this.props.deleteAttachment(params,() => {
      let param = {"noticeId":this.state.id};
    this.props.fetchAttachmentList(param); 
    }, () => {
      message.error('操作失败');
    });

  }

  //点击查看按钮
  checkBtn(record){
    this.setState({showCheck: true, id: record.id, record:record});
    let params = {"noticeId":record.id};
    this.props.fetchAttachmentList(params); 
    if(record.isRead == 1){
      let paramsId = {"ids":record.id.toString()}
      this.props.fetsetListisRead(paramsId,() => {
        this.props.fetchList({pn: 1, ps: 10});
      }, () => {
        message.error('操作失败');
      });
    } 
  }

  //点击修改按钮
  updateBtn(record){
    this.setState({showUpdate: true, id: record.id, record:record});
    let params = {"noticeId":record.id};
    this.props.fetchAttachmentList(params);  
  }


  //通过条件搜索公告信息
  searchNoticeList(){
    this.props.form.validateFields((err, val) => {
      if (err && Object.keys(err).length) {
        return;
      }
      if(val.RangePicker){
        let publishStartTime = val.RangePicker[0].format("YYYY-MM-DD");
        let publishEndTime = val.RangePicker[1].format("YYYY-MM-DD");
        val.publishStartTime = publishStartTime;
        val.publishEndTime = publishEndTime;
      }
      this.props.fetchList(val);
    });
  }


  //只看未读的消息
  readUnreadList(checkedValue){
    if(checkedValue.target.checked){
      let isRead = {'isRead': 1};
      this.props.fetchList(isRead);
    }else{
      this.props.fetchList({pn: 1, ps: 10});
    }
  }

  //批量设置为已读
  setAllListRead(){
    if(this.state.selectedRowKeys.length == 0){
      message.error('请选择合适的数据');
      return;
    }
    let selectedRowKeys = this.state.selectedRowKeys.join(",");
    if(selectedRowKeys){
      let params = {"ids":selectedRowKeys}
      this.props.fetsetListisRead(params,() => {
        this.setState({selectedRowKeys:null});
        this.props.fetchList({pn: 1, ps: 10});
      }, () => {
        message.error('操作失败');
      });
    }
  }

  //清空信息
  deleteList(){
    if(!this.state.selectedRowKeys){
      message.error('请选择合适的数据');
      return;
    }
    let selectedRowKeys = this.state.selectedRowKeys.join(",");
    if(selectedRowKeys){
      let params = {"ids":selectedRowKeys}
      this.props.fetsetListDelete(params,() => {
        this.setState({selectedRowKeys:null});
        this.props.fetchList();
      }, () => {
        message.error('操作失败');
      });
    }
  }




  pageChange(val) {
    let params = this.props.params;
    params.pn = val;
    this.props.fetchList && this.props.fetchList(params);
}

  //全选按钮
  selectAll() {
    if(this.state.selectedRowKeys.length == 0){
      this.setState({selectedRowKeys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]})
    }
    this.setState({
      selectedRowKeys: []
    })
  }

    //清空
    clearSearch() {
      this.props.form.resetFields();
      this.props.fetchList && this.props.fetchList({pn: 1, ps: 10})
    }

    cancelModal = () => {
      this.setState({showUpdate: false, id: null})
    }

    


  render() {
    const { getFieldDecorator } = this.props.form;
    const { attachmentList = [],list = [],total = 0, params ={}, loading=false, commonLoading=false} = this.props;
    const {selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys:selectedRowKeys
        })
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      selectedRowKeys
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };
    const formItemLayoutX = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    let record = this.state.record;
    let objectTypeNameArr = [];

    return (
      <Layout className="main-container">
        <Slider />
          <Layout className="main-content">
            <Content>
              <div className="platform-notice-content">
              <Loading display={loading || commonLoading ? 'block' : 'none'}/>
              <div className="notice-search-content">
              <div className="allOrders-search">
                <div className="search-items">
                    <Form onSubmit={this.handleSubmit}>
                      <div className="line-item normal">
                        <FormItem>
                          {
                            getFieldDecorator('titleName', {
                              initialValue:  '',
                            })(
                              <Input placeholder="标题"/>
                            )
                          }
                        </FormItem>
                      </div>
                      <div className="line-item normal">
                        <FormItem>
                          {
                            getFieldDecorator('importantTypeId', {
                              initialValue: '',
                            })(
                              <Select>
                                <Option value=''>{'重要程度'}</Option>
                                <Option value={1}>{'紧急'}</Option>
                                <Option value={2}>{'非紧急'}</Option>
                              </Select>
                            )
                          }
                        </FormItem>
                      </div>
                      <div className="line-item datapicker">
                        <FormItem>
                          {
                            getFieldDecorator('RangePicker', {
                              initialValue: '',
                            })(
                              <RangePicker/>
                            )
                          }
                        </FormItem>
                      </div>
                      <div className="line-item normal">
                        <FormItem>
                          {
                            getFieldDecorator('status', {
                              initialValue: '',
                            })(
                              <Select>
                                <Option value=''>{'信息状态'}</Option>
                                <Option value={1}>{'正常'}</Option>
                                <Option value={2}>{'失效'}</Option>
                              </Select>
                            )
                          }
                        </FormItem>
                      </div>
                    </Form>
                  </div>
                  <div className="search-btns">
                    <Button onClick={this.searchNoticeList.bind(this)} type="primary">{'搜索'}</Button>
                    <Button onClick={this.clearSearch.bind(this)}>{'清空'}</Button>
                  </div>
                </div>
              </div>
              <div className="cut-off-line"></div>
              <div className="line-btns">
                <a onClick={this.setAllListRead.bind(this)} className="btns"><i />{'批量设置为已读'}</a>
                <a  className="btns"><i /><Checkbox onChange={this.readUnreadList.bind(this)}></Checkbox>{'只看未读通知'}</a>
                {/* <a onClick={x => this.setState({showUpdate: true, id: null, record:null})}  className="btns"><i />{'新增通知'}</a> */}
              </div>
                <Table
                  rowSelection={rowSelection}
                  columns={this.getColumns()}
                  rowKey="index"
                  dataSource={list.map((it, idx) => Object.assign({}, it, {index: idx}))}   //数据源
                  locale={
                      {
                          emptyText:intl.get("lv.common.noData")
                      }
                  } 
                  pagination={{
                    current: params.pn || 1,
                    pageSize: params.ps || 10,
                    total: total || 0,
                    onChange:  this.pageChange.bind(this),
                    showTotal: (total, range) => `总共${total}条数据，当前为第${params.pn || 1}页`
                }}
                />
                {
                  this.state.showCheck && <Modal
                    visible={this.state.showCheck}
                    title="信息通知详情"
                    onOk={x => this.setState({showCheck: false, id: null})}
                    onCancel={x => this.setState({showCheck: false, id: null})}
                    width={630}
                  >
                  <div className="messageContent">
                    <div className="check-title">{'标题:'}<span>{record.titleName}</span></div>
                    <div className="check-content">
                      <div>{'通知类型:'}<span>{record.noticeTypeName}</span></div>
                      <div>{'对象:'}<span>{record.objectTypeName}</span></div>
                    </div>
                    <div className="check-content">
                      <div>{'重要程度:'}<span>{record.importantTypeName}</span></div>
                      <div>{'状态:'}<span>{noticeStatus[record.status]}</span></div>
                    </div>
                    <div className="notice-content">
                      <div className="notice-content-title">{'通知内容:'}</div>
                      <div>{record.noticeContent}</div>
                    </div>
                    <div className="attachment-title">{'相关附件:'}</div>
                    <Table
                      columns={this.getAttachmentColumns()}
                      rowKey="index"
                      dataSource={attachmentList.map((it, idx) => Object.assign({}, it, {index: idx}))}   //数据源
                      locale={
                          {
                              emptyText:intl.get("lv.common.noData")
                          }
                      } 
                      pagination={true}
                    />
                  </div>
                  </Modal>
                }
                <AddNotice
                visible = {this.state.showUpdate}
                record = {this.state.record}
                id = {this.state.id}
                onCancel = {this.cancelModal}
                />
              </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('platformNotice').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PlatformNotice));
