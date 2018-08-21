/**
 * @author wangqinqin
 * @date 2017-11-05
 * @module 国编码
 */
/* eslint-disable */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import message from 'components/Common/message';
import Modal from 'components/Common/Modal';
import BaseComponent from 'components/Public/BaseComponent';
import { getDate } from 'utils/date';
import { formatNumberNormal2 } from 'utils/tools';
import 'lib/datepicker/css/bootstrap-datepicker.css';
//import select2 from 'lib/select2/js/select2.min.js';
import 'lib/select2/css/select2.min.css';
import axios from 'api/axios';
import Config from 'config';
import './style.scss';

const URL_PREFIX = Config.env[Config.scheme].prefix;
const ADMIN_PREFIX = Config.env[Config.scheme].adminPrefix;
// 查询区号
const GET_COUNTRYCODE_URL = {
  'getCountry_list': '/sys/get_country_code.json'
};

export default class GetCountryCode extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state = {
      currentDate: getDate(),
      fiList: [],
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.initData();
  }

  componentDidUpdate() {
    if (this.props.initialCode) {
      $(`#${this.props.getCountrycodeId}`).val([this.props.initialCode]).trigger('change');
    }
  }
  initData() {
    axios.get(`${ADMIN_PREFIX}${GET_COUNTRYCODE_URL['getCountry_list']}`).then((result) => {
      if (result.data.success &&  this._isMounted) {
        this.setState({
          fiList: result.data.data,
        }, () => {
          function formatState (state) {
            if (!state.id) {
              return state.text;
            }
            const abbr = $(state.element).data('abbr');
            const $state = $(
              '<span>' + state.id + '-' + abbr + '-' + state.text.split('-')[2] + '</span>'
            );
            return $state;
          };
          function formatSelectionState (state) {
            if (!state.id) {
              return state.text;
            }
            const handleText = state.text.split('+')[1];
            const $state = $(
              '<span>' + '+' + handleText.split('-')[0] + '</span>'
              // '<span>' + handleText + '</span>'
            );
            return $state;
          };

          $(`#${this.props.getCountrycodeId}`).select2({
            templateResult: formatState,
            templateSelection: formatSelectionState,
            dropdownCssClass: 'country-code-warp-contaniner',
            language: {
              noResults: function () {
                return intl.get('lv.common.global.search.noResult');
              }
            }
            // language: "zh-CN", //设置 提示语言
            // dropdownParent: $('.country-code-warp')
          });
          console.log(this.props.initialCode);
          if (this.props.initialCode) {
            $(`#${this.props.getCountrycodeId}`).val([this.props.initialCode]).trigger('change');
          } else {
            $(`#${this.props.getCountrycodeId}`).val([result.data.data[0].code]).trigger('change');
          }
        });
      }
    });
  }

  // componentDidMount(){
  //   this.initData();
  // }

  // componentDidUpdate() {
    // $('.js-payType-select').select2({
    //   placeholder: intl.get('lv.rooms.overlays.modal.addBill.payType.placeholder'),
    // });
  // }

  createDom() {
    const payTypeList = this.state.fiList && this.state.fiList.map((item, i) => {
      return <option key={i} value={`${item.code}`} data-abbr={item.countryAbbr} data-country={item.country}>+{item.code}-{item.countryAbbr}-{item.country}</option>;
    });
    return (
      <div>
        <select className="validate[required] w80 mr6 js-payType-select js-getCounryCode-warp" id={this.props.getCountrycodeId} tabIndex="-1" style={{ display: 'none' }} >
          <option value=""></option>
          {payTypeList}
        </select>
      </div>
    );
  }

  render() {
    return (
      <div className="country-code-warp">
        {this.createDom()}
      </div>
    );
  }
}