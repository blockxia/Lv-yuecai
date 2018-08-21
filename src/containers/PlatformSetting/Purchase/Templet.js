/**
 * @authors wangchen
 * @date    2018-07-17
 * @module  采购端设置
 */
import React, { PureComponent } from 'react';
import { Table, Input, Button, Popconfirm, Form ,InputNumber,message ,Upload,Icon} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'components/Common/Modal';
import * as Actions from '../../../actions/PlatformSetting/purchase';
const FormItem = Form.Item;
import './style.scss';
import Config from 'config';
import { debug } from 'util';

const url_prefix = Config.env[Config.scheme].prefix;



class Templet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateShow: false,
      id: null,
      elem: null,
      imgFile: null,
      previewVisible: false,
      previewImage: '',
    }
  }

  componentDidMount(){
    this.props.fetchListTemplet();
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }


    //人气商品
    setPopularGoods = () => {
      let list = this.props.listTemplet;
      let fileList = null;
      if(list.length == 0){
        return;
      }
      let popularList = [];
      for(let i in list){
        if(list[i].type == 1){
          popularList.push(list[i]);
        }
      }
      popularList.shift();
      let popularGoodsContent = document.getElementById('popularGoodsContent');
      let width = null;
      if(popularGoodsContent){
        width = (popularGoodsContent.offsetWidth-45)/3;
      }
     let popularDiv =  popularList.map((elem,index)=>{
       let url = elem.imgPath;
       if(!url){
         url = "https://axhub.im/pro/2c176f905a592e7b/images/%E9%A6%96%E9%A1%B5/u2214.jpg";
       }
        return(
          <div className="Popular-goods-right" key={index+"popular"} style={{width:width}}>
            <Button className="goods-button" type="primary" size="small" onClick={x => this.setState({updateShow: true, id: elem.id, elem:elem })} >修改</Button>
            <img src={url}/>
            <div className="goods-name">{elem.name}</div>
            <div className="goods-price">
              <span className="new-price">￥{elem.salePrice}</span>
              <span className="old-price">¥{elem.marketPrice}</span>
            </div>
        </div>
        )
      })
        return popularDiv;
    }
  //人气商品 (第一件大商品)
  setPopularLargeGoods = () => {
    let list = this.props.listTemplet;
    if(list.length == 0){
      return;
    }
    let popularList = [];
    for(let i in list){
      if(list[i].type == 1){
        popularList.push(list[i]);
      }
    }
    let largeGoods = popularList[0];
     let url = largeGoods.imgPath;
     if(!url){
       url = "https://axhub.im/pro/2c176f905a592e7b/images/%E9%A6%96%E9%A1%B5/u2202.png";
     }
      return(
        <div className="Popular-goods-left">
        <Button className="goods-button" type="primary" size="small" onClick={x => this.setState({updateShow: true, id: largeGoods.id, elem:largeGoods})}>修改</Button>
        <img src={url}/>
        <div className="goods-name">{largeGoods.name}</div>
        <div className="goods-price">
          <span className="new-price">￥{largeGoods.salePrice}</span>
          <span className="old-price">¥{largeGoods.marketPrice}</span>
        </div>
      </div>
      )
  }


  //新品推荐商品
  setNewGoods = () => {
    let list = this.props.listTemplet;
    let fileList = null;
    if(list.length == 0){
      return;
    }
    let popularList = [];
    for(let i in list){
      if(list[i].type == 2){
        popularList.push(list[i]);
      }
    }
    let newGoodsContent = document.getElementById('newGoodsContent');
    popularList.shift();
    let width = null;
    if(newGoodsContent){
      width = (newGoodsContent.offsetWidth-75)/5;
    }
    let newDiv =  popularList.map((elem,index)=>{
    let url = elem.imgPath;
    if(!url){
      url = "https://axhub.im/pro/2c176f905a592e7b/images/%E9%A6%96%E9%A1%B5/u2214.jpg";
    }
    
      return(
        <div className="Popular-goods-right" key={index+"new"} style={{width:width}}>
          <Button className="goods-button" type="primary" size="small" onClick={x => this.setState({updateShow: true, id: elem.id, elem:elem})}>修改</Button>
          <img src={url}/>
          <div className="goods-name">{elem.name}</div>
          <div className="goods-price">
            <span className="new-price">￥{elem.salePrice}</span>
            <span className="old-price">¥{elem.marketPrice}</span>
          </div>
      </div>
      )
    })
      return newDiv;
  }

    //新品推荐 (第一件大商品)
    setNewLargeGoods = () => {
      let list = this.props.listTemplet;
      let fileList = null;
      if(list.length == 0){
        return;
      }
      let popularList = [];
      for(let i in list){
        if(list[i].type == 2){
          popularList.push(list[i]);
        }
      }
      let largeGoods = popularList[0];
       let url = largeGoods.imgPath;
       if(!url){
         url = "https://axhub.im/pro/2c176f905a592e7b/images/%E9%A6%96%E9%A1%B5/u2301.jpg";
       }
        return(
          <div className="new-goods-mid">
          <Button className="mid-goods-button" type="primary" size="small" onClick={x => this.setState({updateShow: true, id: largeGoods.id, elem:largeGoods})}>修改</Button>
            <img src={url}/>
          </div>
        )
    }


  //修改确定
  handleSubmit = (callback) => {
    this.props.form.validateFields((err, val) => {
      if (err && Object.keys(err).length) {
        callback && callback();
        return;
      }
      if(this.state.id){
        val.id = this.state.id;
      }
      if(this.state.imgFile){
        val.imgPath = this.state.imgFile.url;
      }else{
        val.imgPath = this.state.elem.imgPath;
      }
      this.props.updateTemplet(val, () => {
        callback && callback();
        this.setState({updateShow: false, id: null, elem: null,imgFile:null});
        this.props.fetchListTemplet();
      }, () => {
        callback && callback();
        message.error('操作失败');
      });
    });
  }

    //图片上传
    handleChange = (info) => {
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

    handleCancel = () => {
      this.setState({
        previewVisible: false,
        fileList: []
      })
    }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return(
      <div className="templet-content">
        <div className="Popular-goods">
          {this.setPopularLargeGoods()}
          <div className="Popular-goods-content" id="popularGoodsContent">
              {this.setPopularGoods()}
          </div>
        </div>
        {this.setNewLargeGoods()}
        <div className="new-goods-content" id="newGoodsContent">
              {this.setNewGoods()}
        </div>
        {this.state.updateShow && <Modal
          visible={this.state.updateShow}
          title="首页轮播图"
          width={550}
          onOk={this.handleSubmit}
          onCancel={x => {
            this.setState({updateShow: false, id: null, record: null})}
          }
        >
        <div className="purchase-row">
          <Form>
              <FormItem
                {...formItemLayout}
                label="商品名称"
              >
                {
                  getFieldDecorator('name', {
                    initialValue: this.state.elem ? this.state.elem.name : '',
                    rules: [{required: true, message: '请填写商品名称'}]}
                  )(
                    <Input />
                  )
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="销售价"
              >
                  {
                    getFieldDecorator('salePrice', {
                      initialValue: this.state.elem ? this.state.elem.salePrice : '',
                      rules: [{required: true, message: '必填, 数字'}]
                    })(
                      <InputNumber  min={0} precision={2} />
                    )
                  }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="市场价"
              >
                {
                  getFieldDecorator('marketPrice', {
                    initialValue: this.state.elem ? this.state.elem.marketPrice : '',
                    rules: [{required: true, message: '必填, 数字'}]
                  })(
                    <InputNumber min={0} precision={2} />
                  )
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="商品特点"
              >
                {
                  getFieldDecorator('feature', {
                    initialValue: this.state.elem ? this.state.elem.feature : ''
                  })(
                    <Input  />
                  )
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="链接地址"
              >
                {
                  getFieldDecorator('link', {
                    initialValue: this.state.elem ? this.state.elem.link : '',
                    rules: [{required: true, message: '请输入链接地址！'}]
                  })(
                    <Input  />
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
                      { uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} onOk={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </FormItem>
          </Form>
        </div>
        </Modal>}
      </div>
    )
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


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Templet));