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
import {NOTICE} from '../../../constants/actionApi';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/PlatformNotice/platformNotice';
const {Header, Content, Sider} = Layout;
import '../style.scss';


class AddNotice extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fileList: []
    }
  }


  componentDidMount() {
		
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
  


  //删除公告信息附件
  deleteAttachment(record){
    let params = {id:record.id};
    this.props.deleteAttachment(params,() => {
      let param = {"noticeId":this.props.record.id};
    this.props.fetchAttachmentList(param); 
    }, () => {
      message.error('操作失败');
    });

  }

  //新增、修改信息公告
  handleUpdate(callback){
    this.props.form.validateFields((err, val) => {
      if (err && Object.keys(err).length) {
        callback && callback();
        return;
      }
      let id = this.props.id;
      let params = this.props.record || {};
      let fields = val;
      params.titleName = fields.update_titleName;
      params.noticeTypeName = fields.update_noticeTypeName;
      params.importantTypeName = fields.update_importantTypeName;
      params.status = fields.update_status;
      params.noticeContent = fields.update_noticeContent;
      if(fields.update_objectTypeName.length>0){
        params.objectTypeName = fields.update_objectTypeName.join(",");
      }else{
        params.objectTypeName = "";
      }
      switch(fields.update_noticeTypeName){
        case "公司公告":
          params.noticeTypeId = 1;
            break;
        case "业务通知":
          params.noticeTypeId = 2;
            break;  
        case "系统信息":
          params.noticeTypeId = 3;
            break;    
            default:
      }
      switch(fields.update_importantTypeName){
        case "紧急":
          params.importantTypeId = 1;
            break;
        case "重要":
          params.importantTypeId = 2;
            break;  
        case "一般":
          params.importantTypeId = 3;
            break;  
            default:
      }
      if(this.state.fileList.length>0){
          let fileList = this.state.fileList;
          let attachmentContent = [];
          for(let i in fileList){
            if(fileList[i].response.msg == "success"){
              let it = fileList[i].response.data;
              attachmentContent.push({id:'',attachmentName: it.fileName, attachmentAddress: it.url,createTimeStr:it.createTime,operatorId:it.operatorId,operatorName:it.operatorName})
            }
          }
        params.attachmentContent = JSON.stringify(attachmentContent);
      }
      this.props.fetchUpdateList(params, !!id, () => {
        callback && callback();
        this.setState({attachmentJson:null,fileList:[]});
        this.props.onCancel()
        this.props.fetchList(this.props.params);
      }, () => {
        callback && callback();
        this.setState({fileList:[]});
        message.error('操作失败');
      });
    });    
  }

  //上传文件
  fileChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      this.setState({
        fileList: info.file.response.data
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }




  render() {
    const { getFieldDecorator } = this.props.form;
    const { attachmentList = [],list = [],total = 0, params ={}, loading=false, commonLoading=false,visible } = this.props;
    const {selectedRowKeys } = this.state;
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
    let record = this.props.record;
    let props =  {
      name: 'file',
      action: url_prefix + NOTICE.UPLOAD_ATTACHEMENT,
      headers: {
        authorization: 'authorization-text',
      },
      onChange:(info) => {
        if (info.file.status !== 'uploading') {
          this.setState({
            fileList: info.fileList
          })
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 上传成功`);
          this.setState({
            fileList: info.fileList
          })
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      },
    };

    return (   
          <div>       
                {
                  visible && <Modal
                    visible={visible}
                    title="新增信息通知"
                    onOk={this.handleUpdate.bind(this)}
                    onCancel={x => {
                      this.props.onCancel();
                    }}
                    width={630}
                  >
                  <div className="messageContent">
                  <Form>
                      <FormItem label="标题" {...formItemLayout}>
                        {
                          getFieldDecorator('update_titleName', {
                            rules:[{
                              required: true, message: '请输入标题!',
                            }],
                            initialValue:this.props.record ? this.props.record.titleName : '',
                          },
                        )(
                            <Input  style={{width:500 ,marginLeft:20}}/>
                          )
                        }
                      </FormItem>
                      <div className="row">
                        <span className='row-title'>{`类型：`}</span>
                        <FormItem className="input-form">
                          {
                            getFieldDecorator('update_noticeTypeName', {
                              initialValue: this.props.record ? this.props.record.noticeTypeName : '',
                              rules: [{ required: true, message: '请选择公告类型!' }],
                            },
                            )(
                                  <Select style={{width: 150}}>
                                    <Option value=''>{'请选择公告类型'}</Option>
                                    <Option value='公司公告'>{'公司公告'}</Option>
                                    <Option value='业务通知'>{'业务通知'}</Option>
                                    <Option value='系统信息'>{'系统信息'}</Option>
                                  </Select>
                            )
                          }
                        </FormItem>
                        <span className='row-title'>{`对象：`}</span>
                        <FormItem className="input-form">
                          {
                            getFieldDecorator('update_objectTypeName', {
                              initialValue: this.props.record ? this.props.record.objectTypeName.split(",") : [],
                              rules: [{ required: true, message: '请选择对象!' }],
                            }
                            )(
                              <CheckboxGroup >
                                <Checkbox value={'供应商'}>{`供应商`}</Checkbox>
                                <Checkbox value={'采购商'}>{`采购商`}</Checkbox>
                              </CheckboxGroup>
                            )
                          }
                        </FormItem>
                      </div>
                      <div className="row">
                        <span className='row-title'>{`重要程度:`}</span>
                        <FormItem className="input-form">
                          {
                            getFieldDecorator('update_importantTypeName', {
                              rules:[{
                                required: true, message: '请选择重要程度!',
                              }],
                              initialValue: this.props.record ? this.props.record.importantTypeName : ''}
                            )(
                                  <Select style={{width: 150}}>
                                    <Option value=''>{'请选择重要程度'}</Option>
                                    <Option value='紧急'>{'紧急'}</Option>
                                    <Option value='重要'>{'重要'}</Option>
                                    <Option value='一般'>{'一般'}</Option>
                                  </Select>
                            )
                          }
                        </FormItem>
                        <span className='row-title'>{`状态：`}</span>
                        <FormItem className="input-form">
                          {
                            getFieldDecorator('update_status', {
                              rules:[{
                                required: true, message: '请选择状态!',
                              }],
                              initialValue: this.props.record ? this.props.record.status : ''}
                            )(
                              <Select style={{width: 150}}>
                                    <Option value=''>{'请选择状态'}</Option>
                                    <Option value={1}>{'正常'}</Option>
                                    <Option value={2}>{'失效'}</Option>
                              </Select>
                            )
                          }
                        </FormItem>
                      </div>
                      <div className="row">
                        <span className='row-title'>{`内容:`}</span>
                      <FormItem  {...formItemLayout}>
                        {
                          getFieldDecorator('update_noticeContent', {
                            rules:[{
                              required: true, message: '请输入内容!',
                            }],
                            initialValue:this.props.record ? this.props.record.noticeContent : '',
                          })(
                            <TextArea style={{width: 500,height:200}} />
                          )
                        }
                      </FormItem>
                    </div>
                          <Upload
                          {...props}>
                          <Button >上传文件</Button>
                          </Upload>
                  </Form>
                  <div className="attachment-title">{'相关附件'}</div>
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
              </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddNotice));
