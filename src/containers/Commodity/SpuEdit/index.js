import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Select, Form, Input, Radio } from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/Commodity/spuEdit';
import Basic from './SubPage/basic';
import SKU from './SubPage/SKU';
import Supplier from './SubPage/supplier';
import './style.scss';

class SpuEdit extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tabKey: '1'
    }
  }

  componentDidMount() {
    this.props.fetchCatalogs();
    this.props.fetchBrands();
    let id = this.props.params.id
    if (+id) {
      this.props.fetchBasic({id});
    }
  }
  componentWillUnmount() {
    this.props.clearData();
  }
  tabChange(val) {
    this.setState({tabKey: val});
  }
  render() {
    const {getFieldDecorator } = this.props.form
    const {tabKey} = this.state
    let id = +this.props.params.id || +(this.props.basic || {}).id;
    return (
      <div className="spu-eidt-content">
        <Tabs onChange={this.tabChange.bind(this)}>
          <TabPane key={'1'} tab={`基本信息`}>{<Basic {...this.props} />}</TabPane>
          <TabPane key={'2'} disabled={!id || this.props.supplierEditing} tab={`设置SKU商品`}>{<SKU {...this.props} />}</TabPane>
          <TabPane key={'3'} disabled={!id || this.props.skuEditing} tab={`设置供应商及成本`}>{tabKey === '3' && <Supplier {...this.props} />}</TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('spuEdit').toJS(),
     ...state.get('userInfo').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SpuEdit));
