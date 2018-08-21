import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Select, Form, Input, InputNumber } from 'antd';
import ParameterItem from 'components/Common/ParameterItem/index.js';
import message from 'components/Common/message';
import _ from 'lodash';
import './style.scss';

export default class ParameterItemWrapper extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      addParam: false
    }
  }

  componentDidMount() {
    // this.props.fetchList({ps: 10, pn: 1});
  }
  onChange = _.debounce(function (id, value) {
    let reg = /^(\d{1}|[0-9]{1}\d+)([.]{1}[0-9]{0,2})?$/g;
    if (reg.test(value)) {
      //更新
      let typeItem = this.props.typeItem;
      let params = { itemId: id, itemName: value, weight: typeItem.items.length }
      this.props.updateParam && this.props.updateParam(params, () => {
        // message.success('更新成功！');
        // this.props.getAllParameters();
      }, (msg) => {
        message.warn(msg);
      })
    }
  }, 250);
  initParameterItem = () => {
    let typeItem = this.props.typeItem;
    if (typeItem.code == 'priceRatio') {
      let fitem = typeItem.items[0] || '';
      let eitem = typeItem.items[1] || '';
      return <div>
        售卖基准价 + 【售卖基准价 x  <InputNumber
          min={1}
          max={100}
          defaultValue={fitem.name}
          onChange={(value) => this.onChange(fitem.id, value)}
          precision={2} />
        % +  <InputNumber
          min={1}
          max={100}
          defaultValue={eitem.name}
          onChange={(value) => this.onChange(eitem.id, value)}
          precision={2} />】
    </div>
    } else {
      let parameterItemArray = [];
      typeItem && typeItem.items.map((item, index) => {
        let editable = true;
        if (item.builtIn == 1) {
          editable = false;
        }
        parameterItemArray.push(<ParameterItem
          delParam={this.props.delParam}
          updateParam={this.props.updateParam}
          addParam={this.props.createParameter}
          getAllParameters={this.props.getAllParameters}
          key={index + item.name}
          typeItem={typeItem}
          item={item}
          editable={editable} />);
      })
      return parameterItemArray;
    }
  }
  addParameter = () => {
    this.setState({ addParam: true });
  }
  cancelAdd = () => {
    this.setState({ addParam: false });
  }
  render() {
    let typeItem = this.props.typeItem;
    return (
      <div className="parameter-wrapper">
        <div className="panel-title">
          <label className="title">{typeItem && typeItem.name}</label>
        </div>
        <div className="parameter-item-wrapper">
          {
            this.initParameterItem()
          }
          {this.state.addParam && <ParameterItem
            addParam={this.props.addParam}
            getAllParameters={this.props.getAllParameters}
            cancelAdd={this.cancelAdd}
            editable={true}
            isEdit={true}
            typeItem={typeItem} />}
          {(typeItem && typeItem.code != 'priceRatio') && <Button key='addparam' onClick={this.addParameter}>新增参数</Button>}
        </div>
      </div>
    );
  }
}