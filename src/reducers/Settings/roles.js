import * as actionTypes from '../../constants/actionTypes';
import { Map } from "immutable";
const initialState = Map({
  rolesList:null, // 角色列表
  allPower:{}, // 所有权限
  currentRole:{},// 当前角色
  pageSize:20,//每页显示多少条数据
  currentPage:1,// 当前第几页
  total:0, // 总条数
  allCheckedStatus:false, //默认是没有选中全部
  error:null,
});

export default function roles(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FECH_ALL_ROLES:
      return state.merge({rolesList:action.payload}).merge({total:action.total});
    case actionTypes.FECH_ALL_POWERS:
      return state.merge({allPower:action.payload});
    case actionTypes.SAVE_CURRENT_ROLE:
      return state.merge({currentRole:action.payload});
    case actionTypes.UPDATE_CURRENT_PAGE:
      return state.merge({currentPage:action.payload});
    case actionTypes.UPDATE_CHECKED_ALL_STATE:
      return state.merge({allCheckedStatus:action.payload});
    case actionTypes.CLEAN_CHECKED_ALL_STATE:
      return state.merge({allCheckedStatus:action.payload});
    default:
      return state;
  }
}
