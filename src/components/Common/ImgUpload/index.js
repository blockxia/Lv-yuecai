/**
 * @authors wangqinqin
 * @date 2017-08-15
 * @module 前端通用组件->imgUpload
 */
import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
import intl from 'react-intl-universal';
import * as Tools from '../../../utils/tools.js';
import Config from 'config';
import Styles from './style.scss';

const url_prefix = Config.env[Config.scheme].prefix;
const windowHeight = $(window).height(),
  messageHeight = 110;

message.config({
  top: (windowHeight - messageHeight) / 2 - 50,
});
class ImgUpload extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      fileList: null,
    };
    // 设置多语言
    const currentLocale = Tools.getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../../locales/${currentLocale}.json`),
      },
    });
    // 解决第一次可以拖动，第二次拖动直接浏览器打开的问题，直接禁止拖曳上传
    document.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'none';
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    const nextPropsFileList = nextProps.fileList;
    let nextUrl = [],
      propsUrl = [];
    nextPropsFileList && nextPropsFileList.map((item) => {
      let index = $.inArray(item, nextUrl);
      if (index === -1) {
        nextUrl.push(item);
      }
    });
    let propsFileList = this.props.fileList;
    propsFileList && propsFileList.map((item) => {
      let index = $.inArray(item, propsUrl);
      if (index === -1) {
        propsUrl.push(item);
      }
    });
    if (((nextUrl && nextUrl.join(',')) == (propsUrl && propsUrl.join(','))) && nextState.fileList == null) {
      return false;
    }
    return true;
  }
  handleChange = ({ fileList }) => {
    const _this = this;
    const { onComplete, limit } = this.props;

    this.setState({ 
      fileList: fileList
    });

    fileList.filter((file) => {
      if (file.response) {
        if (file.response.success) {
          if (limit) {
            const image = new Image();
            image.src = file.response.data;
            image.onload = function () {
              if (image.width === limit.width && image.height === limit.height) {
                message.success(intl.get('lv.common.imgUploadSuccess'), 3);
                onComplete(file.response.data);
                return;
              }
              _this.setState({ fileList: [] });
              message.warn(`${intl.get('lv.common.imgUploadWrongSizeError')}${limit.width}*${limit.height}`, 3);
            };
          } else {
            onComplete(file.response.data);
          }
        } else {
          message.warn(file.response.msg);
        }
      }
    });
  }

  beforeUpload = (file) => {
    // const type = 'image/jpeg,image/png,image/jpg';
    // if (type.indexOf(file.type) < 0) {
    //   message.warn('请上传jpg、jpeg或png');
    //   return false;
    // }
    // const { maxMass } = this.props;
    // if (maxMass && maxMass.kg) {
    //   if (file && file.size > maxMass.kg) {
    //     message.warn(intl.get('lv.common.imgUploadWrongSizeBigError'));
    //     return false;
    //   }
    // }
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJPG) {
      message.warn(intl.get('lv.common.imgUploadWrongTypeError'));
      return false;
    }
    let maxSize = this.props.maxSize || 2;
    let isLt2M;
    if(this.props.isKb){
      isLt2M = file.size / 1024 / 1024 < maxSize / 1024;
    }else{
      isLt2M = file.size / 1024 / 1024 < maxSize;
    }
    if (!isLt2M) {
      if(this.props.isKb){
        message.warn(intl.get('lv.common.imgUploadWrongKBSizeBigError', {maxSize: maxSize}));                
      }else{
        message.warn(intl.get('lv.common.imgUploadWrongSizeBigError', {maxSize: maxSize}));        
      }
    }
    return isJPG && isLt2M;
  }
  renderInitUrl = (initUrl) => {
    if(this.props.type == 'single') {
      return <img src={initUrl} alt="" />;
    }else{
      const initUrlArr = initUrl.split(',');
      return initUrlArr && initUrlArr.length && initUrlArr.map((item, i) => {
        return (<img src={item} key={i} alt="" />);
      });
    }
  }
  render() {
    const fileList = this.state.fileList || this.props.fileList;
    const initUrlArr = this.props.initUrl && this.props.initUrl.split(',');
    const uploadButton = this.props.initUrl ? (
      <div className="init-url-container">
        <div className="initUrl">
          {this.renderInitUrl(this.props.initUrl)}
          {this.props.isShowText ? <span className="img-modify">{intl.get('account.modifyPicture')}</span> : ''}
        </div>
        {/* <div className="upload-region">
          {!this.props.account ?
            <div className="uploadPlus">
              <Icon type="plus" />
              <div className="ant-upload-text">{this.props.uploadText ? this.props.uploadText : intl.get('lv.common.imgUploadBtn')}</div>
            </div> :
            <div className="ant-upload-btn">
              <div className="ant-upload-text">{this.props.uploadText ? this.props.uploadText : intl.get('lv.common.imgUploadBtn')}</div>
            </div>
          }
        </div> */}
      </div>
    ) : (
      <div className="upload-region">
        {!this.props.account ?
          <div className="uploadPlus">
            <Icon type="plus" />
            <div className="ant-upload-text">{this.props.uploadText ? this.props.uploadText : intl.get('lv.common.imgUploadBtn')}</div>
          </div> :
          <div className="ant-upload-btn">
            <div className="ant-upload-text">{this.props.uploadText ? this.props.uploadText : intl.get('lv.common.imgUploadBtn')}</div>
          </div>
        }
      </div>
    );
    const fileListNum = this.props.fileListNum || 0;
    return (
      <div className={this.props.initUrl ? Styles.haveImg : null}>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={this.handleChange}
          onRemove={this.props.handleOnRemove}
          beforeUpload={this.beforeUpload}
          onPreview={this.props.handlePreview}
          action={this.props.action}
          accept="image/jpg,image/jpeg,image/png,image/bmp"
          showUploadList={this.props.showUploadList}

        >

          {fileList && fileList.length > fileListNum ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}


export default ImgUpload;
