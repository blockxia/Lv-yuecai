import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
class PreAllot extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      //订单号码
      orderNumber: '',
      //商品名称
      commodityName: '',
      // 采购商名称	
      purchaseName: '',
      // 预定人	
      purchaseContactName: '',
      // 预定日期	
      createTimeStart: '',
      // 预定日期	
      createTimeEnd: '',
      pn: 1,
      ps: 10
    }
  }

  componentDidMount() {
    // this.props.fetchList({ps: 10, pn: 1});
    this.getWaitAllocateOrder();
  }
  pageChange = (page, ps) => {
    this.setState({ pn: page }, () => {
      this.getWaitAllocateOrder();
    })
  }
  getWaitAllocateOrder = () => {
    const {
      orderNumber,
      commodityName,
      purchaseName,
      purchaseContactName,
      createTimeStart,
      createTimeEnd,
      allocateTimeStart,
      allocateTimeEnd,
      status,
      pn,
      ps
    } = this.state;
    //获取入库单列表
    this.props.getWaitAllocateOrder({
      orderNumber,
      commodityName,
      purchaseName,
      purchaseContactName,
      createTimeStart,
      createTimeEnd,
      allocateTimeStart,
      allocateTimeEnd,
      status,
      pn,
      ps
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { name, status } = values;
        this.setState({ name, status, pn: 1 }, () => {
          this.getWaitAllocateOrder();
        })
      }
    })
  }
  emptyHandle = () => {
    this.setState({
      orderNumber: '',
      commodityName: '',
      purchaseName: '',
      purchaseContactName: '',
      createTimeStart: '',
      createTimeEnd: '',
      allocateTimeStart: '',
      allocateTimeEnd: '',
      status: 0,
      pn: 0
    }, () => {
      this.getWaitAllocateOrder();
    })
  }
  createTimeChange = (moment, dateStrings) => {
    this.setState({
      createTimeStart: dateStrings && dateStrings[0],
      createTimeEnd: dateStrings && dateStrings[1]
    });
  }
  allocateTimeChange = (moment, dateStrings) => {
    this.setState({
      allocateTimeStart: dateStrings && dateStrings[0],
      allocateTimeEnd: dateStrings && dateStrings[1]
    });
  }
  showDetails = (e, record) => {

  }
  render() {
    let columns = [{
      title: '订单号码',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: '10%'
    }, {
      title: '商品名称',
      dataIndex: 'commodityName',
      key: 'commodityName',
      width: '10%',
      render: (text, record) => {
        return (
          <span>
            <span
              className="eslips-text-two"
              style={{ WebkitBoxOrient: 'vertical' }}
            >
              {text ? <Popover placement="top" content={text} trigger="hover" overlayClassName="comment-popover">{text}</Popover> : ''}
            </span>
            {/* <span className="eslips-text-one" style={{ WebkitBoxOrient: 'vertical' }}>{text ? <Popover placement="top" content={row.kpInfo} trigger="hover" overlayClassName="comment-popover">{row.kpInfo}</Popover> : '暂无'}</span> */}
          </span>
        );
      }
    },
    {
      title: '订单总成本',
      dataIndex: 'costTotalPrice',
      key: 'costTotalPrice',
      width: '10%',
      render: (text, record) => {
        return `¥ ${formatMoney(text)}`
      }
    },
    {
      title: '订单总金额',
      dataIndex: 'saleTotalPrice',
      key: 'saleTotalPrice',
      width: '10%',
      render: (text, record) => {
        return `¥ ${formatMoney(text)}`
      }
    },
    {
      title: '已总收款',
      dataIndex: 'saleTotalPrice',
      key: 'saleTotalPrice',
      width: '10%',
      render: (text, record) => {
        return `¥ ${formatMoney(text)}`
      }
    },
    {
      title: '订单状态',
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
      title: '采购商',
      dataIndex: 'purchaseName',
      key: 'purchaseName',
      width: '10%',
      render: (text, record) => {
        return (
          <span>
            <span
              className="eslips-text-two"
              style={{ WebkitBoxOrient: 'vertical' }}
            >
              {text ? <Popover placement="top" content={text} trigger="hover" overlayClassName="comment-popover">{text}</Popover> : ''}
            </span>
            {/* <span className="eslips-text-one" style={{ WebkitBoxOrient: 'vertical' }}>{text ? <Popover placement="top" content={row.kpInfo} trigger="hover" overlayClassName="comment-popover">{row.kpInfo}</Popover> : '暂无'}</span> */}
          </span>
        );
      }
    },
    {
      title: <div>预订人<br />预订日期</div>,
      dataIndex: 'purchaseContactName',
      key: 'purchaseContactName',
      width: '10%',
      render: (text, record) => {
        return <span>
          <span>{text}</span><br />
          <span>{getDate(record.createTime)}</span>
        </span>
      }
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
                  {getFieldDecorator('orderNumber')(
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
                  label='订单状态'
                >
                  {getFieldDecorator('status', { initialValue: '0' })(
                    <Select style={{ width: 120 }}>
                      <Option value="0">全部</Option>
                      <Option value="1">待付款</Option>
                      <Option value="2">待分配</Option>
                      <Option value="3">待发货</Option>
                      <Option value="4">待收货</Option>
                      <Option value="5">已收货</Option>
                      <Option value="6">已结算</Option>
                      <Option value="7">已取消</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label='采购商'
                >
                  {getFieldDecorator('purchaseName')(
                    <Input placeholder='输入采购商' />
                  )}
                </FormItem>
                <FormItem
                  label='预订日期'
                >
                  {getFieldDecorator('createTime')(
                    <RangePicker onChange={(moment, dateStrings) => this.createTimeChange(moment, dateStrings)} />
                  )}
                </FormItem>
                <FormItem
                  label='供应商'
                >
                  {getFieldDecorator('commodityName')(
                    <Input placeholder='输入供应商名称' />
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


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PreAllot));
