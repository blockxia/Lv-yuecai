/**
 * @author shenxiaoxia
 * @date 2018/8/15
 * @Description: 开票信息页面
 */
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Button,Tabs,Select,Form,Input,Radio} from 'antd'
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import './style.scss'
import * as Actions from "../../../actions/PlatformSetting/invoiceMsg"

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

class InvoiceMsg extends Component{

    constructor(props,context){
        super(props,context);
        this.state={
        };
        // this.renderList = this.renderList.bind(this);
    }
    componentDidMount(){
        this.props.fetchInvoiceList()
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
                content: content || '0'
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
                setTimeout(x => this.props.fetchInvoiceList(), 1000);
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
    render(){
        const {invoiceList = []} = this.props;
        const {getFieldDecorator } = this.props.form
        const {tabKey} = this.props

        return(

            <div className="invoice-content">

                <div className="wrapper">
                    <div className="not-info">
                        <div className="title">
                            <div className="left">
                                <span>开票信息</span>
                            </div>
                            <div className="right">
                                    <span onClick={x => this.setState({showInvoice: true, selectedType: 1, id: null, record: null})}
                                          type="primary">{` + 新增开票信息`}</span>
                            </div>
                        </div>
                        <div className="line"></div>
                        {
                            invoiceList.length===0 ?
                                <div className="center">
                                    <div className='img-wrap'>
                                        <img src={require('../../../images/no_invoices.png')}/>
                                    </div>
                                    <div className="text">
                                        暂无相关信息
                                    </div>
                                </div> :
                                invoiceList.map((item,index)=>{
                                    return <div className="add-tax invoice-item" key={index}>
                                        {/*item*/}
                                        <div className="bank-up-inner">
                                            {/*增值税专用发票*/}
                                            <div className="item-up">
                                                <div className="bank-name">
                                                    <div className="name-left">
                                                        <span className='font-orange'>{invoiceType[item.type]}</span>
                                                    </div>
                                                    <div className='name-none'>
                                                        <a className='font-blue'
                                                           onClick={x => this.setState({showInvoice: true, selectedType: 1, id: null, record: null})}
                                                           type="primary">{`修改`}</a>
                                                    </div>
                                                </div>
                                                <div className="bank-info">
                                                    <div className="info-inner">
                                                        <div className="item font-big">
                                                            <span className='font-big'>{item.companyName}</span>
                                                        </div>
                                                        <div className="item">
                                                            <span>{item.taxpayerNumber ? item.taxpayerNumber : null}</span>
                                                        </div>
                                                        <div className="item">
                                                            <span>{item.regAddress ? item.regAddress : null}</span>
                                                        </div>
                                                        <div className="item font-bottom">
                                                            <span>{item.regTelephone ? item.regTelephone : null}</span>
                                                        </div>
                                                        <div className="item font-footer">
                                                            <span>{item.bankName}</span>
                                                            <span>{item.bankCard ? item.bankCard : null}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                        }
                    </div>
                </div>

                {
                    this.state.showInvoice && <Modal
                        visible={this.state.showInvoice}
                        title={this.state.id ? "开票信息修改" : '新增开票信息'}
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
                    </Modal>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {

    return{
        ...state.get('invoiceMsg').toJS(),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...Actions}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(InvoiceMsg))