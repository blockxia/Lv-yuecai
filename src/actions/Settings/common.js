/**
 * @author wangqinqin
 * @date 2017-08-22
 * @module 设置->公用部分
 */
import * as actionTypes from 'constants/actionTypes.js';
import axios from 'api/axios';
import Config from 'config';
import intl from 'react-intl-universal';
import { message } from 'components/Common/message';
import * as Tools from '../../utils/tools.js';
const url_prefix = Config.env[Config.scheme].prefix;
const currentLocale = Tools.getCurrentLocale();
intl.init({
  currentLocale,
  locales: {
    [currentLocale]: require(`../../locales/${currentLocale}.json`),
  },
});
// 清空选中的省份数据
export function ClearProvinceData() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.GETPROVINCE_SUCCESS,
      payload: { province: {} },
    });
  };
}
export function ClearNewPopProvinceData() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.NEWPOPPROVINCE,
      payload: { newPopProvince: {} },
    });
  };
}
/**
* 清除select框的数据
* @clearParam 要清除的参数
*/
export function ClearStateData(clearParam) {
  return (dispatch) => {
    dispatch({
      type: actionTypes.HOTELMANAGE_SUCCESS,
      payload: { [clearParam]: '' },
    });
  };
}

// 清空选中的城市数据
export function ClearCityData() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.CITY_SUCCESS,
      payload: { city: {} },
    });
  };
}

export function ClearNewPopCityData() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.NEWPOPCITY,
      payload: { newPopCity: {} },
    });
  };
}

// 清空选中的区域数据
export function ClearRegionData() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.REGION_SUCCESS,
      payload: { region: {} },
    });
  };
}

export function ClearNewPopRegionData() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.NEWPOPREGION,
      payload: { newPopRegion: {} },
    });
  };
}

// 清空选中的数据
export function ClearData() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.GETPROVINCE_SUCCESS,
      payload: { province: {} },
    });
    dispatch({
      type: actionTypes.CITY_SUCCESS,
      payload: { city: {} },
    });
    dispatch({
      type: actionTypes.REGION_SUCCESS,
      payload: { region: {} },
    });
  };
}

export function NewPopClearData() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.NEWPOPPROVINCE,
      payload: { newPopProvince: {} },
    });
    dispatch({
      type: actionTypes.NEWPOPCITY,
      payload: { newPopCity: {} },
    });
    dispatch({
      type: actionTypes.NEWPOPREGION,
      payload: { newPopRegion: {} },
    });
    dispatch({
      type: actionTypes.NEWPOPCURRENCY,
      payload: { newPopCurrency: {} },
    });
  };
}

// 直接更新OSS上图，不需要通过保存，新增时候不需要调用
export function UploadImgReq(params) {
  return (dispatch) => {
    return axios.get(`${url_prefix}/crs/setting/group/update_icon.json`, { params: params })
      .then((data) => {
        if (data.data.success) {
          message.success(`${intl.get('lv.common.imgUploadSuccess')}`);
          setTimeout(() => {
            window.location.reload();
          }, 600);
        } else {
          message.error(`${intl.get('lv.common.imgUploadFail')}`);
        }
      })
  };
}

