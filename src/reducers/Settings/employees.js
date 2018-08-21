import * as actionTypes from '../../constants/actionTypes';
import { Map } from "immutable";
const initialState = Map({
  employeesList:null,
  allRoles:[],
  currentUser:{},// 当前用户
  pageSize:20,
  currentPage:1,
  total:0,
});

export default function employees(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FECH_EMPLOYEES:
      return state.merge({employeesList:action.payload}).merge({total:action.total});
    case actionTypes.FECH_ROLE_LIST:
      return state.merge({allRoles:action.payload});
    case actionTypes.SAVE_CURRENT_USER:
      return state.merge({currentUser:action.payload});
    case actionTypes.CLEAN_ALL_ROLE:
      return state.merge({allRoles:action.payload});
    case actionTypes.CLEAN_CURRENT_USER:
      return state.merge({currentUser:action.payload});
    case actionTypes.UPDATE_EMPLOYEES_CURRENT_PAGE:
      return state.merge({currentPage:action.payload});
    default:
      return state;
  }
}
