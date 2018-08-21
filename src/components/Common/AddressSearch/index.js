/**
 * @authors litengfei
 * @date    2017-11-28
 * @module  地址搜索组件
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BaseComponent from 'components/Public/BaseComponent';
import Button from 'components/Common/Button';

import moment from 'moment';
import { Select, Form, Row, Col, Input } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

import * as AddressSearchActions from '../../../actions/addressSearch.js'

import './style.scss';

const DEFAULT_STATE = {
  name: '',
  country: 0,
  province: 0,
  city: 0,
};

class AddressSearch extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ...DEFAULT_STATE
    };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.clear){
      nextProps.form.resetFields(['country', 'city', 'province','region']);
      nextProps.clearCallBack();
    }
  }
  componentWillMount() {
    this.props.getCountry({});
  }


  /**
  * 点击国家列表选择
  * @params value 省份ID
  * @params option 国家code，用于获取国家货币符号
  */
  handleCountryChange = (value, option) => {
    /*
    this.setState({
      country: value,
    });*/
    this.props.form.setFieldsValue({ country: value })
    this.props.form.resetFields(['city', 'province', 'region']);
    this.props.formMessageCallBack(this.props.form.getFieldsValue())
    this.props.clearData();
    this.props.getProvince({ countryId: value });
  }

  /**
  * 省份选择
  * @params value 国家的ID
  */
  handleProvinceChange = (value) => {
    /*
    this.setState({
      province: value,
    });*/
    this.props.form.setFieldsValue({ province: value })
    this.props.form.resetFields(['city', 'region']);
    this.props.formMessageCallBack(this.props.form.getFieldsValue())
    this.props.clearCityData();
    this.props.clearRegionData();
    this.props.getCity({ provinceId: value });
  }

  /**
  * 城市选择
  * @params value 省份的ID
  */
  handleCityChange = (value) => {
    /*
    this.setState({
      city: value,
    });
    */
    this.props.form.setFieldsValue({ city: value })
    this.props.form.resetFields(['region']);
    this.props.formMessageCallBack(this.props.form.getFieldsValue())
    this.props.clearRegionData();
    this.props.getRegion({ cityId: value });
  }

  /**
  * 县区选择
  * @params value 省份的ID
  */
  handleRegionChange = (value) => {
    /*
    this.setState({
      region: value,
    });
    */
    this.props.form.setFieldsValue({ county: value })
    this.props.formMessageCallBack(this.props.form.getFieldsValue())
  }
  /**
  * 国家、省份、城市、区域option获取
  * @params value 城市的ID
  */
  options = (data) => {
    if (data && data.length) {
      const allOptions = data && data.map(item =>
        <Option key={item.id} code={item.code}>{item.name}</Option>,
      );
      return allOptions;
    }
    return;
  }

  
  render() {
    const { getFieldDecorator } = this.props.form;
    const prop = this.props;
    // 国家
    const countryOptions = this.options(prop.country);
    // 省份
    const provinceOptions = this.options(prop.province);
    // 城市
    const cityOptions = this.options(prop.city);
    // 地区
    const regionOptions = this.options(prop.region);
    
    // 控制具体展示哪个地址选择框，默认全展示
    const isSelectShow = this.props.isSelectShow || {country:true,province:true,city:true,county:true}
    return (
      <div className="address-search">
         <FormItem
            style={{display:isSelectShow.country ? 'block' :'none'}}
            className="items"
          >
            {getFieldDecorator('country', {
              rules: [
                { required: true, message: `` },
              ],
            })(
              <Select
                placeholder="选择国家"
                onSelect={this.handleCountryChange}
                dropdownClassName="address-search-select"
              >
                {countryOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem
            style={{display:isSelectShow.province ? 'block' :'none'}}
            className="items"
          >
            {getFieldDecorator('province', {
              rules: [
                { required: true, message: `` },
              ],
            })(
              <Select
                placeholder="选择省份"
                onChange={this.handleProvinceChange}
                dropdownClassName="address-search-select"
              >
                {provinceOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem
            style={{display:isSelectShow.city ? 'block' :'none'}}
            className="items"
          >
            {getFieldDecorator('city', {
              rules: [
                { required: true, message: `` },
              ],
            })(
              <Select
                placeholder="选择城市"
                onChange={this.handleCityChange}
                dropdownClassName="address-search-select"
              >
                {cityOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem
            style={{display:isSelectShow.county ? 'block' :'none'}}
            className="items"
          >
            {getFieldDecorator('county', {
              rules: [
                { required: true, message: `` },
              ],
            })(
              <Select
                placeholder="选择县区"
                onChange={this.handleRegionChange}
                dropdownClassName="address-search-select"
              >
                {regionOptions}
              </Select>,
            )}
          </FormItem>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userInfo = state.get('userInfo').toJS();
  const addressSearch = state.get('addressSearch').toJS();
  let { users } = userInfo;
  return {
    ...addressSearch,
    users,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AddressSearchActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(AddressSearch));