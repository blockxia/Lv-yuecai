/**
 * @author shenxiaoxia
 * @date 2018/8/16
 * @description: 获取地址数据
 */

import axios from 'api/axios'
import {ADDRESS} from '../../constants/actionApi'
import {FETCH_RECEIVE_LIST} from '../../constants/actionTypes'
import Config from 'config'
const url_prefix = Config.env[Config.scheme].prefix;


//查询收获地址数据
export function fetchAddress(params) {
    return dispatch=>{
        dispatch({
            type:FETCH_RECEIVE_LIST,
            val:true
        });
        axios.post(url_prefix+ADDRESS.FETCH_RECEIVE_LIST, params).then(res=>{
            dispatch({
                type:FETCH_RECEIVE_LIST,
                val:false
            });
            if(res.data.success){
                dispatch({
                    type:FETCH_RECEIVE_LIST,
                    state:{
                        addressList:res.data.data || []
                    }
                })
            }else{
                dispatch({
                    type:FETCH_RECEIVE_LIST,
                    state:{
                        addressList: []
                    }
                })
            }
        })
    }
}




// 新增、修改 地址信息
export function updateAddress (id, params, success, fail) {
    return async dispatch => {
        try {
            let res = await axios.post(url_prefix + ADDRESS[!!id ? 'UPDATE_ADDRESS' : 'ADD_ADDRESS'], id ? {...params, id} : params);
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



// 删除收获地址
export function deleteAddress(id,params,success,fail) {
    return async dispatch => {
        try{
            let res = await axios.post(url_prefix + ADDRESS.DELETE_ADDRESS, id ? {...params, id} : params);
            if (res.data.success) {
                success && success();
            }
            else {
                fail && fail();
            }
        }
        catch(err) {
            console.warn(err);
        }
    }
}


// 设置默认账户
export function setDefault (id,purchaserId, success, fail) {
    return async dispatch => {
        try {
            let res = await axios.post(url_prefix + ADDRESS.SET_DEFAULT, {id,purchaserId});
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