import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, DatePicker, Select, Form, Input, Radio, Popover, Modal } from 'antd';
import Table from "components/Common/Table";
import * as Actions from '../../../actions/order';
import Loading from 'components/Common/Loading';
import OrderDetails from './Dialog/index.js';
import message from 'components/Common/message';
import moment from 'moment';

import './style.scss';
import { formatMoney } from '../../../utils/tools';
import { getDate } from '../../../utils/date';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
class AfterSales extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      //服务单号
      saleNumber: '',
      // 预定日期	
      createTimeStartStr: '',
      // 预定日期	
      createTimeEndStr: '',
      //服务单状态
      saleStatus: 0,
      //类型
      saleType: 0,
      //订单号码
      orderNumber: '',
      //商品名称
      productName: '',
      //弹出框标题
      title: '服务单详情',
      orderDetails: null,
      showDetails: false,
      pn: 1,
      ps: 10
    }
  }

  componentDidMount() {
    // this.props.fetchList({ps: 10, pn: 1});
    this.getAllAfterSales();
  }
  pageChange = (page, ps) => {
    this.setState({ pn: page }, () => {
      this.getAllAfterSales();
    })
  } 
  getAllAfterSales = () => {
    const {
      saleNumber,
      createTimeStartStr,
      createTimeEndStr,
      saleStatus,
      saleType,
      orderNumber,
      productName,
      pn,
      ps
    } = this.state;
    //获取入库单列表
    this.props.getAllAfterSales({
      saleNumber,
      createTimeStartStr,
      createTimeEndStr,
      saleStatus,
      saleType,
      orderNumber,
      productName,
      pn,
      ps
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {
          saleNumber,
          saleStatus,
          saleType,
          orderNumber,
          saleOrderMessage } = values;
        this.setState({
          saleNumber,
          saleStatus,
          saleType,
          orderNumber,
          saleOrderMessage,
          pn: 1
        }, () => {
          this.getAllAfterSales();
        })
      }
    })
  }

  emptyHandle = () => {
    this.setState({
      saleNumber: '',
      createTimeStartStr: '',
      createTimeEndStr: '',
      saleStatus: 0,
      saleType: 0,
      orderNumber: '',
      saleOrderMessage: '',
      pn: 1
    }, () => {
      this.props.form.setFieldsValue({
        createTime: '',
        saleStatus: '0',
        saleOrderMessage: '',
      });
      this.getAllAfterSales();
    })
  }

  createTimeChange = (moment, dateStrings) => {
    this.setState({
      createTimeStartStr: dateStrings && dateStrings[0],
      createTimeEndStr: dateStrings && dateStrings[1]
    });
  }

  showDetails = (e, record) => {
    e.preventDefault();
    this.setState({ orderDetails: record, showDetails: true });
  }

  onCancel = () => {
    this.setState({ showDetails: false, record: null });
  }

  updateCallback = () => {
    this.setState({ showDetails: false, record: null });
  }
  
  render() {
    let columns = [{
      title: '服务单号',
      dataIndex: 'saleNumber',
      key: 'saleNumber',
      width: '15%'
    }, {
      title: '服务单状态',
      dataIndex: 'saleStatus',
      key: 'saleStatus',
      width: '10%',
      render: (text, record) => {
        switch (text) {
          case 1:
            return '待审核';
          case 2:
            return '已审核';
          case 3:
            return '已驳回';
        }
      }
    },
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: '10%',
      render: (text, record) => {
        return (
          <a href='#'>{text}</a>
        );
      }
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: '11%',
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
      title: '类型',
      dataIndex: 'saleType',
      key: 'saleType',
      width: '10%',
      render: (text, record) => {
        switch (text) {
          case 1:
            return '退款';
          case 2:
            return '退款退货';
        }
      }
    },
    {
      title: '退款金额',
      dataIndex: 'returnAmount',
      key: 'returnAmount',
      width: '10%',
      render: (text, record) => {
        return `¥ ${text}`
      }
    },
    {
      title: '申请时间',
      dataIndex: 'creatorName',
      key: 'creatorName',
      width: '12%',
      align: 'left',
      render: (text, record) => {
        return <span>{getDate(record.createTime, 'yyyy-MM-dd HH:mm:ss')}</span>;
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
                  label='申请时间'
                >
                  {getFieldDecorator('createTime')(
                    <RangePicker style={{ width: 200 }} onChange={(moment, dateStrings) => this.createTimeChange(moment, dateStrings)} />
                  )}
                </FormItem>
                <FormItem
                  label='服务单状态'
                >
                  {getFieldDecorator('saleStatus', { initialValue: '0' })(
                    <Select style={{ width: 100 }}>
                      <Option value="0">全部</Option>
                      <Option value="1">待审核</Option>
                      <Option value="2">已审核</Option>
                      <Option value="3">已驳回</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label=''
                >
                  {getFieldDecorator('saleOrderMessage')(
                    <Input style={{ width: 200 }} placeholder='商品名称/订单号' />
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
        {this.state.showDetails && <OrderDetails
          visible={this.state.showDetails}
          onCancel={this.onCancel}
          title={this.state.title}
          orderDetails={this.state.orderDetails}
          rejectHandle={this.rejectHandle}
          okHandle={this.okHandle}
        />}

        <Loading display={this.props.loading ? 'block' : 'none'} />
      </div >
    );
  }
}

function mapStateToProps(state) {
  let afterSales = state.get('afterSales') && state.get('afterSales').toJS() || {};
  return {
    ...afterSales
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AfterSales));
