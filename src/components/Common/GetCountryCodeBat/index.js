import React, {Component} from 'react';
import intl from 'react-intl-universal';

import message from 'components/Common/message';
import BaseComponent from 'components/Public/BaseComponent';

import './style.scss';

export default class GetCountryCodeBat extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  formatState(state) {
    if (!state.id) {
      return state.text;
    }
    const abbr = $(state.element).data('abbr');
    const $state = $(
      '<span>' + state.id + '-' + abbr + '-' + state.text.split('-')[2] + '</span>'
    );
    return $state;
  }

  formatSelectionState(state) {
    if (!state.id) {
      return state.text;
    }
    const handleText = state.text.split('+')[1];
    const $state = $('<span>' +
    '+' + handleText.split('-')[0] + '</span>');
    return $state;
  }

  initData() {
    let _this = this;
    $(`#${this.props.getCountrycodeId}`).select2({templateResult: this.formatState, templateSelection: this.formatSelectionState, width: 'resolve', dropdownCssClass: 'country-code-warp-bat'});
    $(`#${this.props.getCountrycodeId}`).val(_this.props.value).trigger('change');
  }

  componentDidMount() {
    let _this = this;
    $(`#${this.props.getCountrycodeId}`).on('select2:select', (e) => {
        _this.props.onChange && _this.props.onChange(e.params.data.id);
    });
    this.initData();
  }

  componentDidUpdate() {
    this.initData();
  }

  componentWillUnmount(){
    $(`#${this.props.getCountrycodeId}`).select2('destroy');
  }

  createDom() {
    const payTypeList = this.props.dataList && this.props.dataList.length && this.props.dataList.map((item, i) => {
      return <option key={i} value={`${item.code}`} data-abbr={item.countryAbbr} data-country={item.country}>+{item.code}-{item.countryAbbr}-{item.country}</option>;
    });
    return (
      <div>
        <select style={{width:"70px"}} id={this.props.getCountrycodeId}>
          {payTypeList}
        </select>
      </div>
    );
  }

  render() {
    return (
      <div className="country-code-warp-bat">
        {this.createDom()}
      </div>
    );
  }
}
