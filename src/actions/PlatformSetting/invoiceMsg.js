/**
 * @author shenxiaoxia
 * @date 2018/8/15
 * @Description: 开票信息相关数据请求
 */

import axios from 'api/axios'
import {INVOICE_INFO} from '../../constants/actionTypes'
import {Invoice} from '../../constants/actionApi'
import Config from 'config'
const url_prefix = Config.env[Config.scheme].prefix;

//开票信息请求数据函数
export function fetchInvoiceList() {
    return dispatch=>{
        dispatch({
            type:INVOICE_INFO,
            val:true
        });
        axios.post(url_prefix+Invoice.INVOICE_INFO,{}).then(res=>{
            dispatch({
                type:INVOICE_INFO,
                val:false
            });
            if(res.data.success){
                dispatch({
                    type:INVOICE_INFO,
                    state:{
                        invoiceList:res.data.data || []
                    }
                })
            }else{
                dispatch({
                    type:INVOICE_INFO,
                    state:{
                        invoiceList: []
                    }
                })
            }
        })
    }
}


// 新增、修改 发票信息
export function updateInvoice (id, params, success, fail) {
    return async dispatch => {
        try {
            let res = await axios.post(url_prefix + Invoice[!!id ? 'UPDATE_INVOICE' : 'ADD_INVOICE'], id ? {...params, id} : params);
            if (res.data.success) {
                success();
            }
            else {
                fail();
            }
        }
        catch (err) {
            console.warn(err);
        }
    }
}

// 设置默认账户
export function setDefault (id, success, fail) {
    return async dispatch => {
        try {
            let res = await axios.post(url_prefix + Invoice.SET_DEFAULT, {id});
            if (res.data.success) {
                success && success();
            }
            else {
                fail && fail();
            }
        }
        catch (err) {
            console.warn(err);
            fail && fail();
        }
    }
}