import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import message from 'components/Common/message';
import BaseComponent from 'components/Public/BaseComponent';

import './style.scss';

class GetCountryCode extends BaseComponent {
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
    $(`#${this.props.getCountrycodeId}`).select2({templateResult: this.formatState, templateSelection: this.formatSelectionState, width: 'resolve', dropdownCssClass: 'country-code-warp'});
    if (this.props.initialCode) {
      $(`#${this.props.getCountrycodeId}`).val([this.props.initialCode]).trigger('change');
    } else {
      $(`#${this.props.getCountrycodeId}`).val([this.props.country && this.props.country[0] && this.props.country[0].code]).trigger('change');
    }
    if (this.props.initialCodeDisabled) {
      $(`#${this.props.getCountrycodeId}`).prop('disabled', true);
    }
  }

  componentDidMount() {
    this.initData();
  }
  componentDidUpdate() {
    this.initData();
  }

  componentWillUnmount(){
    $(`#${this.props.getCountrycodeId}`).select2('destroy');
  }

  createDom() {
    const payTypeList = this.props.country && this.props.country.length && this.props.country.map((item, i) => {
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
      <div className="country-code-warp">
        {this.props.country && this.props.country.length ? this.createDom() : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let countryState = state.get('country').toJS();
  const { country } = countryState;
  return {
    country,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GetCountryCode);
