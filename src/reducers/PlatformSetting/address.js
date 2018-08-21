/**
 * @author shenxiaoxia
 * @date 2018/8/16
 * @description: 收获地址
 */

import {FETCH_RECEIVE_LIST} from '../../constants/actionTypes'
import {Map} from 'immutable'

const initState=Map({
    addressList:[],
});

function addressInfo(state=initState,action) {
    const {payload} = action
    switch (action.type) {
        case FETCH_RECEIVE_LIST:
            return state.merge(action.state)
        default:
            return state
    }
}


export default addressInfo