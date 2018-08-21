import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Upload, Select, Form, Input, Radio, Popover, Modal } from 'antd';
import Table from "components/Common/Table";
import * as Actions from '../../../../actions/Commodity/brand';
import message from 'components/Common/message';
import Loading from 'components/Common/Loading';
import Config from 'config';
import './style.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const url_prefix = Config.env[Config.scheme].prefix;
class EditBrand extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editBrand: false,
      isEdit: false,
      file: {}
    }
  }

  componentDidMount() {
    // this.props.fetchList({pageSize: 10, pageNumber: 1});
    // this.getCommodityBrand();
  }
  editBrandCancel = () => {
    this.props.editBrandCancel();
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { name, description, status, sequence } = values;
        let file = this.state.file;
        let logoUrl = "";
        if (file && file.response && file.response.data.url) {
          logoUrl = file.response.data.url;
        }
        let creator = this.props.userInfo && this.props.userInfo.name || '张威';
        let reqParam = { name, description, status, sequence, creator, creator, logoUrl };
        if (this.props.isEdit) {
          let brandData = this.props.brandData;
          if (logoUrl == "") {
            reqParam.logoUrl = brandData.logoUrl;
          }
          reqParam.id = brandData.id;
          this.props.updateBrand(reqParam, () => {
            message.success('更新成功！');
            this.props.editBrandCancel();
            this.props.getCommodityBrand();
          }, (msg) => {
            message.warn(msg);
          });
        } else {
          this.props.createBrand(reqParam, () => {
            message.success('添加成功！');
            this.props.editBrandCancel();
            this.props.getCommodityBrand();
          }, (msg) => {
            message.warn(msg);
          });
        }
      }
    });
  }

  handleChange = ({ file }) => {
    const _this = this;
    //不小于204*300px
    // const limit = { height: 300, width: 204 }

    this.setState({ file });
    if (file.response) {
      if (file.response.success) {
        _this.setState({ file });
        // console.log(JSON.stringify(file));
        // const image = new Image();
        // image.src = file.response.data;
        // image.onload = function () {
        //   if (image.width < limit.width || image.height < limit.height) {
        //     _this.setState({ file });
        //     message.error(`图片上传尺寸不对，要求尺寸${limit.width}*${limit.height}`, 3);
        //     return;
        //   }
        //   message.success('图片上传成功');

        //   _this.setState({ file });
        // };
      } else {
        message.error(file.response.msg);
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const RadioGroup = Radio.Group;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    let file = this.state.file;
    let responseUrl = '';
    if (file.response && file.response.data) {
      responseUrl = file.response.data.url;
    }
    let brandData = this.props.brandData;
    let isEdit = this.props.isEdit;
    function getLogoUrl() {
      if (isEdit) {
        if (responseUrl != '') {
          return <div className='logo-upload'>
            <img className='logo-url' src={responseUrl} />
          </div>;
        } else {
          return <div className='logo-upload'>
            <img className='logo-url' src={brandData.logoUrl} />
          </div>;
        }
      } else {
        if (responseUrl != '') {
          return <div className='logo-upload'>
            <img className='logo-url' src={responseUrl} />
          </div>;
        } else {
          return <span className='logo-upload-span'>
            <span>
              <i className="i-icon">&#xe699;</i><br/>
            上传logo照片
            </span>
          </span>;
        }
      }
    }
    return (<Modal
      title={this.props.title}
      visible={this.props.editBrand}
      onCancel={this.editBrandCancel}
      onOk={this.handleSubmit}
      wrapClassName='brand-edit'
    >
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label='品牌名称'
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true,
              }],
              initialValue: brandData && brandData.name
            })(
              <Input placeholder='输入品牌名称' />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='说明'
          >
            {getFieldDecorator('description', {
              initialValue: brandData && brandData.description
            })(
              <Input placeholder='输入说明' />
            )}
          </FormItem>
          {isEdit && <FormItem
            {...formItemLayout}
            label="状态"
          >
            {getFieldDecorator('status', {
              initialValue: brandData && brandData.status,
              rules: [{
                required: true, message: '请选择状态！',
              }],
            })(
              <RadioGroup>
                <Radio value={1}>启用</Radio>
                <Radio value={2}>停用</Radio>
              </RadioGroup>
            )}
          </FormItem>}
          <FormItem
            {...formItemLayout}
            label='排序'
          >
            {getFieldDecorator('sequence', {
              initialValue: brandData && brandData.sequence
            })(
              <Input placeholder='输入排序值' type='phone' maxLength={2} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='品牌LOGO'
          >
            {getFieldDecorator('logoUrl', {
              initialValue: ''
            })(
              <Upload
                listType="text"
                onChange={this.handleChange}
                action={`${url_prefix}/mng/api/pimp/product/brand/upload.json`}
                accept="image/jpg,image/jpeg,image/png,image/bmp"
                showUploadList={false}
              >
                {getLogoUrl()}
              </Upload>
            )}
          </FormItem>
        </Form>
      </div>
    </Modal>)
  }
}

function mapStateToProps(state) {
  let userInfo = state.get("userInfo") && state.get("userInfo").toJS() || {};
  return {
    // ...state.get('brand').toJS()
    ...userInfo
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditBrand));
