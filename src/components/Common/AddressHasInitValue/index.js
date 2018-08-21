/**
 * @authors sunlei
 * @date    2017-07-17
 * @module  地址搜索组件-pms数据
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

import * as AddressSearchActions from '../../../actions/addressSearchInit';

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
      ...DEFAULT_STATE,
      countryHasChange: false,
      provinceHasChange: false,
      cityHasChange: false,
      countyHasChange: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.clear) {
      nextProps.form.resetFields(['country', 'city', 'province', 'county']);
      this.setState({
        countryHasChange: false,
        provinceHasChange: false,
        cityHasChange: false,
        countyHasChange: false
      }, () => {
        this.props.clearData();
        nextProps.clearCallBack();
      });
    }
    if (nextProps.shouldCheck) {
      nextProps.form.validateFields(err => {
        nextProps.clearCheck && nextProps.clearCheck();
        if (err) {
          return;
        }
      });
    }
  }
  componentWillMount() {
    this.props.getCountry({type: 1});
  }

  componentDidMount() {
    let { country, province, city, county } = this.props.initialValue;
    if (country && country.key) {
      // this.props.getProvince({ countryId: country.key });
      this.props.getProvince({ type: 2, id: country.key });
    }
    if (province && province.key) {
      // this.props.getCity({ provinceId: province.key });
      this.props.getCity({ type: 3, id: province.key });
    }
    if (city && city.key) {
      // this.props.getRegion({ cityId: city.key });
      this.props.getRegion({ type: 4, id: city.key });
    }
  }
  // validateForm(callback) {
  //   return this.props.form.validateFields(error => {
  //     if (error) {
  //       callback && callback();
  //       return false;
  //     }
  //     return true;
  //   });
  // }
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
    if (value.key == '-1') {
      this.props.form.resetFields(['city', 'province', 'county']);
      return;
    }
    this.setState({
      countryHasChange: true
    })
    this.props.form.setFieldsValue({ country: value })
    this.props.clearData();
    this.props.form.resetFields(['city', 'province', 'county']);
    // this.props.getProvince({ countryId: value.key });
    this.props.getProvince({ type: 2, id: value.key });
    let callBackValue =  this.props.form.getFieldsValue();
    callBackValue.province = undefined;
    callBackValue.city = undefined;
    callBackValue.county = undefined;
    this.props.formMessageCallBack(callBackValue)
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
    if (value.key == '-1') {
      this.props.form.resetFields(['city', 'county']);
      return;
    }
    this.setState({
      provinceHasChange: true
    })
    this.props.form.setFieldsValue({ province: value })
    this.props.clearCityData();
    this.props.clearRegionData();
    this.props.form.resetFields(['city', 'county']);
    // this.props.getCity({ provinceId: value.key });
    this.props.getCity({ type: 3,id: value.key });
    let callBackValue =  this.props.form.getFieldsValue();
    callBackValue.city = undefined;
    callBackValue.county = undefined;
    this.props.formMessageCallBack(callBackValue)
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
    if (value.key == '-1') {
      this.props.form.resetFields(['county']);
      return;
    }
    this.setState({
      cityHasChange: true
    })
    this.props.form.setFieldsValue({ city: value })
    this.props.clearRegionData();
    this.props.form.resetFields(['county']);
    // this.props.getRegion({ cityId: value.key });
    this.props.getRegion({ type: 4, id: value.key });
    let callBackValue =  this.props.form.getFieldsValue();
    callBackValue.county = undefined;
    this.props.formMessageCallBack(callBackValue)
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
    this.setState({
      countyHasChange: true
    })
    this.props.form.setFieldsValue({ county: value.key })
    let obj = this.props.form.getFieldsValue();
    obj.county = value;
    this.props.formMessageCallBack(obj)
  }
  /**
  * 国家、省份、城市、区域option获取
  * @params value 城市的ID
  */
  options = (data) => {
    if (data && data.length) {
      const allOptions = data && data.map(item =>
        // <Option key={item.id} code={item.code}>{item.name}</Option>,
        <Option key={item.id} code={item.id.toString()}>{item.name}</Option>,
      );
      return allOptions;
    }
    return;
  }
  validateValues = (rule, value, callback) => {
    if (!value || !value.key) {
      return callback(rule.message);
    }
    callback();
  }
  getInitialValue = () => {
    if(this.props.clue && this.props.clear){
      return this.props.initialValue;
    }
    if (this.state.countryHasChange) {
      return {}
    }
    if (this.state.provinceHasChange) {
      let obj = JSON.parse(JSON.stringify(this.props.initialValue));
      obj.province = undefined;
      obj.city = undefined;
      obj.county = undefined;
      return obj
    }
    if (this.state.cityHasChange) {
      let obj = JSON.parse(JSON.stringify(this.props.initialValue));
      obj.city = undefined;
      obj.county = undefined;
      return obj
    }
    if (this.state.countyHasChange) {
      let obj = JSON.parse(JSON.stringify(this.props.initialValue));
      obj.county = undefined
      return obj
    }
    return this.props.initialValue;
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
    const isSelectShow = this.props.isSelectShow || { country: true, province: true, city: true, county: true }
    const initialValue = this.getInitialValue();
    return (
      <div className="address-search-init" id={`address_search${this.props.childId || ''}`}>
        <FormItem
          style={{ display: isSelectShow.country ? 'block' : 'none' }}
          className="items"
        >
          {getFieldDecorator('country', {
            initialValue: initialValue.country,
            rules: [
              { required: true, validator: this.validateValues.bind(this), message: `请选择国家` },
            ],
          })(
            <Select
              showSearch
              labelInValue={true}
              placeholder="选择国家"
              onSelect={this.handleCountryChange}
              getPopupContainer={() => document.getElementById(`address_search${this.props.childId || ''}`)}
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              dropdownClassName="address-search-select"
            >
              {countryOptions}
            </Select>,
          )}
        </FormItem>
        <FormItem
          style={{ display: isSelectShow.province ? 'block' : 'none' }}
          className="items"
        >
          {getFieldDecorator('province', {
            initialValue: initialValue.province,
            rules: [
              { required: true, validator: this.validateValues.bind(this), message: `请选择省份` },
            ],
          })(
            <Select
              showSearch
              labelInValue={true}
              placeholder="选择省份"
              getPopupContainer={() => document.getElementById(`address_search${this.props.childId || ''}`)}
              onChange={this.handleProvinceChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              dropdownClassName="address-search-select"
            >
              {provinceOptions}
            </Select>,
          )}
        </FormItem>
        <FormItem
          style={{ display: isSelectShow.city ? 'block' : 'none' }}
          className="items"
        >
          {getFieldDecorator('city', {
            initialValue: initialValue.city,
            rules: [
              { required: true, validator: this.validateValues.bind(this), message: `请选择城市` },
            ],
          })(
            <Select
              showSearch
              labelInValue={true}
              placeholder="选择城市"
              getPopupContainer={() => document.getElementById(`address_search${this.props.childId || ''}`)}
              onChange={this.handleCityChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              dropdownClassName="address-search-select"
            >
              {cityOptions}
            </Select>,
          )}
        </FormItem>
        <FormItem
          style={{ display: isSelectShow.county ? 'block' : 'none' }}
          className="items"
        >
          {getFieldDecorator('county', {
            initialValue: initialValue.county,
            rules: [
              { required: true, validator: this.validateValues.bind(this), message: '请选择区域' },
            ],
          })(
            <Select
              showSearch
              labelInValue={true}
              placeholder="选择县区"
              getPopupContainer={() => document.getElementById(`address_search${this.props.childId || ''}`)}
              onChange={this.handleRegionChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
  const addressSearch = state.get('addressSearchInit').toJS();
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
)(Form.create({
  onValuesChange: (props, fields) => {
    let key = `addressData_${props.sessionName || ''}`;
    let addressData = sessionStorage.getItem(key)
    if (addressData) {
      let obj = Object.assign({}, JSON.parse(addressData), fields)
      sessionStorage.setItem(key, JSON.stringify(obj))
    } else {
      let obj = Object.assign({}, {}, fields)
      sessionStorage.setItem(key, JSON.stringify(obj))
    }
  }
})(AddressSearch));