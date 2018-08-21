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
// import * as Actions from '../../../actions/PlatformSetting/finance';
import './table.scss';

const STATUS_MAP = {
    0: '状态',
    1: '启用',
    2: '停用'
};
const TYPE_MAP = {
    0: '属性',
    1: '内部',
    2: '外部'
};
class AttributeTable extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            start: null,
            end: null
        };
        this.getColumns = this.getColumns.bind(this);
        this.getUpdateColumns = this.getUpdateColumns.bind(this);
        this.lineChange = this.lineChange.bind(this);
    }

    getColumns() {
        let columns = [
            {
                key: 'id',
                title: '属性ID',
                dataIndex: 'id'
            },
            {
                key: 'name',
                title: '名称',
                dataIndex: 'name'
            },
            {
                key: 'showName',
                title: '显示名称',
                dataIndex: 'showName'
            },
            {
                key: 'values',
                title: '属性值',
                align: 'left',
                dataIndex: 'values',
                width: 200,
                render: (text, record, index) => {
                    return <div className="inline-with-btn">
                        <span>{
                            text instanceof Array && text.length
                                ? text.map((it, idx) => {
                                    return it.value || ''
                                }).join('，')
                                : '暂无'
                        }</span>
                        <a className="link-btn" onClick={this.handleUpdate.bind(this, record)}>{'修改'}</a>
                    </div>
                }
            },
            {
                key: 'description',
                title: '说明',
                dataIndex: 'description'
            },
            {
                key: 'status',
                title: '状态',
                dataIndex: 'status',
                render: text => STATUS_MAP[text]
            },
            {
                key: 'creator',
                title: '创建人',
                dataIndex: 'creator'
            },
            {
                key: 'createTime',
                title: '最后修改时间',
                dataIndex: 'createTime',
                render: text => text ? getDate(text, 'yyyy-MM-DD HH-MM-SS') : '暂无'
            },
            {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                width: 40,
                render: (text, record) => {
                    return <div className="line-operation">
                        <a className="link-btn" onClick={x => this.props.showModal({id: record.id, record})}>{'修改'}</a>
                    </div>
                }
            },
        ];
        return columns;
    }
    getUpdateColumns() {
        return [
            {
                key: 'value',
                title: <span className="required">{'属性值'}</span>,
                dataIndex: 'value',
                width: '50%',
                render: (text, record, index) => {
                    return <Input className={!text && this.state.shouldCheck ? 'error' : ''} value={text || ''} onChange={e => this.lineChange(index, 'value', e.target.value)} onBlur={e => this.lineChange(index, 'value', e.target.value, true)} />
                }
            },
            {
                key: 'sequence',
                title: <span className="required">{'排序'}</span>,
                dataIndex: 'sequence',
                width: '30%',
                render: (text, record, index) => {
                    return <InputNumber 
                        className={!text && this.state.shouldCheck ? 'error' : ''}
                        value ={text || ''} 
                        precision={0} 
                        min={1}
                        max={99}
                        onChange={this.lineChange.bind(this, index, 'sequence')}/>
                }
            },
            {
                key: 'id',
                title: '操作',
                dataIndex: 'id',
                render: (text, record, index) => text ? null : <a onClick={this.lineDelete.bind(this, index)}>{'取消'}</a> 
            }
        ];
    }
    // 属性值 行内修改
    lineChange(idx, key, value, isTrim) {
        let line = this.state.line;
        line[idx][key] = isTrim ? value.trim() : value;
        this.setState({line: [...line]});
    }
    // 属性值 删除行
    lineDelete(idx) {
        let line = this.state.line;
        line.splice(idx, 1);
        this.setState({line: [...line]});
    }
    // 属性行点击修改属性值
    handleUpdate(record) {
        this.setState({
            showUpdate: true,
            record: {...record},
            line: [...(record.values || [])]
        });
    }
    // 属性值 添加行
    addLine() {
        let line = this.state.line;
        console.log(line,'line')
        line.push({});
        this.setState({line: [...line]});
    }
    // 属性值修改 保存
    handleUpdateLine(callback) {
        let {line, record} = this.state;
        let isEmpty = line.some(it => !it.value || !it.sequence);
        if (isEmpty) {
            message.warn('有必填项未填写！');
            this.setState({
                shouldCheck: true
            });
            callback();
            return;
        }
        let groupId = storage.get('groupId') || 1;
        let groupName = storage.get('groupName') || '旅悦集团';
        let param = line.map(it => Object.assign({}, {
            id: it.id || 0,
            attributeId: record.id,
            attributeName: record.name,
            value: it.value,
            groupId,
            groupName,
            sequence: it.sequence
        }));
        this.props.batchValuesUpdate({attributeValues: JSON.stringify(param)}, () => {
            message.success('操作成功');
            callback && callback();
            this.setState({
                showUpdate: false, 
                line: null, 
                record: null, 
                shouldCheck: false
            });
            setTimeout(x => {
                this.props.fetchList && this.props.fetchList(this.props.params);
            }, 1000);
        }, () => {
            message.warn('操作失败');
            callback && callback();
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
        return (
            <div className="attribute-table">
                <Table
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
                    this.state.showUpdate && <Modal
                        visible={this.state.showUpdate}
                        title="属性值修改"
                        width={500}
                        onOk={this.handleUpdateLine.bind(this)}
                        onCancel={x => this.setState({showUpdate: false, line: null, record: null, shouldCheck: false})}
                    >
                        <div className="line-attribute-update">
                            <div className="attribute-title">
                                <div className="row">
                                    <div>
                                        <span>{'名称'}</span>
                                        <span>{this.state.record.name || '暂无'}</span>
                                    </div>
                                    <div>
                                        <span>{'显示名称'}</span>
                                        <span>{this.state.record.showName || '暂无'}</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div>
                                        <span>{'说明'}</span>
                                        <span>{this.state.record.description || '暂无'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="attribute-body">
                                <div className="line-btns">
                                    <span className="btns">
                                    {this.state.line && this.state.line.length < 10 ? 
                                        <a onClick={this.addLine.bind(this)}>{'增加属性值'}</a>
                                        : null}
                                    </span>
                                </div>
                                <Table 
                                    bordered
                                    scroll={{y: 210}}
                                    columns={this.getUpdateColumns()}
                                    dataSource={this.state.line.map((it, idx) => Object.assign({}, it, {key: idx}))}
                                    pagination={false}
                                />
                            </div>
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}
export default AttributeTable;