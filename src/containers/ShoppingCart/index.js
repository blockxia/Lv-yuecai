/**
 * @authors wangchen
 * @date    2018-08-15
 * @module  购物车
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';;
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, Table, Form, Input, InputNumber, Radio } from 'antd';
import Loading from 'components/Common/Loading';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import InputControl from 'components/Common/InputControl';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {getDate} from 'utils/date';
import {formatMoney} from 'utils/tools';
import intl from 'react-intl-universal';
import * as Actions from '../../actions/ShoppingCart/shoppingCart';
import './style.scss';
import InputPlus from './InputPlus';

const priceStatus = {
  1: '正常',
  2: '停用'
};
class ShoppingCart extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showDelete: false,
      selected: [],
      record: [],
    }
  }

  componentDidMount() {
    this.props.fetchList();
  }

  getColumns() {
    return [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          return(
            <div className="img-content">
            <img src="http://test.static.lvyuetravel.com/lvyue/pimp/image/purchaser/2018-08-13/479b5aedf3ab488ce261b5d82e800dbb.png"/>
            <div>
              <div className="commodityName">{record.commodityName}</div>
              <div className="commodityAttributes">{record.commodityAttributes}</div>
            </div>
          </div>
          )
        }
      },
      {
        title: '数量',
        dataIndex: 'commodityNumber',
        key: 'commodityNumber',
        render: (text,record) => {
          return(
            <div>
              <InputPlus  num={record.commodityNumber} onComplete={this.onComplete} record={record}/>
            </div>
          )
        }
      },
      {
        title: '价格',
        key: 'price',
        dataIndex: 'price',
        render: text => {
          return(
            <span className="goods-price">{'￥'}{formatMoney(text)}</span>
          )
        }
      },
      {
        title: '已优惠',
        key: 'marketPrice',
        dataIndex: 'marketPrice',
        render: text => {
          return(
            <span>{'￥'}{formatMoney(text)}</span>
          )
        }
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (<div style={{textAlign: 'center'}}>
            <span onClick={x => this.setState({showDelete: true, id: record.id, record})} style={{cursor: 'pointer', color: '#3AA6F5'}}>{`删除`}</span>
          </div>)
        }
      }
    ];
  }

  //改变购物车商品数量
  onComplete = (num,record) => {
    if(!isNaN(num) && record && num){
      let params = {id:record.id,commodityNumber:num}
      this.props.updateNumber(params, () => {
        this.props.fetchList();
      }, () => {
        message.error('操作失败');
      });
    }   
  }

  // 新增/修改确定
  handleSubmit(callback) {
    this.props.form.validateFields((err, val) => {
      if (err && Object.keys(err).length) {
        return;
      }
      let id = this.state.id;
      if (id) {
        val.id = id;
      }
      this.props.updatePrice(val, !!id, () => {
        callback && callback();
        this.setState({showUpdate: false, id: null, record: null});
        this.props.fetchList();
      }, () => {
        callback && callback();
        message.error('操作失败');
      });
    });
  }
  // 删除确认
  handleDelete(callback) {
    this.props.deleteCommodity({id: this.state.id}, () => {
      callback && callback();
      this.setState({showDelete: false, id: null});
      this.props.fetchList();
    }, () => {
      callback && callback();
      message.error('操作失败');
      this.setState({showDelete: false, id: null});
    });
  }

  //计算选择商品总价
  getAllprice = () => {
    let record = this.state.record;
    let price = null;
    if(record.length > 0) {
      for(let i in record) {
        price += record[i].price * record[i].commodityNumber;
      }
    }
    return price;
  }

  //跳转结算页面
  getSettlement = () => {
    let record = this.state.record;
    if(record.length > 0){
      let skuIds = [];
      for(let i in record){
        skuIds.push(record[i].skuId)
      }
      browserHistory.push('/settlement/' + skuIds.join(","))
    }
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const {list = [], total = 0, params, loading=false, commonLoading=false} = this.props;
    const rowSelection = {
      selectedRowKeys: this.state.selected || [],
      onChange: (selectedRowKeys,record) => {
          console.log(record,'record')
          this.setState({selected: selectedRowKeys,record:record});
      },
      getCheckboxProps: record => ({
          disabled: record.onSale === 1,
      })
  }
    return (
      <div className="shoppingCart-content">
      <Loading display={loading || commonLoading ? 'block' : 'none'}/>
        <Table
          rowSelection={rowSelection}
          columns={this.getColumns()}
          rowKey="index"
          dataSource={list.map((it, idx) => Object.assign({}, it, {index: idx}))}   //数据源
          locale={
              {
                  emptyText:intl.get("lv.common.noData")
              }
          } 
          pagination={false}
        />
        <div className="order-pannel">
          <div className="order-footer">
            <div className={this.state.selected.length == 0 ? "submit-btn" : "submit-btn-select"} onClick={this.getSettlement}>
                {'去结算'}
            </div>
            <div className="priceAll">
                {'总价：'}<span>￥{formatMoney(this.getAllprice())}</span>
            </div>
            <div className="priceAll">
                {'已选择商品：'}<span>{this.state.selected.length}</span>{'件'}
            </div>
          </div>
        </div>
        {
          this.state.showDelete && <Modal
            visible={this.state.showDelete}
            title="删除商品"
            onOk={this.handleDelete.bind(this)}
            onCancel={x => this.setState({showDelete: false, id: null})}
          >
          <p style={{textAlign: 'center'}}>{`你确定要删除此商品吗？`}</p>
          <p style={{textAlign: 'center'}}>{`删除后将不能恢复`}</p>
          </Modal>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('shoppingCart').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ShoppingCart));
