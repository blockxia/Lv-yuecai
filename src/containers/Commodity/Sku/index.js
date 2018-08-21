/**
 * @authors wangchen
 * @date    2018-07-28
 * @module  sku列表
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Icon, Tabs, Select, Form, Input, Radio, DatePicker, Upload } from 'antd';
import Modal from 'components/Common/Modal';
import Loading from 'components/Common/Loading';
import message from 'components/Common/message';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/Commodity/sku';
import SearchBox from './SubPage/search'
import SkuTable from './SubPage/table'
import './style.scss';

class Sku extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showUpdate: false,
      id: null,
      record: null,
    }
  }

  componentDidMount() {
    this.props.fetchCatalogs();
    this.props.fetchList({pageSize: 10, pageNumber: 1});
  }
  
  render() {
    const {showUpdate, id, record} = this.state
    const {loading=false, list=[], ...props} = this.props;
    
    return (
      <div className="sku-content">
      <Loading display={loading ? 'block' : 'none'} />
        <SearchBox loading={loading} {...props} />
        <SkuTable ref={ele => this.table = ele} showModal={params => this.setState({showUpdate: true, ...params})} list={list} {...props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('sku').toJS(),
     ...state.get('userInfo').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Sku);
