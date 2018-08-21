import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Select, Form, Input, Radio, Popover, Modal } from 'antd';
import Table from "components/Common/Table";
import * as Actions from '../../../actions/Commodity/brand';
import Loading from 'components/Common/Loading';
import EditBrand from './EditBrand/index.js';
import './style.scss';

const FormItem = Form.Item;
const Option = Select.Option;
class Brand extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: '',
      status: 0,
      pn: 1,
      ps: 10,
      brandLogo: '',
      showBrandLogo: false,
      editBrand: false,
      isEdit: false,
      brandData: null,
      title: '编辑品牌'
    }
  }

  componentDidMount() {
    // this.props.fetchList({ps: 10, pn: 1});
    this.getCommodityBrand();
  }
  pageChange = (page, ps) => {
    this.setState({ pn: page }, () => {
      this.getCommodityBrand();
    })
  }
  getCommodityBrand = () => {
    const { name, pn, ps, status } = this.state;
    //获取入库单列表
    this.props.getCommodityBrand({
      name, pn, ps, status
    });
  }
  //新增品牌
  addBrand = (e) => {
    e.preventDefault();
    this.setState({ editBrand: true, title: '新增品牌', isEdit: false });
  }
  //显示logo大图
  showBrandLogo = (logoUrl) => {
    this.setState({ brandLogo: logoUrl, showBrandLogo: true });
  }
  //取消显示logo大图
  showBrandLogoCancel = () => {
    this.setState({ showBrandLogo: false });
  }
  editBrandCancel = () => {
    this.setState({ editBrand: false });
  }
  editHandle = (e, record) => {
    e.preventDefault();
    this.setState({ brandData: record, editBrand: true, title: '编辑品牌', isEdit: true });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { name, status } = values;
        this.setState({ name, status, pn: 1 }, () => {
          this.getCommodityBrand();
        })
      }
    })
  }
  emptyHandle = () => {
    this.setState({ name: '', status: 0, pn: 1 }, () => {
      this.getCommodityBrand();
    })
  }
  render() {
    let columns = [{
      title: '品牌ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%'
    }, {
      title: '品牌名称',
      dataIndex: 'name',
      key: 'name',
      width: '10%'
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      width: '15%',
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
      title: '排序',
      dataIndex: 'sequence',
      key: 'sequence',
      width: '10%'
    },
    {
      title: '品牌LOGO',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: '10%',
      render: (text, record) => {
        return <div style={{ padding: '5px' }}>
          {/* <a href='#' onClick={} */}
          <img
            onClick={() => this.showBrandLogo(text)}
            width='50px' height='50px' style={{ cursor: 'pointer' }} src={text} />
        </div>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (text, record) => {
        switch (text) {
          case 1:
            return '正常';
          case 2:
            return '停用';
        }
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: '10%'
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: '10%'
    },
    {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      width: '10%',
      render: (text, record) => {
        return <a href='#' onClick={(e) => this.editHandle(e, record)}>修改</a>
      }
    }]
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='Commodity-brand-content'>
        <div className='list-search-condition'>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <div className='condition-container'>
              <div className='condition-form'>
                <FormItem
                  label='品牌名称'
                >
                  {getFieldDecorator('name')(
                    <Input placeholder='输入名称模糊查询' />
                  )}
                </FormItem>
                <FormItem
                  label='状态'
                >
                  {getFieldDecorator('status', { initialValue: '0' })(
                    <Select style={{ width: 120 }}>
                      <Option value="0">全部</Option>
                      <Option value="1">启用</Option>
                      <Option value="2">停用</Option>
                    </Select>
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
        <div className='opt-container'>
          <div className="opt-right">
            <a href='#' onClick={this.addBrand}>
              <i className="i-icon">&#xe699;</i>
              新增品牌
            </a>
          </div>
        </div>
        <div className='table-list-container'>
          <Table
            dataSource={this.props.list}
            columns={columns}
            rowKey='id'
            paginationInfo={{
              current: this.state.pn,
              showTotal: (total) => `共 ${this.props.total} 条`,
              defaultCurrent: 0,
              total: this.props.total,
              onChange: this.pageChange
            }}
            locale={{ emptyText: '暂无数据' }} />
        </div>
        {this.state.showBrandLogo &&
          <Modal
            title=""
            visible={this.state.showBrandLogo}
            onCancel={this.showBrandLogoCancel}
            wrapClassName='preview-img'
          >
            <div><img src={this.state.brandLogo} alt="" /></div>
          </Modal>
        }
        {this.state.editBrand && <EditBrand
          isEdit={this.state.isEdit}
          brandData={this.state.brandData}
          editBrand={this.state.editBrand}
          title={this.state.title}
          editBrandCancel={this.editBrandCancel}
          getCommodityBrand={this.getCommodityBrand}
        />}
      </div >
    );
  }
}

function mapStateToProps(state) {
  let brand = state.get('brand') && state.get('brand').toJS() || {};
  return {
    ...brand
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Brand));
