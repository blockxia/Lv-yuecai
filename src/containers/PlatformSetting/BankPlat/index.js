/**
 * @author shenxiaoxia
 * @date 2018/8/15
 * @description: 平台银行账户
 */

import React,{Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from "redux"

import './style.scss'
import * as Actions from "../../../actions/PlatformSetting/bankPlat";


const accountType = {
    1: '银行账户',
    2: '支付宝',
    3: '微信'
};
const accountStatusMap = {
    1: '正常',
    2: '停用'
}


class BankPlat extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
        };
    }


    componentDidMount(){
        this.props.PlatformBankLists();
    }

    render(){

        let {bankList=[]}=this.props;
        return(
            <div className="bank-content">
                {
                    bankList.length===0 ?
                        <div className='img-wrap'>
                            <img src={require('../../../images/no_invoices.png')}/>
                        </div>
                    : bankList.map((item,index)=>(
                        <div className="bank-up-wrap" key={index}>

                            <div className="bank-up-inner">
                                <div className="item-up">
                                    {
                                        <div className="bank-name">
                                            <div className="name-left">
                                                <span className='fontW'>{ accountType[item.accountType] || '未知账户'}</span>
                                            </div>
                                            {
                                                +item.sysDefault===1 ? <div className="name-right">
                                                    <span className='font-orange'>{`默认账户`}</span>
                                                </div> : null
                                            }

                                        </div>
                                    }
                                    <div className="line"></div>
                                    <div className="bank-info">
                                        <div className="info-inner">
                                            <div className="item">
                                                <span>{`账户名称：`}</span>
                                                <span>{item.accountName || '暂无'}</span>
                                            </div>
                                            { item.bankName ?
                                                <div className="item">
                                                    <span>{`开户银行：`}</span>
                                                    <span>{item.bankName}</span>
                                                </div> :null
                                            }
                                            <div className="item">
                                                <span className='item-space'>{`账`}</span>
                                                <span>{`户：`}</span>
                                                <span>{item.bankCard}</span>
                                            </div>
                                            <div className="item">
                                                <span className='item-space'>{`状`}</span>
                                                <span>{`态：`}</span>
                                                <span>{accountStatusMap[item.status]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        ...state.get('bankPlat').toJS(),
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({...Actions}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BankPlat)
