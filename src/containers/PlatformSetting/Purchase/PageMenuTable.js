/**
 * @authors wangchen
 * @date    2018-08-01
 * @module  采购端设置
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Form, Input, InputNumber } from 'antd';
import Loading from 'components/Common/Loading';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const FormItem = Form.Item;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/PlatformSetting/purchase';
import './style.scss';


class PageMenuTable extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showUpdate: false,
      showDelete: false
    }
  }

  componentDidMount() {
    this.props.fetchListHomePage();
  }

  getColumns() {
    return [
      {
        title: '菜单名称',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      }, {
        title: '菜单链接地址',
        dataIndex: 'link',
        editable: true,
      }, {
        title: '排序',
        dataIndex: 'weight',
        editable: true,
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
        callback && callback();
        return;
      }
      let id = this.state.id;
      if (id) {
        val.id = id;
      }
      this.props.updateListHomePage(val, !!id, () => {
        callback && callback();
        this.setState({showUpdate: false, id: null, record: null});
        this.props.fetchListHomePage();
      }, () => {
        callback && callback();
        message.error('操作失败');
      });
    });
  }
  // 删除确认
  handleDelete(callback) {
    this.props.deleteListHomePage({id: this.state.id}, () => {
      callback && callback();
      this.setState({showDelete: false, id: null});
      this.props.fetchListHomePage();
    }, () => {
      callback && callback();
      message.error('操作失败');
      this.setState({showDelete: false, id: null});
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {listHomePage = [], total = 0, params, loading=false, commonLoading=false} = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <div className="price-type-content">
      <Loading display={loading || commonLoading ? 'block' : 'none'}/>
        <div className='opt-container'>
          <div className="opt-right">
            <a href='#' onClick={x => this.setState({showUpdate: true, id: null, record: null})}>
              <i className="i-icon">&#xe699;</i>
              添加菜单
            </a>
          </div>
        </div>
        <Table
          columns={this.getColumns()}
          rowKey="index"
          dataSource={listHomePage.map((it, idx) => Object.assign({}, it, {index: idx}))}   //数据源
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
          title={this.state.record ? '修改菜单名称' : "增加菜单名称"}
          width={550}
          onOk={this.handleSubmit.bind(this)}
          onCancel={x => {
            this.setState({showUpdate: false, id: null, record: null})}
          }
        >
        <div className="purchase-row">
          <Form>
              <FormItem 
              label="菜单名称" 
              {...formItemLayout}>
                {
                  getFieldDecorator('name', {
                    initialValue: this.state.record ? this.state.record.name : '',
                    rules: [{required: true, message: '请填写菜单名称'}]}
                  )(
                    <Input />
                  )
                }
              </FormItem>
                <FormItem label="菜单链接地址" 
                {...formItemLayout}>
                {
                  getFieldDecorator('link', {
                    initialValue: this.state.record ? this.state.record.link : '',
                    rules: [{required: true, message: '请填写菜单链接地址'}]
                  })(
                    <Input />
                  )
                }
                </FormItem>
                <FormItem label="排序" 
                {...formItemLayout}>
                    {
                      getFieldDecorator('weight', {
                        initialValue: this.state.record ? this.state.record.weight : '',
                        rules: [{required: true, message: '必填, 数字'}]
                      })(
                        <InputNumber min={0} precision={0} />
                      )
                    }
                </FormItem>
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
          <p style={{textAlign: 'center'}}>{`你确定要删除此菜单吗？`}</p>
          <p style={{textAlign: 'center'}}>{`删除后将不能恢复`}</p>
          </Modal>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('purchase').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PageMenuTable));
