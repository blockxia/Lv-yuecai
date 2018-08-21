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
import * as Actions from '../../../actions/Commodity/attribute';
import SearchBox from './SubPage/search'
import AttributeTable from './SubPage/table'
import AddModal from './SubPage/add';
import './style.scss';

class Attribute extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showUpdate: false,
      id: null,
      record: null,
    }
  }

  componentDidMount() {
    this.props.fetchList({pn: 1, ps: 10});
  }
  
  render() {
    const {showUpdate, id, record} = this.state
    const {loading=false, list=[], ...props} = this.props;
    
    return (
      <div className="attribute-content">
      <Loading display={loading ? 'block' : 'none'} />
        <SearchBox loading={loading} {...props} />
        <div className="line-btns">
          <a onClick={x => this.setState({showUpdate: true, id: null, record: null})} className="btns"><i style={{marginRight: '10px'}} className="i-icon">&#xe699;</i>{'属性新增'}</a>
        </div>
        <AttributeTable showModal={params => this.setState({showUpdate: true, ...params})} list={list} {...props} />
        {
          showUpdate && <AddModal
            visible={showUpdate}
            id={id}
            onCancel={x => this.setState({showUpdate: false, id: null, record: null})}
            record={record}
            {...props}
          />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('attribute').toJS(),
     ...state.get('userInfo').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Attribute);
