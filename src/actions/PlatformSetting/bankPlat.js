/**
 * @author shenxiaoxia
 * @date 2018/8/15
 * @description: 平台银行账户
 */

// 平台银行账户

import axios from 'api/axios';
import * as actionTypes from "../../constants/actionTypes";
import {BANK} from "../../constants/actionApi";
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;


export function PlatformBankLists() {
    return  dispatch => {
        dispatch({
            type: actionTypes.PLATFORM_BANK_LISTS,
            val: true
        });

        axios.post(url_prefix + BANK.PLATFORM_BANK_LISTS, {}).then(res => {
            dispatch({
                type: actionTypes.PLATFORM_BANK_LISTS,
                val: false
            });
            if (res.data.success) {
                dispatch({
                    type: actionTypes.PLATFORM_BANK_LISTS,
                    state: {
                        bankList: res.data.data || []
                    }
                });
            }
            else {
                dispatch({
                    type: actionTypes.PLATFORM_BANK_LISTS,
                    state: {
                        bankList: []
                    }
                });
            }
        })
    }
}