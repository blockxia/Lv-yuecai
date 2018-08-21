import * as actionTypes from '../../constants/actionTypes';
import { TASK } from '../../constants/actionApi.js';
import axios from 'api/axios';
import Config from 'config';

const url_prefix = Config.env[Config.scheme].prefix;    //跟地址
export function queryLaunch (params){    // 告诉reducer更新数据
    return async (dispatch, getState) => {
        dispatch({
            type: actionTypes.LAUNCH_LOADING,
            data:true
        })
        try {
            let result = await axios.get(`${url_prefix}${TASK['LAUNCH']}`,{params:params});
            if(result.data.msg === 'success'){
                dispatch({
                    type:actionTypes.LAUNCH_DATA,
                    data:result.data.data
                })
            }

            dispatch({
                type:actionTypes.LAUNCH_LOADING,
                data:false
            })
            dispatch({
                type:actionTypes.LAUNCH_PARAMS,
                data:params
            })
            dispatch({
                type:actionTypes.LAUNCH_TOTAL,
                data:result.data.total
            })
            
        } catch(err) {
            dispatch({ type: actionTypes.LAUNCH_LOADING, data: false })
        }
        
    }
}


export function queryAddStaff() {
  return async (dispatch, getState) => {
    try {
      let result = await axios.get(`${url_prefix}${PROPERTY['ADD_STAFF']}`);
      if (result.data.msg == 'success') {
        dispatch(
          {
            type: actionTypes.ADD_STAFF,
            data: result.data.data
          }
        )
      }
    } catch (err) {
    }
  }
}


