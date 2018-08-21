/**
 * @author shenxiaoxia
 * @date 2018/8/15
 * @Description: 开票信息
 */

import {INVOICE_INFO} from '../../constants/actionTypes'
import {Map} from 'immutable'
const initState=Map({
    invoiceList:[],
    tabKey:'1'
});

function invoiceMsg(state=initState,action) {
    const { payload } = action;
    switch (action.type) {
        case INVOICE_INFO:
            return state.merge(action.state);
        default:
            return state
    }
}


export default invoiceMsg