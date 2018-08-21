import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Form, Input, InputNumber, Radio } from 'antd';
import Loading from 'components/Common/Loading';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/PlatformSetting/priceType';
import './style.scss';

const priceStatus = {
  1: '正常',
  2: '停用'
};
class PriceType extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showUpdate: false,
      showDelete: false
    }
  }

  componentDidMount() {
    this.props.fetchList();
    this.props.fetchCommonVar();
  }

  getColumns() {
    return [
      {
        title: '价格ID',
        key: 'id',
        dataIndex: 'id'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: text => text || '暂无'
      },
      {
        title: '销售价',
        dataIndex: 'salePricePercent',
        key: 'salePricePercent',
        render: (text, row) => {
          return <span>
            {'=成本(进货价) + [成本(进货价) * '}
            {typeof text === 'number' ? text : <span style={{color: 'red'}}>?</span>}
            {'% + '}{typeof row.salePriceIncr === 'number' ? row.salePriceIncr : <span style={{color: 'red'}}>?</span>}{']'}
            </span>
        }
      },
      {
        title: '市场价',
        key: 'storePersent',
        dataIndex: 'storePersent',
        render: (text, row) => {
          return <span>
            {'=成本(进货价) + [成本(进货价) * '}
            {typeof text === 'number' ? text : <span style={{color: 'red'}}>?</span>}
            {'% + '}{typeof row.storeOther === 'number' ? row.storeOther : <span style={{color: 'red'}}>?</span>}{']'}
            </span>
        }
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: text => {
          let style = text === 2 ? {color: 'red'} : {};
          return <span style={style}>{priceStatus[text]}</span>
        }
      },
      {
        title: '创建人',
        key: 'operatorName',
        dataIndex: 'operatorName',
        render: text => text || '暂无'
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        render: text => text ? getDate(text, 'yyy-MM-DD HH:mm') : '暂无'
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          return (<div style={{textAlign: 'center'}}>
            <span onClick={x => this.setState({showUpdate: true, id: record.id, record})} style={{cursor: 'pointer', color: '#3AA6F5'}}>{`修改`}</span>
            {record.purchase ? null : <span onClick={x => this.setState({showDelete: true, id: record.id})} style={{cursor: 'pointer', color: '#3AA6F5',marginLeft: '10px'}}>{`删除`}</span>}
          </div>)
        }
      }
    ];
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
    this.props.deletePrice({id: this.state.id}, () => {
      callback && callback();
      this.setState({showDelete: false, id: null});
      this.props.fetchList();
    }, () => {
      callback && callback();
      message.error('操作失败');
      this.setState({showDelete: false, id: null});
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {list = [], total = 0, params, loading=false, commonLoading=false} = this.props
    return (
      <div className="price-type-content">
      <Loading display={loading || commonLoading ? 'block' : 'none'}/>
        <Button style={{margin: '15px 0'}} onClick={x => this.setState({showUpdate: true, id: null, record: null})} type="primary">{`增加价格类型`}</Button>
        <Table
          columns={this.getColumns()}
          rowKey="index"
          dataSource={list.map((it, idx) => Object.assign({}, it, {index: idx}))}   //数据源
          locale={
              {
                  emptyText:intl.get("lv.common.noData")
              }
          } 
          pagination={false}
          // onChange={this.handleTableChange}
          // pagination={{
          //     showQuickJumper: true,
          //     showTotal:(total, range) => `共${params.total || 0}条数据`,
          //     current: params.pn || 1,
          //     total: params.total || 0,
          //     pageSize: params.ps || 10,
          // }}
        />
        {this.state.showUpdate && <Modal
          visible={this.state.showUpdate}
          title={this.state.record ? '修改价格类型' : "增加价格类型"}
          width={550}
          onOk={this.handleSubmit.bind(this)}
          onCancel={x => {
            this.setState({showUpdate: false, id: null, record: null})}
          }
        >
        <div className="price-update-body">
          <Form>
            <div className="row">
              <span className='row-title'>{`名称：`}</span>
              <FormItem className="name">
                {
                  getFieldDecorator('name', {
                    initialValue: this.state.record ? this.state.record.name : '',
                    rules: [{required: true, message: '请填写价格类型名称'}]}
                  )(
                    <Input />
                  )
                }
              </FormItem>
            </div>
            <div className="row">
              <span className="row-title">{`销售价：成本(进货价) + [成本(进货价) * `}</span>
                <FormItem className="inline-form">
                {
                  getFieldDecorator('salePricePercent', {
                    initialValue: this.state.record ? this.state.record.salePricePercent : '',
                    rules: [{required: true, message: '必填, 数字'}]
                  })(
                    <InputNumber max={100} min={0} precision={2} />
                  )
                }
                </FormItem>
                <span className="row-title">{` % + `}</span>
                <FormItem className="inline-form">
                {
                  getFieldDecorator('salePriceIncr', {
                    initialValue: this.state.record ? this.state.record.salePriceIncr : '',
                    rules: [{required: true, message: '必填, 数字'}]
                  })(
                    <InputNumber min={0} precision={2} />
                  )
                }
                </FormItem>
                <span className="row-title">]</span>
            </div>
            {/* <div className="row">
              <span className="row-title">{`市场价：成本(进货价) + [成本(进货价) * `}</span>
                <FormItem className="inline-form">
                {
                  getFieldDecorator('storePersent', {
                    initialValue: this.state.record ? this.state.record.storePersent : '',
                    rules: [{required: true, message: '必填, 数字'}]
                  })(
                    <InputNumber max={100} min={0} precision={2} />
                  )
                }
                </FormItem>
                <span className="row-title">{` % + `}</span>
                <FormItem className="inline-form">
                {
                  getFieldDecorator('storeOther', {
                    initialValue: this.state.record ? this.state.record.storeOther : '',
                    rules: [{required: true, message: '必填, 数字'}]
                  })(
                    <InputNumber precision={2} />
                  )
                }
                </FormItem>
                <span className="row-title">]</span>
            </div> */}
            <div className="row">
                <span className="row-title">{`状态：`}</span>
                <FormItem>
                  {
                    getFieldDecorator('status', {
                      initialValue: this.state.record ? this.state.record.status : 1,
                      rules: [{required: true, message: '请选择价格状态'}]
                    })(
                      <RadioGroup >
                        <Radio value={1}>{`正常`}</Radio>
                        <Radio disabled={this.state.record && this.state.record.purchase} value={2}>{`停用`}</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
            </div>
          </Form>
        </div>
        </Modal>}
        {
          this.state.showDelete && <Modal
            visible={this.state.showDelete}
            title="提示"
            onOk={this.handleDelete.bind(this)}
            onCancel={x => this.setState({showDelete: false, id: null})}
          >
          <p style={{textAlign: 'center'}}>{`你确定要删除此价格类型吗？`}</p>
          <p style={{textAlign: 'center'}}>{`删除后将不能恢复`}</p>
          </Modal>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('priceType').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PriceType));
