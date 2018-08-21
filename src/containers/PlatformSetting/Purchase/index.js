/**
 * @authors wangchen
 * @date    2018-07-16
 * @module  采购端设置
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Form, Input, InputNumber, Radio,Tabs ,Upload,Icon} from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
import PageMenuTable from './PageMenuTable';
import Templet from './Templet';
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/PlatformSetting/purchase';
import './style.scss';
import Config from 'config';

const url_prefix = Config.env[Config.scheme].prefix;
class Purchase extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      slideUpdate: false,
      showDelete: false,
      homePageDelete: false,
      previewVisible: false,
      previewImage: '',
      fileList: [{
      uid:-1,
      url:""
      }],
      imgFile:null,
      record:null
    }
  }

  componentDidMount() {
    this.props.fetchListSlide();
  }


  changeTabPane(activeKey) {
    if(activeKey == 2){
      this.props.fetchListHomePage();
    }
    if(activeKey == 3){
      this.props.fetchListTemplet();
    }

  }
  //首页轮播图表格
  getSlideColumns() {
    return [
      {
        title: '图片',
        key: 'id',
        dataIndex: 'id',
        render: (text, record)=> {
          return (
            <span><img style={{width:80,cursor:'pointer'}} onClick = {x => this.setState({previewVisible: true,previewImage:record.imgPath})} src={record.imgPath} /></span>
          )
        }
      },
      {
        title: '图片链接地址',
        dataIndex: 'link',
        key: 'link',
        render: text => {
          return(
            <span><a href={text} target="blank">{text}</a></span>
          )
        }
      },
      {
        title: '排序',
        dataIndex: 'weight',
        key: 'weight',
        render: text => text || '暂无'
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (<div style={{textAlign: 'center'}}>
            <span onClick={x => this.setState({slideUpdate: true, id: record.id, record,fileList:[{url:record.imgPath,uid:record.id}]})} style={{cursor: 'pointer', color: '#3AA6F5'}}>{`修改`}</span>
            <span onClick={x => this.setState({showDelete: true, id: record.id, record})} style={{cursor: 'pointer', color: '#3AA6F5',marginLeft: '10px'}}>{`删除`}</span>
          </div>)
        }
      }
    ];
  }


  // 新增/修改确定
  handleSubmit(callback) {
    this.props.form.validateFields((err, val) => {
      if (err && Object.keys(err).length) {
        callback && callback();
        return;
      }
      let id = this.state.id;
      if (id) {
        val.id = id;
      }
      let params = this.state.record;
      if(!this.state.record){
        params = {link:'',weight:'',imgPath:''}
      }
      params.link = val.link;
      params.weight = val.weight;
      if(this.state.imgFile){
        params.imgPath = this.state.imgFile.url;
      }
      this.props.updateListSlide(params, !!id, () => {
        callback && callback();
        this.setState({slideUpdate: false, id: null, record: null,imgFile:null});
        this.props.fetchListSlide();
      }, () => {
        callback && callback();
        message.error('操作失败');
      });
    });
  }

  // 删除轮播图确定
  deleteSlide(callback) {
    this.props.deleteListSlide({id: this.state.id}, () => {
      callback && callback();
      this.setState({showDelete: false, id: null});
      this.props.fetchListSlide();
    }, () => {
      callback && callback();
      message.error('操作失败');
      this.setState({showDelete: false, id: null});
    });
  }

  //上传图片
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  //图片上传
  handleChange = (info) => {
    this.setState({
      fileList: []
    })
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      this.setState({
        imgFile: info.file.response.data
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }



  //首页菜单名称图表
  getHomePageColumns() {
    return [
      {
        title: '菜单名称',
        key: 'name',
        dataIndex: 'name',
        render: text => text || '暂无'
      },
      {
        title: '菜单链接地址',
        dataIndex: 'link',
        key: 'link',
        render: text => {
          return(
            <span><a href={text} target="blank">{text}</a></span>
          )
        }
      },
      {
        title: '排序',
        dataIndex: 'weight',
        key: 'weight',
        render: text => text || '暂无'
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (<div style={{textAlign: 'center'}}>
            <span onClick={x => this.setState({slideUpdate: true, id: record.id, record})} style={{cursor: 'pointer', color: '#3AA6F5'}}>{`修改`}</span>
            <span onClick={x => this.setState({homePageDelete: true, id: record.id, record})} style={{cursor: 'pointer', color: '#3AA6F5',marginLeft: '10px'}}>{`删除`}</span>
          </div>)
        }
      }
    ];
  }
    // 删除首页菜单确定
    deleteHomePage(callback) {
      this.props.deleteListHomePage({id: this.state.id}, () => {
        callback && callback();
        this.setState({homePageDelete: false, id: null});
        this.props.fetchListSlide();
      }, () => {
        callback && callback();
        message.error('操作失败');
        this.setState({homePageDelete: false, id: null});
      });
    }



  render() {
    const { getFieldDecorator } = this.props.form;
    const {listSlide = [],listHomePage = [], total = 0, params, loading=false, commonLoading=false} = this.props;
    const { previewVisible, previewImage, fileList ,record} = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
     function getLogoUrl () {
      if (record) {
        return <div className='logo-upload'>
          <img className='logo-url' src={record.imgPath} style={{width:100,height:100}}/>
        </div>;
      }else{
        return <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
              </div>
      }
  }
    return (
      <div className="purchase-content">
        <Tabs   onChange={this.changeTabPane.bind(this)}>
          <TabPane tab="首页轮播图" key="1">
              <div className='opt-container'>
                <div className="opt-right">
                  <a href='#'  onClick={x => this.setState({slideUpdate: true, id: null, record:null})}>
                    <i className="i-icon">&#xe699;</i>
                    添加轮播图
                  </a>
                </div>
              </div>
              <Table
              columns={this.getSlideColumns()}
              rowKey="index"
              dataSource={listSlide.map((it, idx) => Object.assign({}, it, {index: idx}))}   //数据源
              locale={
                  {
                      emptyText:intl.get("lv.common.noData")
                  }
              } 
              pagination={false}
              />
          </TabPane>
          <TabPane tab="首页菜单名称" key="2">
              {/* <EditableTable dataSource={listHomePage.map((it, idx) => Object.assign({}, it, {index: idx}))}></EditableTable> */}
              <PageMenuTable/>
          </TabPane>
          <TabPane tab="首页模板设置" key="3">
              <Templet></Templet>
          </TabPane>
        </Tabs>
        {this.state.slideUpdate && <Modal
          visible={this.state.slideUpdate}
          title="首页轮播图"
          width={550}
          onOk={this.handleSubmit.bind(this)}
          onCancel={x => {
            this.setState({slideUpdate: false, id: null, record: null})}
          }
        >
          <Form>
            <div className="purchase-row">
              <FormItem
                {...formItemLayout}
                label="图片链接地址"
              >
                {
                  getFieldDecorator('link', {
                    initialValue: this.state.record ? this.state.record.link : '',
                    rules: [{required: true, message: '请填写图片链接地址'}]}
                  )(
                    <Input />
                  )
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="排序"
              >
                {
                  getFieldDecorator('weight', {
                    initialValue: this.state.record ? this.state.record.weight : '',
                    rules: [{required: true, message: '必填, 数字'}]
                  })(
                    <InputNumber max={100} min={0} precision={0} />
                  )
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="图片上传"
              >
                    <Upload
                      action={`${url_prefix}/mng/api/pimp/setting/index/uploadFile.json`}
                      listType="picture-card"
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {getLogoUrl()}
                      {/* { uploadButton} */}
                    </Upload>
                </FormItem>
            </div>
          </Form>
        </Modal>}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} onOk={this.handleCancel} width={800}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        {
          this.state.showDelete && <Modal
            visible={this.state.showDelete}
            title="提示"
            onOk={this.deleteSlide.bind(this)}
            onCancel={x => this.setState({showDelete: false, id: null})}
          >
          <p style={{textAlign: 'center'}}>{`你确定要删除此轮播图吗？`}</p>
          <p style={{textAlign: 'center'}}>{`删除后将不能恢复`}</p>
          </Modal>
        }

        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('purchase').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Purchase));
