import * as actionTypes from '../../constants/actionTypes';
import {EMPLOYEES, ROLES, USER_PRIVILEGE} from '../../constants/actionApi.js';
import axios from 'api/axios';
import Config from 'config';
const url_prefix = Config.env[Config.scheme].prefix;
const pms_prefix = Config.env[Config.scheme].pmsPrefix;
const admin_prefix = Config.env[Config.scheme].adminPrefix;

import message from 'components/Common/message';

export const fechEmployees = (params) => {
  return (dispatch, getState) => {
    return axios.get(`${admin_prefix}${EMPLOYEES['list']}`, {params: params}).then((res) => {
      if (res.data.success) {
        // 每次加载数据更新当前页面
        dispatch({
          type:actionTypes.UPDATE_EMPLOYEES_CURRENT_PAGE,
          payload:params.pn
        })
        dispatch({
          type: actionTypes.FECH_EMPLOYEES,
          payload: res.data.data || [],
          total:res.data.total
        })
      }
    })
  }
}

// 分配角色
export const distributionRoles = (recordData) => {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.SAVE_CURRENT_USER,
      payload: {
        userId: recordData.userId,
        name: recordData.name,
        realName: recordData.realName,
        ids: recordData.roleIds
      }
    })

    return axios.get(`${admin_prefix}${ROLES['get_by_page']}`, {params: { ps:1000 }}).then((res) => {
      if (res.data.success) {
        dispatch({type: actionTypes.FECH_ROLE_LIST, payload: res.data.data});
      }
    })
  }
}

export const cleanAllRole = (params) => {
  return (dispatch, getState) => {
    dispatch({type: actionTypes.CLEAN_ALL_ROLE, payload: []})
  }
}

export const cleanCurrentUser = (params) => {
  return (dispatch, getState) => {
    dispatch({type: actionTypes.CLEAN_CURRENT_USER, payload: {}})
  }
}

export const deleteEmployees = (params) => {
  return (dispatch, getState) => {
    return axios.get(`${admin_prefix}${EMPLOYEES['delete']}`, {params: params}).then((res) => {
      if (res.data.success) {
        // 删除成功
        message.success('删除成功！');
      }
    })
  }
}




// 权限角色分配页面///////////////////////////////////////////////////
export const fetchAllRoles = (params) => {
  return (dispatch,getState) => {
    return axios.get(`${admin_prefix}${ROLES['get_by_page']}`, {params: params}).then((res) => {
      if (res.data.success) {
        // 每次加载数据更新当前页面
        dispatch({
          type:actionTypes.UPDATE_CURRENT_PAGE,
          payload:params.pn
        })
        dispatch({
          type:actionTypes.FECH_ALL_ROLES,
          payload:res.data.data || {},
          total:res.data.total
        })
      }
    })
  }
}




export const upDateCurrentRole = (params) => {
  return (dispatch,getState) => {
      dispatch({
        type:actionTypes.SAVE_CURRENT_ROLE,
        payload:{
          id:params.id,
          name:params.name,
          desc:params.desc
        }
      })
  }
}



export const distributionPower = (params) => {
  return (dispatch, getState) => {
    return axios.get(`${admin_prefix}${USER_PRIVILEGE['all']}`, {params: params}).then((res) => {
    // return axios.get(`${pms_prefix}${USER_PRIVILEGE['all']}`, {params: params}).then((res) => {
      if (res.data.success) {
      // 处理checked
      let result = deepCopy(res.data.data.childMap);
        dispatch({
          type:actionTypes.FECH_ALL_POWERS,
          payload:result
        })
      }
    })
  }
}


export const modifyDistributionPower = (params) => {
  return (dispatch, getState) => {
    return axios.get(`${admin_prefix}${USER_PRIVILEGE['all']}`, {params: {}}).then((res) => {
    // return axios.get(`${pms_prefix}${USER_PRIVILEGE['all']}`, {params: {}}).then((res) => {
      if (res.data.success) {
        // 处理checked
        let result = deepCopy(res.data.data.childMap);
        result = TraversalObject(result,params.ids);
        dispatch({
          type:actionTypes.SAVE_CURRENT_ROLE,
          payload:{
            id:params.record.id,
            name:params.record.name,
            desc:params.record.describe
          }
        })
        dispatch({
          type:actionTypes.FECH_ALL_POWERS,
          payload:result
        })
      }
    })
  }
}


export const clean_distributionPower = (params) => {
  return (dispatch, getState) => {
      dispatch({
        type:actionTypes.CLEAN_CHECKED_ALL_STATE,
        payload:false,
      })
      dispatch({
        type:actionTypes.FECH_ALL_POWERS,
        payload:{}
      })
  }
}



//深拷贝
function deepCopy(p, c) {
  var c = c || {};
  for (var i in p) {
    if (typeof p[i] === 'object') {
      if (i == 'node') {
        p[i].checked = false
      }
      c[i] = (p[i].constructor === Array)
        ? []
        : {};
      deepCopy(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
}

function TraversalObject(obj, myKeys) {
  for (var a in obj) {
    if (typeof(obj[a]) == "object") {
      TraversalObject(obj[a], myKeys);
    } else if(a == 'id') {
      myKeys.map((item) => {
        if (obj[a] == item) {
          obj.checked = true;
        }
      })
    }
  }
  return obj;
}









// // 测试
// export const testChecked = (params) => {
//   return (dispatch,getState) => {
//     let aa=Object.assign({}, getState().roles.allPower);
//     // 便利对象
//     aa = TraversalObject(aa, params.id,params.resCode);
//     // console.log(aa);
//     // console.log(aa);
//     // TraversalObject(aa,params.resCode)
//     // if(aa[params.resCode].node.resType==1){
//     //   aa = aa[params.resCode].node.checked=!(aa[params.resCode].node.checked);
//     // }else{
//     //   aa = aa[params.resCode].node.checked=!(aa[params.resCode].node.checked);
//     // }
//     //
//     dispatch({
//       type:actionTypes.FECH_ALL_POWERS,
//       payload:aa
//     })
//   }
// }


// function TraversalObject(obj, myKey,myResCode){
//   for (var a in obj) {
//     if (typeof (obj[a]) == "object") {
//         TraversalObject(obj[a], myKey,myResCode);
//     } else if(a == 'id' && obj[a]==myKey){
//         obj.checked=!obj.checked;
//         break;
//     }else if(obj[a]==myResCode){
//         obj.checked=!obj.checked;
//     }
//   }
//   return obj;
// }
