import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Icon, Tabs, Select, Form, Input, Modal as NewModal, Radio, DatePicker, Upload } from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import Config from 'config';
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import {MERCHANT, SETTING} from '../../../../constants/actionApi.js';
import AddressSearchInit from 'components/Common/AddressHasInitValue';
import moment from 'moment';
import './add.scss';
import { set } from '../../../../utils/cookie.js';

const url_prefix = Config.env[Config.scheme].prefix;
const STATUS_MAP = {
    1: '正常',
    2: '停用'
};
class AddModal extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showUpdate: false
        };
        this.submit = this.submit.bind(this);
    }

    componentWillMount() {
        if (this.props.id) {
            const record = this.props.record;
            this.setState({
                id: record.id
            });
        }
    }
    componentWillUnmount() {
        this.setState({
            showUpdate: false
        });
    }
  handleUpdate(callback) {
    this.setState({shouldCheck: true});
    const {purchaseTypes=[], priceTypes=[]} = this.props;
    const addressVal = this.state.addressVal || {};
    this.props.form.validateFields((err, val) => {
      if (err) {
        callback();
        return;
      }
      const {name='', showName='', description='', status=''} = val;
        const params = {
          name, showName, creator: this.props.users.id
        };
        if (description) {
            params.description = description;
        }
        if (status) {
            params.status = +status;
        }
        if (this.state.id) {
          params.id = this.state.id;
          this.submit(this.state.id, params, callback);
        }
        else {
          this.setState({
            showConfirm: true,
            params,
            back: callback
          });
        }
    });
  }
  submit(id, params, callback) {
    this.props.addOrUpdate && this.props.addOrUpdate(id, params, () => {
      message.success('操作成功');
      callback && callback();
      this.props.onCancel();
      setTimeout(x => this.props.fetchList(this.props.params), 1000);
    }, (code) => {
      // if (+code === 1) {
      //     message.warn('您输入的登录账户已经关联，请重新输入')
      // }
      // else {
          message.warn('操作失败');
      // }
      callback && callback();
    });
  }
    render () {
        const {getFieldDecorator} = this.props.form;
        const {visible, id, record, levels=[], country, purchaseTypes=[], priceTypes=[], ...props} = this.props;
        
        return <div>{
          visible ? <Modal
          visible={visible}
          wrapClassName="common-modal attribute-modal"
          title={`属性${id ? '修改' : '新增'}`}
          onCancel={x => {
            this.props.form.resetFields();
            this.props.onCancel();
          }}
          onOk={this.handleUpdate.bind(this)}
        >
          <div className="attribute-add-update-body">
            <Form>
              <div className="row">
                <div className="left">
                  <FormItem
                    label={'名称'}
                    required
                  >
                    {
                      getFieldDecorator('name', {
                        initialValue: record ? record.name || '' : '',
                        rules: [{required: true, message: '请填写名称'}]
                      })(
                        <Input />
                      )
                    }
                  </FormItem>
                </div>
                <div className="right">
                  <FormItem
                    label={'显示名称'}
                    required
                  >
                    {
                      getFieldDecorator('showName', {
                        initialValue: record ? record.showName || '' : '',
                        rules: [{required: true, message: '请填写显示名称名称'}]
                      })(
                        <Input />
                      )
                    }
                  </FormItem>
                </div>
              </div>
              <div className="row description">
                <FormItem
                  label={'说明'}
                >
                  {
                    getFieldDecorator('description', {
                      initialValue: record ? record.description || '' : ''
                    })(
                      <Input />
                    )
                  }
                </FormItem>
              </div>
              {id && <div className="row">
                <FormItem
                  label={'状态'}
                  required
                >
                  {
                    getFieldDecorator('status', {
                      initialValue: record ? record.status ? record.status.toString() : '' : '1',
                      rules: [{required: true, message: '请选择状态'}]
                    })(
                      <RadioGroup>
                        <Radio value="1">{'启用'}</Radio>
                        <Radio value="2">{'停用'}</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </div>}
            </Form>
          </div>
        </Modal> : null}
        {
          this.state.showConfirm && <Modal
            visible={this.state.showConfirm}
            title="提示"
            onCancel={x => {
              this.state.back && this.state.back();
              this.setState({
                showConfirm: fasle,
                params: null
              });
            }}
            onOk={callback => {
              callback();
              this.setState({showConfirm: false}, x => {
                this.submit(this.state.id, this.state.params, this.state.back);
              })
            }}
          >
            <p style={{textAlign: 'center'}}>{'确定要新增吗，新增后将无法删除。'}</p>
          </Modal>
        }
      </div>
    }
}
export default Form.create()(AddModal);