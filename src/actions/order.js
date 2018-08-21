/**
 * @authors zhangwei
 * @date    2018-07-15
 * @module  订单action
 */

import axios from 'api/axios';
import message from 'components/Common/message';
import { FETCH_ORDER_ALLORDERS, FETCH_ORDER_AFTERSALES } from '../constants/actionTypes.js';
import { ORDER } from '../constants/actionApi.js';
import Config from 'config';
import intl from 'react-intl-universal';
import * as Tools from 'utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;

// 获取全部订单
function getAllOrders(params) {
  return dispatch => {
    dispatch({
      type: FETCH_ORDER_ALLORDERS,
      state: {
        loading: true,
      }
    });

    axios.post(url_prefix + ORDER.FETCH_ALL_ORDER, params).then(res => {
      if (res.data.success) {
        let allOrderList = res.data.data;
        dispatch({
          type: FETCH_ORDER_ALLORDERS,
          state: {
            orderList: allOrderList,
            total: res.data.total,
            currentPage: params.pn,
          }
        });
        axios.get(url_prefix + ORDER.FETCH_ORDER_NUM, { params: params}).then((count) => {
          if (count.data.success) {
            dispatch({
              type: FETCH_ORDER_ALLORDERS,
              state: {
                countOrderNumber: count.data.data,
              }
            });
          }
          dispatch({
            type: FETCH_ORDER_ALLORDERS,
            state: {
              loading: false,
            }
          });
        });
      } else {
        dispatch({
          type: FETCH_ORDER_ALLORDERS,
          state: {
            orderList: [],
            total: 0,
            currentPage: 1,
            loading: false,
          }
        });
      }
      
    }).catch(err => {
      dispatch({
        type: FETCH_ORDER_ALLORDERS,
        state: {
          loading: false,
          orderList: [],
        }
      });
    });
  }
}

// 获取订单详情
function getOrdersDetails(params) {
  return dispatch => {
    dispatch({
      type: FETCH_ORDER_ALLORDERS,
      state: {
        detailLoading: true,
      }
    });
    axios.post(url_prefix + ORDER.FETCH_ORDER_DETAIL, params).then(res => {
    // axios.get(`/mock/596f24a4a1d30433d837c216/example/mng/api/pimp/purchaser/order/purchase/queryOrderCommodityInfoById.json`).then(res => {
      if (res.data.success) {
        let orderDetails = res.data.data;
        dispatch({
          type: FETCH_ORDER_ALLORDERS,
          state: {
            orderDetails: orderDetails,
          }
        });
        if (orderDetails && !(orderDetails.orderPayResults && orderDetails.orderPayResults.length)) {
          // 无支付记录，需要查询订单在多少时间之后取消
          let typeCode = {
            typeCodes: 'autoCancelOrderDay',
          }
          axios.get(url_prefix + ORDER.FETCH_TYPE_CODE, { params: typeCode})
            .then((data) => {
              if (data.data.success) {
                dispatch({
                  type: FETCH_ORDER_ALLORDERS,
                  state: {
                    cancelOrderTime: data.data.data && data.data.data.length && data.data.data[0].name,
                  }
                });
              }
              
            })
        }
      }
      dispatch({
        type: FETCH_ORDER_ALLORDERS,
        state: {
          detailLoading: false,
        }
      });
    }).catch(err => {
      dispatch({
        type: FETCH_ORDER_ALLORDERS,
        state: {
          detailLoading: false,
          orderDetails: {},
        }
      });
    });
  }
}

// 取消订单
function cancelOrder(params) {
  return dispatch => {
    return axios.post(url_prefix + ORDER.CANCEL_ORDER, params)
  }
}

// 获取支付方式
function fetchPayType(params) {
  return dispatch => {
    dispatch({
      type: FETCH_ORDER_ALLORDERS,
      state: {
        paymentLoading: true,
      }
    });
    axios.post(url_prefix + ORDER.FETCH_TYPE_CODE, params).then(res => {
      if (res.data.success) {
        let orderDetails = res.data.data;
        dispatch({
          type: FETCH_ORDER_ALLORDERS,
          state: {
            pamentList: orderDetails,
          }
        });
      }
      dispatch({
        type: FETCH_ORDER_ALLORDERS,
        state: {
          paymentLoading: false,
        }
      });
    }).catch(err => {
      dispatch({
        type: FETCH_ORDER_ALLORDERS,
        state: {
          paymentLoading: false,
          pamentList: [],
        }
      });
    });
  }
}

// 采购商 确认付款 接口
function confirmAddPay(params) {
  return dispatch => {
    return axios.post(url_prefix + ORDER.ADD_ORDER_PAY, params)
  }
}


// 采购商 订单确认收货 接口
function confirmReceived(params) {
  return dispatch => {
    return axios.post(url_prefix + ORDER.CONFIRM_ORDER_RECEIVED, params)
  }
}

function getAllAfterSales(params) {
  return dispatch => {
    dispatch({
      type: FETCH_ORDER_AFTERSALES,
      state: {
        loading: true,
      }
    });

    axios.post(url_prefix + ORDER.FETCH_ORDER_AFTER_SALES, params).then(res => {
      if (res.data.success) {
        let afterSalesOrderList = res.data.data;
        dispatch({
          type: FETCH_ORDER_AFTERSALES,
          state: {
            list: afterSalesOrderList,
            total: res.data.total,
            currentPage: params.pn,
            loading: false,
          }
        });
      } else {
        dispatch({
          type: FETCH_ORDER_AFTERSALES,
          state: {
            list: [],
            total: 0,
            currentPage: 1,
            loading: false,
          }
        });
      }
      
    }).catch(err => {
      dispatch({
        type: FETCH_ORDER_AFTERSALES,
        state: {
          loading: false,
          list: [],
        }
      });
    });
  }
}

export {
  getAllOrders,
  getOrdersDetails,
  cancelOrder,
  fetchPayType,
  confirmAddPay,
  confirmReceived,
  getAllAfterSales
}