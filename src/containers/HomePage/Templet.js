/**
 * @authors wangchen
 * @date    2018-07-17
 * @module  首页
 */
import React, { PureComponent } from 'react';
import { Table, Input, Button, Popconfirm, Form ,InputNumber,message ,Upload,Icon} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'components/Common/Modal';
import * as Actions from '../../actions/HomePage/homePage';
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
        width = (popularGoodsContent.offsetWidth)/3;
      }
     let popularDiv =  popularList.map((elem,index)=>{
       let url = elem.imgPath;
       if(!url){
         url = "https://axhub.im/pro/2c176f905a592e7b/images/%E9%A6%96%E9%A1%B5/u2214.jpg";
       }
        return(
          <div className="Popular-goods-right" key={index+"popular"} style={{width:width}}>
            <img src={url}/>
            <div className="goods-name">{elem.name}</div>
            <div className="goods-price">
                ￥{elem.salePrice}
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
          <img src={url}/>
          <div className="goods-name">{largeGoods.name}</div>
          <div className="goods-price">
            ￥{largeGoods.salePrice}
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
      width = (newGoodsContent.offsetWidth)/5;
    }
    let newDiv =  popularList.map((elem,index)=>{
    let url = elem.imgPath;
    if(!url){
      url = "https://axhub.im/pro/2c176f905a592e7b/images/%E9%A6%96%E9%A1%B5/u2214.jpg";
    }
    
      return(
        <div className="new-goods-right" key={index+"new"} style={{width:width}}>
          <img src={url}/>
          <div className="new-goods-message">
              <div className="goods-title-top">
                <div className="goods-name">{elem.name}</div>
                <div className="goods-price">￥{elem.salePrice}</div>
              </div>
              <div className="goods-title-bottom">
                  {elem.feature}
              </div>
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
            <img src={url}/>
          </div>
        )
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
        <div className="pupular-title">{'人气商品'}</div>
        <div className="Popular-goods">
          {this.setPopularLargeGoods()}
          <div className="Popular-goods-content" id="popularGoodsContent">
              {this.setPopularGoods()}
          </div>
        </div>
        <div className="pupular-title">{'新品推荐'}</div>
        {this.setNewLargeGoods()}
        <div className="new-goods-content" id="newGoodsContent">
              {this.setNewGoods()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('homePage').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Templet));