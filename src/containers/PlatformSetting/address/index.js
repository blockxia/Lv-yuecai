/**
 * @author shenxiaoxia
 * @date 2018/8/16
 * @description: 收货地址
 */

import React,{Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Button,Tabs,Select,Form,Input,Checkbox} from 'antd'
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
import './style.scss'
import * as Actions from "../../../actions/PlatformSetting/address"



class address extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
        };
    }
    componentDidMount(){
        this.props.fetchAddress({
            purchaserId: this.props.purchaserId,
        })
    }

    // 删除确认
    handleDelete(id,callback) {
        let param ={

            }
        this.props.deleteAddress(id,param, () => {
            message.success('操作成功');
            callback && callback();
            this.setState({showDelete: false, id: null});
            this.props.fetchAddress({
                purchaserId: this.props.purchaserId,
            });
        }, () => {
            callback && callback();
            message.error('操作失败');
            this.setState({showDelete: false, id: null});
        });
    }

    // 更新地址 handleUpdateAddress
    handleUpdateAddress(id, callback) {
        this.props.form.validateFields((err, val) => {
            if (err) {
                callback && callback();
                return;
            }
            let { deliveryName, deliveryUser, deliveryAddress, telphone,fixTelphone,email,defaults} = val;
            let param = {
                purchaserId:this.props.purchaserId,
                deliveryName: deliveryName,
                deliveryUser: deliveryUser || "",
                deliveryAddress: deliveryAddress || '',
                telphone: telphone || '',
                fixTelphone:fixTelphone || '',
                email:email || '',
                defaults:defaults===true ? '1' : false

            }
            this.props.updateAddress(id, param, () => {
                message.success('操作成功');
                callback && callback();
                this.setState({
                    id: null,
                    record: null,
                    selectedType: null,
                    showAddress: false,
                    showDelete:false
                });
                setTimeout(x => this.props.fetchAddress({
                    purchaserId: this.props.purchaserId,
                }), 1000);
            }, () => {
                callback && callback();
                message.warn('操作失败');
            });
        });
    }
    validateBankAccount(type,rules, value, callback) {
        let regP = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/; // 手机号验证
        let regF =/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+([0-9]{1,4})?$/;// 固定电话号验证
        let regE =/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;//邮箱验证


        if ( +type === 1) {
            if (!value) {
                callback();
            }
            else {
                if (!regP.test(value)) {
                    callback('请输入有效的手机号');
                }
                else {
                    callback();
                }
            }
        }
        else if ( +type === 2) {
            if (!value) {
                callback();
            }
            else {
                if(!regF.test(value)){
                    callback('请输入有效的固定电话号');
                }
                else{
                    callback();
                }

            }
        }
        else {
            if(!regE.test(value)){
                callback('请输入有效的邮箱');
            }
            else{
                callback();
            }
        }
    }


    // 设为默认地址
    handleChange(id,purchaserId){
        console.log(id);
        this.props.setDefault(id,purchaserId, () => {
            message.success('操作成功');
            this.props.fetchAddress({
                purchaserId: this.props.purchaserId,
            });
        }, () => {
            message.error('操作失败');
        });
    }


    render(){
        const {addressList = []} = this.props;
        const {getFieldDecorator } = this.props.form
        return(
            <div className="invoice-content">
                <div className="wrapper">
                    <div className="not-info">
                        <div className="title">
                            <div className="left">
                                <span>{`收货地址`}</span>
                            </div>
                            <div className="right">
                                    <span onClick={x => this.setState({showAddress: true, selectedType: 1, id: null, record: null})}
                                          type="primary">{` + 新增收货地址`}</span>
                            </div>
                        </div>
                        <div className="line"></div>
                        {
                            addressList.length===0 ?
                                <div className="center">
                                    <div className='img-wrap'>
                                        <img src={require('../../../images/no_invoices.png')}/>
                                    </div>
                                    <div className="text">
                                        暂无相关信息
                                    </div>
                                </div> :
                                addressList.map((item,index)=>{
                                    return <div className="add-tax invoice-item" key={index}>
                                        {/*item*/}
                                        <div className="bank-up-inner">
                                            {/*增值税专用发票*/}
                                            <div className="item-up">
                                                <div className="bank-name">
                                                    {
                                                        item.defaults===1 ? <div className="name-left">
                                                            <span className='bg-orange'>{`默认地址`}</span>
                                                        </div> :null
                                                    }
                                                    <div className="name-left">
                                                        <span className='font-orange'>{item.deliveryName}</span>
                                                    </div>
                                                    <div className='name-none'>
                                                        {
                                                            item.defaults===1 ? null :<div className="wrap big">
                                                                <a className='font-blue'
                                                                   onClick={this.handleChange.bind(this,item.id,item.purchaserId)}
                                                                   type="primary">{ '设为默认地址'}</a>
                                                            </div>
                                                        }
                                                        <div className="wrap">
                                                            <a className='font-blue'
                                                               onClick={x => this.setState({showAddress: true, selectedType: 1, id: item.id, record: item})}
                                                               type="primary">{`修改`}</a>
                                                        </div>
                                                        <div className="wrap last">
                                                            <a className='font-blue'
                                                               onClick={x => this.setState({showDelete:true, selectedType: 1, id: item.id, record: item})}
                                                               type="primary">{`删除`}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bank-info">
                                                    <div className="info-inner">
                                                        <div className="item font-big">
                                                            <span className='font-big'>{item.deliveryUser}</span>
                                                        </div>
                                                        <div className="item">
                                                            <span>{item.telphone ? item.telphone : null}</span>
                                                        </div>
                                                        <div className="item">
                                                            <span>{item.deliveryAddress ? item.deliveryAddress : null}</span>
                                                        </div>
                                                        <div className="item font-bottom">
                                                            <span>{item.fixTelphone ? item.fixTelphone : null}</span>
                                                        </div>
                                                        <div className="item font-footer">
                                                            <span>{item.email ? item.email : null}</span>
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
                    this.state.showAddress && <Modal
                        visible={this.state.showAddress}
                        width={680}
                        height={442}
                        title={this.state.id ? "修改收货地址" : '新增收货地址'}
                        onOk={this.handleUpdateAddress.bind(this, this.state.id || '')}
                        onCancel={x => this.setState({showAddress: false, selectedType: null, id: null, record: null})}
                    >
                        <div className="invoice-update-body">
                            <Form>
                                <div className="row">
                                    <span className='row-title required'>{`地址名称：`}</span>
                                    <FormItem className="type">
                                        {
                                            getFieldDecorator('deliveryName', {
                                                initialValue: this.state.record ? this.state.record.deliveryName : '',
                                                rules: [{required: true, message: '请填写地址信息'}]}
                                            )(
                                                <Input/>
                                            )
                                        }
                                    </FormItem>

                                    <span className="row-title required">{`收货人：`}</span>
                                    <FormItem>
                                        {
                                            getFieldDecorator('deliveryUser', {
                                                initialValue: this.state.record ? this.state.record.deliveryUser : '',
                                                rules: [{required: true, message: '请填写收货人名称'}]
                                            })(
                                                <Input />
                                            )
                                        }
                                    </FormItem>
                                </div>
                                <div className="row">
                                    <span className="row-title required">{`详细地址：`}</span>

                                        {
                                            getFieldDecorator('deliveryAddress', {
                                                initialValue: this.state.record ? this.state.record.deliveryAddress : '',
                                                rules: [{required: true, message: '请填写收货地址'}]
                                            })( <Input.TextArea className='textArea'/>)
                                        }

                                </div>
                                <div className="row">
                                    <span className="row-title required">{`手机号码：`}</span>
                                    <FormItem>
                                        {
                                            getFieldDecorator('telphone', {
                                                initialValue: this.state.record ? this.state.record.telphone : '',
                                                rules: [{required: true}, {validator: this.validateBankAccount.bind(this,1)}]
                                            })(
                                                <Input />
                                            )
                                        }
                                    </FormItem>
                                    <span className="row-title">{`固定电话：`}</span>
                                    <FormItem>
                                        {
                                            getFieldDecorator('fixTelphone', {
                                                initialValue: this.state.record ? this.state.record.fixTelphone : '',
                                                rules: [{required: false}, {validator: this.validateBankAccount.bind(this,2)}]
                                            })(
                                                <Input />
                                            )
                                        }
                                    </FormItem>
                                </div>
                                <div className="row">
                                    <span className="row-title">{`邮箱：`}</span>
                                    <FormItem>
                                        {
                                            getFieldDecorator('email', {
                                                initialValue: this.state.record ? this.state.record.email : '',
                                                rules: [{required: false}, {validator: this.validateBankAccount.bind(this,3)}]
                                            })(
                                                <Input />
                                            )
                                        }
                                    </FormItem>
                                </div>
                               {/* <div className="row">
                                    <span className="row-title row-box">
                                        {
                                            getFieldDecorator('defaults', {
                                                valuePropName: 'checked',
                                                initialValue: this.state.record && this.state.record.defaults === 1,
                                                rules: [{required: false}]
                                            })(
                                                <Checkbox/>
                                            )
                                        }
                                    </span>
                                    <span className="row-title row-address">{`设为默认地址`}</span>
                                </div>*/}
                            </Form>
                        </div>
                    </Modal>
                }
                {
                    this.state.showDelete && <Modal
                        visible={this.state.showDelete}
                        title="提示"
                        onOk={this.handleDelete.bind(this,this.state.id || '')}
                        onCancel={x => this.setState({showDelete: false})}
                    >
                        <p style={{textAlign: 'center'}}>{`你确定要删除地址吗？删除后将无法恢复。`}</p>
                    </Modal>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    let userInfo = state.get('userInfo').toJS() || {};
    return{
        ...state.get('addressInfo').toJS(),
        purchaserId: userInfo.addonInfo.id,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...Actions}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(address))