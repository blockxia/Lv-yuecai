import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Select, Form, Input, Radio } from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/PlatformSetting/finance';
import BankAccount from 'components/PlatformSetting/BankAccount';
import Invoice from 'components/PlatformSetting/Invoice';
import './style.scss';

const accountTypeMap = {
  1: '银行账户',
  2: '支付宝',
  3: '微信'
};
const accountStatusMap = {
  1: '正常',
  2: '停用'
}
const invoiceType = {
  1: '普通发票',
  2: '增值税专用发票'
};
const DEFAULT_ACCOUNT_NAME = '旅悦（天津）酒店集团公司';
class Finance extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  componentDidMount() {
    //  this.props.fetchList({ps: 10, pn: 1});
  }
  handleUpdate(id, callback) {
    this.props.form.validateFields((err, val) => {
      if (err) {
        callback && callback();
        return;
      }

      let {accountType, accountName, bankName, bankCard, status} = val;
      let param = {
        accountType: +accountType,
        accountName: accountName || DEFAULT_ACCOUNT_NAME,
        bankName: bankName || accountTypeMap[+accountType],
        bankCard,
        status: +status
      }
      this.props.updateAccount(id, param, () => {
        message.success('操作成功');
        callback && callback();
        this.setState({
          id: null,
          record: null,
          selectedType: null,
          showUpdate: false
        });
        setTimeout(x => this.props.fetchAccountList(), 1000);
      }, () => {
        callback && callback();
        message.warn('操作失败');
      });
    });
  }
  handleInvoiceUpdate(id, callback) {
    this.props.form.validateFields((err, val) => {
      if (err) {
        callback && callback();
        return;
      }
      let {type, companyName, taxpayerNumber, regAddress, regTelephone, bankName, bankCard, content} = val;
      let param = {
        type: +type,
        companyName: companyName,
        taxpayerNumber: taxpayerNumber || "",
        regAddress: regAddress || '',
        regTelephone: regTelephone || '',
        bankName: bankName || '',
        bankCard: bankCard || '',
        content: content || ''
      }
      this.props.updateInvoice(id, param, () => {
        message.success('操作成功');
        callback && callback();
        this.setState({
          id: null,
          record: null,
          selectedType: null,
          showInvoice: false
        });
        setTimeout(x => this.props.fetchInvoice(), 1000);
      }, () => {
        callback && callback();
        message.warn('操作失败');
      });
    });
  }
  validateBankAccount(type, rules, value, callback) {
    let reg1 = /^[1-9]\d{14,18}$/; // 普通银行账户
    let reg2 = /^[0-9]\d{0,49}$/; // 普通银行账户
    let reg3 = /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/; //微信账号
    let reg4 = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/; // 支付宝账号校验
    if ( +type === 2) {
      if (!value) {
        callback();
      }
      else {
        if (!reg4.test(value)) {
          callback('请输入有效的支付宝账号');
        }
        else {
          callback();
        }
      }
    }
    else if ( +type === 3) {
      if (!value) {
        callback();
      }
      else {
        if (!reg3.test(value)) {
          callback('请输入有效的微信账号');
        }
        else {
          callback();
        }
      }
    }
    else {
      if (!value || reg1.test(value) || reg2.test(value)) {
        callback();
      }
      else {
        callback('请输入有效的银行账号');
      }
    }
  }
  render() {
    const {getFieldDecorator } = this.props.form
    const {tabKey} = this.props
    const operations = <div className="panel-title-actions">
      <span>{tabKey === '1' ? `维护平台银行账户后，采购商依据此银行账户信息向平台付款。` : `维护平台发票信息后，供应商依据此信息给平台开具发票。`}</span>
      {
        tabKey === '1' 
          ? <Button onClick={x => this.setState({showUpdate: true, selectedType: 1, id: null, record: null})} 
            style={{marginLeft: '10px'}} type="primary">{`银行账户增加`}</Button>
          : <Button onClick={x => this.setState({showInvoice: true, selectedType: 1, id: null, record: null})} 
            style={{marginLeft: '10px'}} type="primary">{`开票信息增加`}</Button>
      }
    </div>;
    return (

      <div className="finance-content">
        <Tabs onChange={this.props.tabChange} tabBarExtraContent={operations}>
        <TabPane key={1} tab={`平台银行账户`}>{tabKey === '1' && <BankAccount update={(id, record) => this.setState({showUpdate: true, selectedType: record.accountType, id, record})} />}</TabPane>
          <TabPane key={2} tab={`平台开票信息`}>{tabKey === '2' && <Invoice update={(id, record) => this.setState({showInvoice: true, selectedType: record.type, id, record})} />}</TabPane>
        </Tabs>
        {this.state.showUpdate && <Modal
          visible={this.state.showUpdate}
          title={this.state.id ? "银行账户修改" : '银行账户增加'}
          onOk={this.handleUpdate.bind(this, this.state.id || '')}
          onCancel={x => this.setState({showUpdate: false, selectedType: null, id: null, record: null})}
        >
      


        <div className="account-update-body">
          <Form>
            <div className="row">
              <span className='row-title required'>{`账户类型：`}</span>
              <FormItem className="accountType">
                {
                  getFieldDecorator('accountType', {
                    initialValue: this.state.record ? this.state.record.accountType.toString() : '1',
                    rules: [{required: true, message: '请选择账户类型'}]}
                  )(
                    <Select style={{width: '200px'}} onChange={val => this.setState({selectedType: val})} >
                      {
                        Object.entries(accountTypeMap).map(it => {
                          let [key, val] = it;
                          return <Option key={key} value={key}>{val}</Option>
                        })
                      }
                    </Select>
                  )
                }
              </FormItem>
            </div>
            {(!this.state.selectedType || +this.state.selectedType === 1) && <div className="row">
              <span className="row-title required">{`账户名称：`}</span>
                <FormItem>
                {
                  getFieldDecorator('accountName', {
                    initialValue: this.state.record ? this.state.record.accountName : '',
                    rules: [{required: true, message: '请填写账户名称'}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>}
            { (!this.state.selectedType || +this.state.selectedType === 1) && <div className="row">
              <span className="row-title required">{`开户银行：`}</span>
                <FormItem>
                {
                  getFieldDecorator('bankName', {
                    initialValue: this.state.record ? this.state.record.bankName : '',
                    rules: [{required: true, message: '请填写开户银行'}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>}
            <div className="row">
              <span className="row-title required">{this.state.selectedType && +this.state.selectedType !== 1 ? '账号：' : `银行账户：`}</span>
                <FormItem>
                {
                  getFieldDecorator('bankCard', {
                    initialValue: this.state.record ? this.state.record.bankCard : '',
                    rules: [{required: true, message: '请填写账户'}, {
                      validator: this.validateBankAccount.bind(this, this.state.selectedType || '1')
                    }]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>
            <div className="row">
                <span className="row-title required">{`状态：`}</span>
                <FormItem>
                  {
                    getFieldDecorator('status', {
                      initialValue: this.state.record ? this.state.record.status : 1,
                      rules: [{required: true, message: '请选择账户状态'}]
                    })(
                      <RadioGroup >
                        <Radio value={'1'}>{`正常`}</Radio>
                        <Radio value={'2'}>{`停用`}</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
            </div>
          </Form>
        </div>
        </Modal>}

        {this.state.showInvoice && <Modal
          visible={this.state.showInvoice}
          title={this.state.id ? "开票信息修改" : '开票信息增加'}
          onOk={this.handleInvoiceUpdate.bind(this, this.state.id || '')}
          onCancel={x => this.setState({showInvoice: false, selectedType: null, id: null, record: null})}
        >
        <div className="invoice-update-body">
          <Form>
            <div className="row">
              <span className='row-title required'>{`发票类型：`}</span>
              <FormItem className="type">
                {
                  getFieldDecorator('type', {
                    initialValue: this.state.record ? this.state.record.type.toString() : '1',
                    rules: [{required: true, message: '请选择发票类型'}]}
                  )(
                    <Select style={{width: '200px'}} onChange={val => this.setState({selectedType: val})} >
                      {
                        Object.entries(invoiceType).map(it => {
                          let [key, val] = it;
                          return <Option key={key} value={key}>{val}</Option>
                        })
                      }
                    </Select>
                  )
                }
              </FormItem>
            </div>
            <div className="row">
              <span className="row-title required">{`单位名称：`}</span>
                <FormItem>
                {
                  getFieldDecorator('companyName', {
                    initialValue: this.state.record ? this.state.record.companyName : '',
                    rules: [{required: true, message: '请填写单位名称'}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>
            <div className="row">
              <span className="row-title">{`纳税人识别码：`}</span>
                <FormItem>
                {
                  getFieldDecorator('taxpayerNumber', {
                    initialValue: this.state.record ? this.state.record.taxpayerNumber : '',
                    rules: [{required: false, message: '请填写纳税人识别码'}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>
            {(!this.state.selectedType || +this.state.selectedType === 1) && <div className="row">
              <span className="row-title required">{`发票内容:`}</span>
                <FormItem>
                {
                  getFieldDecorator('content', {
                    initialValue: this.state.record ? this.state.record.content : '',
                    rules: [{required: true, message: '请填写发票内容'}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>}
            {(!this.state.selectedType || +this.state.selectedType === 2) && <div className="row">
              <span className="row-title">{`注册地址：`}</span>
                <FormItem>
                {
                  getFieldDecorator('regAddress', {
                    initialValue: this.state.record ? this.state.record.regAddress : '',
                    rules: [{required: false, message: '请填写注册地址'}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>}
            { (!this.state.selectedType || +this.state.selectedType === 2) && <div className="row">
              <span className="row-title">{`注册电话：`}</span>
                <FormItem>
                {
                  getFieldDecorator('regTelephone', {
                    initialValue: this.state.record ? this.state.record.regTelephone : '',
                    rules: [{required: false}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>}
            { (!this.state.selectedType || +this.state.selectedType === 2) && <div className="row">
              <span className="row-title">{`开户银行：`}</span>
                <FormItem>
                {
                  getFieldDecorator('bankName', {
                    initialValue: this.state.record ? this.state.record.bankName : '',
                    rules: [{required: false}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>}
            { (!this.state.selectedType || +this.state.selectedType === 2) && <div className="row">
              <span className="row-title">{`银行账户：`}</span>
                <FormItem>
                {
                  getFieldDecorator('bankCard', {
                    initialValue: this.state.record ? this.state.record.bankCard : '',
                    rules: [{required: false}, {validator: this.validateBankAccount.bind(this, 1)}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
            </div>}
          </Form>
        </div>
        </Modal>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('finance').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Finance));
