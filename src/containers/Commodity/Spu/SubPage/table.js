import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, Table, Tooltip, Input, InputNumber } from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import storage from '../../../../utils/storage';
import './table.scss';

const STATUS_MAP = {
    1: '已上架',
    2: '未上架'
};
class SpuTable extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selected: []
        };
        this.getColumns = this.getColumns.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
    }

    getColumns() {
        let columns = [
            {
                key: 'id',
                title: 'SPUID',
                dataIndex: 'id'
            },
            {
                key: 'code',
                title: '商品编码',
                dataIndex: 'code'
            },
            {
                key: 'name',
                title: '商品名称',
                dataIndex: 'name',
                render: text => <Tooltip title={text}>{text}</Tooltip>
            },
            {
                key: 'catalogNamePath',
                title: '所属类目',
                dataIndex: 'catalogNamePath'
            },
            {
                key: 'brandName',
                title: '品牌',
                dataIndex: 'brandName'
            },
            {
                key: 'description',
                title: '供应商',
                dataIndex: 'description',
                render: text => <Tooltip title={text}>{text}</Tooltip>
            },
            {
                key: 'onSale',
                title: '商品状态',
                dataIndex: 'onSale',
                render: text => STATUS_MAP[text]
            },
            {
                key: 'operator',
                title: '上架人',
                dataIndex: 'operator'
            },
            {
                key: 'operateTime',
                title: '上架时间',
                dataIndex: 'operateTime',
                render: text => text ? getDate(text, 'yyyy-MM-dd HH:mm:ss') : '暂无'
            },
            {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                width: 170,
                render: (text, record) => {
                    return <div className="line-operation">
                        <a className="link-btn" onClick={x => browserHistory.push('/commodity/spuView/' + record.id)}>{'查看'}</a>
                        {+record.onSale !== 1 && <a className="link-btn" onClick={x => browserHistory.push('/commodity/spuEdit/' + record.id)}>{'修改'}</a>}
                        { +record.onSale !== 1 && <a className="link-btn" onClick={this.handleDelete.bind(this, record.id)}>{'删除'}</a>}
                        <a className="link-btn" onClick={x => this.setState({showStateConfirm: true, record: record})}>{+record.onSale === 1 ? '下架' : '上架'}</a>
                        { +record.onSale === 1 && <a className="link-btn" onClick={x => console.log('预览')}>{'预览'}</a>}
                    </div>
                }
            },
        ];
        return columns;
    }
    // 删除
    handleDelete(id) {
        console.log(id);
    }
    // 上/下 架
    handleChangeStatus(callback) {
        const {record={}, selected=[], isMuti=false} = this.state;
        const {users} = this.props;
        let params = {
            ids: isMuti ? selected.join(',') : record.id.toString(),
            onSale: isMuti ? 1 : record.onSale === 1 ? 2 : 1,
            operator: users.realName
        };
        this.props.changeStatus && this.props.changeStatus(params, () => {
            message.success('操作成功');
            callback();
            this.setState({
                showStateConfirm: false,
                record: null,
                isMuti: false,
                selected: []
            });
            setTimeout(x => this.props.fetchList(this.props.params), 1000);
        }, () => {
            message.warn('操作失败');
            callback();
            this.setState({
                showStateConfirm: false,
                record: null,
                isMuti: false
            });
        });
    }
    // 翻页
    pageChange(val) {
        let params = this.props.params;
        params.pn = val;
        this.props.fetchList && this.props.fetchList(params);
    }
    render () {
        const {list = [], params ={}, total} = this.props;
        const rowSelection = {
            selectedRowKeys: this.state.selected || [],
            onChange: selectedRowKeys => {
                this.setState({selected: selectedRowKeys});
            },
            getCheckboxProps: record => ({
                disabled: record.onSale === 1,
            })
        }
        return (
            <div className="spu-table">
                <Table
                    rowSelection={rowSelection}
                    columns={this.getColumns()}
                    dataSource={list.map(it => Object.assign({}, it, {key: it.id}))}
                    pagination={{
                        current: params.pn || 1,
                        pageSize: params.ps || 10,
                        total: total || 0,
                        onChange: this.pageChange.bind(this),
                        showTotal: (total, range) => `总共${total}条数据，当前为第${params.pn || 1}页`
                    }}
                />
                {
                    this.state.showStateConfirm && <Modal
                        visible={this.state.showStateConfirm}
                        title="提示"
                        onCancel={x => this.setState({showStateConfirm: false, record: null, isMuti: false})}
                        onOk={this.handleChangeStatus}
                    >
                        {
                            this.state.isMuti || +this.state.record.onSale !== 1
                            ? <div >
                                <p style={{textAlign: 'center'}}>{'你确定要将此商品上架销售吗？'}</p>
                                <p style={{textAlign: 'center'}}>{'上架销售后将不能修改该商品的任何信息'}</p>
                            </div>
                            : <div>
                                <p style={{textAlign: 'center'}}>{'你确定要将此商品下架吗？'}</p>
                            </div>
                        }
                    </Modal>
                }
            </div>
        );
    }
}
export default SpuTable;