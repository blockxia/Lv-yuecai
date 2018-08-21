
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, DatePicker, Select, Form, Input, Radio, Popover, Modal } from 'antd';
import Table from "components/Common/Table";
import * as Actions from '../../../actions/order';
import Loading from 'components/Common/Loading';
import moment from 'moment';

import './style.scss';
import { formatMoney } from '../../../utils/tools';
import { getDate } from '../../../utils/date';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
class AllOrders extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      //订单号码
      sonOrderNumber: '',
      //商品名称
      commodityName: '',
      //商品状态
      status: 3,
      //分配日期
      allocateTimeStart: '',
      //  分配日期	
      allocateTimeEnd: '',
      pn: 1,
      ps: 10,
    }
  }

  componentDidMount() {
    // this.props.fetchList({ps: 10, pn: 1});
    this.getAllOrders();
  }
  pageChange = (page, ps) => {
    this.setState({ pn: page }, () => {
      this.getAllOrders();
    })
  }
  getAllOrders = () => {
    const {
      sonOrderNumber,
      commodityName,
      allocateTimeStart,
      allocateTimeEnd,
      status,
      pn,
      ps,
    } = this.state;
    //获取入库单列表
    this.props.getAllOrders({
      sonOrderNumber,
      commodityName,      
      allocateTimeStart,
      allocateTimeEnd,
      status,
      pn,
      ps,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          sonOrderNumber,
          commodityName,      
          allocateTimeStart,
          allocateTimeEnd,
          status } = values;
        this.setState({
          sonOrderNumber,
          commodityName,
          status,
          pn: 1
        }, () => {
          this.getAllOrders();
        })
      }
    })
  }
  emptyHandle = () => {
    this.props.form.resetFields();
    this.setState({
      sonOrderNumber: '',
      commodityName: '',
      allocateTimeStart: '',
      allocateTimeEnd: '',
      status: 3,
      pn: 1
    }, () => {
      this.getAllOrders();
    })
  }
  allocateTimeChange = (moment, dateStrings) => {
    this.setState({
      allocateTimeStart: dateStrings && dateStrings[0],
      allocateTimeEnd: dateStrings && dateStrings[1]
    });
  }
  showDetails = (e, record) => {
    e.preventDefault();
    if(record.status == 2){
      browserHistory.push('/order/unallotd/' + record.id)
    }else{
      browserHistory.push('/order/alloted/' + record.id)
    }
  }
  render() {
    let columns = [{
      title: '服务单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: '10%'
    }, 
    {
      title: '服务单状态',
      dataIndex: 'commodityName',
      key: 'commodityName',
      width: '10%',
    },
    {
      title: '订单号',
      dataIndex: 'saleTotalPrice',
      key: 'saleTotalPrice',
      width: '10%',
    },
    {
      title: '商品名称',
      dataIndex: 'commodityName1',
      key: 'commodityName1',
      width: '10%',
    },
    {
      title: '类型',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (text, record) => {
        switch (text) {
          case 1:
            return '待付款';
          case 2:
            return '待分配';
          case 3:
            return '待发货';
          case 4:
            return '待收货';
          case 5:
            return '已收货';
          case 6:
            return '已结算';
          case 7:
            return '已取消';
        }
      }
    },
    {
      title: '退款金额',
      dataIndex: 'allocateName',
      key: 'allocateName',
      width: '10%',
      render: (text, record) => {
        return `¥ ${formatMoney(text)}`
      }
    },
    {
      title: '申请时间',
      dataIndex: 'allocateName',
      key: 'allocateName',
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      width: '10%',
      render: (text, record) => {
        return <a href='#' onClick={(e) => this.showDetails(e, record)}>查看</a>
      }
    }]
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='order-all-orders'>
        <div className='list-search-condition'>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <div className='condition-container'>
              <div className='condition-form'>
                <FormItem
                  label='订单号码'
                >
                  {getFieldDecorator('sonOrderNumber')(
                    <Input placeholder='输入订单号码' />
                  )}
                </FormItem>
                <FormItem
                  label='商品名称'
                >
                  {getFieldDecorator('commodityName')(
                    <Input placeholder='输入商品名称' />
                  )}
                </FormItem>
                <FormItem
                  label='分配日期'
                >
                  {getFieldDecorator('allocateTime')(
                    <RangePicker onChange={(moment, dateStrings) => this.allocateTimeChange(moment, dateStrings)} />
                  )}
                </FormItem>
              </div>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  搜索
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.emptyHandle}>
                  清空
                </Button>
              </FormItem>
            </div>
          </Form>
        </div>
        <div className='cut-off-line'></div>
        <div className='table-list-container'>
          <Table
            dataSource={this.props.list}
            columns={columns}
            rowKey='id'
            paginationInfo={{
              current: this.state.pn,
              showTotal: (total) => `共 ${this.props.total} 页`,
              defaultCurrent: 0,
              total: this.props.total,
              onChange: this.pageChange
            }}
            locale={{ emptyText: '暂无数据' }} />
        </div>

        <Loading display={this.props.loading ? 'block' : 'none'} />
      </div >
    );
  }
}

function mapStateToProps(state) {
  let order = state.get('order') && state.get('order').toJS() || {};
  return {
    ...order
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AllOrders));
