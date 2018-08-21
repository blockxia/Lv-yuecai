import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory} from 'react-router';
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
import * as Actions from '../../../actions/Commodity/spu';
import SearchBox from './SubPage/search'
import SpuTable from './SubPage/table'
import './style.scss';

class Spu extends PureComponent {
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
    this.props.fetchList({ps: 10, pn: 1});
  }
  
  render() {
    const {showUpdate, id, record} = this.state
    const {loading=false, list=[], ...props} = this.props;
    
    return (
      <div className="spu-content">
      <Loading display={loading ? 'block' : 'none'} />
        <SearchBox loading={loading} {...props} />
        <div className="cut-off-line"></div>
        <div className="line-btns">
          <a onClick={x => browserHistory.push('/commodity/spuEdit/0')} className="btns"><i style={{marginRight: '10px'}} className="i-icon">&#xe699;</i>{'商品新增'}</a>
          <a onClick={x => {
            let selected = this.table.state.selected || [];
            if (!selected.length) {
              message.warn('请选择需要上架的商品行！');
              return;
            }
            this.table.setState({showStateConfirm: true, isMuti: true})
          }} className="btns"><i />{'批量上架'}</a>
        </div>
        <SpuTable ref={ele => this.table = ele} showModal={params => this.setState({showUpdate: true, ...params})} list={list} {...props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('spu').toJS(),
     ...state.get('userInfo').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Spu);
