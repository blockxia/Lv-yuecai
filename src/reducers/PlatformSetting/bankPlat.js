import * as actionTypes from '../../constants/actionTypes'
import {Map} from 'immutable'
const initState=Map({
    bankList:[]
});

function bankPlat(state=initState,action) {
    const { payload } = action;
    switch (action.type) {
        case actionTypes.PLATFORM_BANK_LISTS:
            return state.merge(action.state);
        default:
            return state
    }
}


export default bankPlat