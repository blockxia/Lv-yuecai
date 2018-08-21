import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, Icon, Tabs, Select, Form, Input, InputNumber, Radio, Table, Upload, Checkbox } from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import ImgUpload from 'components/Common/ImgUpload';
import MyRichEditor from 'components/Common/MyRichEditor'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import Config from 'config';
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import moment from 'moment';
import './addAttribute.scss';

const url_prefix = Config.env[Config.scheme].prefix;

class AddAttribute extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showModal: false
        };
        this.getAttCols = this.getAttCols.bind(this);
    }
    componentDidMount() {
        this.props.fetchAttributes({ps: 5, pn: 1});
    }
    componentWillUnmount() {
        this.props.clearAttributes();
    }
    // 添加属性
    handleAdd() {
        let {selected=[]} = this.state;
        let {skus={}, attributes= []} = this.props;
        let {spuInfoAttributeResults=[]} = skus;
        if (!selected.length) {
            message.warn('请先选择属性行');
            return;
        }
        if (spuInfoAttributeResults.length >= 3) {
            message.warn('当前已有3个属性，请先删除属性后再添加');
            return;
        }
        if ((spuInfoAttributeResults.length + selected.length) > 3) {
            message.warn(`spu最多可拥有3个属性，当前最多可选择${3 - spuInfoAttributeResults.length}个`);
            return;
        }
        let atts = attributes.filter(it => selected.includes(it.id));
        spuInfoAttributeResults = spuInfoAttributeResults.concat(atts);
        this.props.attrChange(spuInfoAttributeResults, skus, this.props);
        this.setState({selected: []});
    }
    // 搜索
    handleSearch() {
        let params = this.props.attParams;
        params.showName = this.state.val || '';
        this.props.fetchAttributes(params);
        this.setState({selected: []});
    }
    // 翻页
    pageChange(value) {
        let params = this.props.attParams;
        params.pn = value;
        this.props.fetchAttributes(params);
        this.setState({selected: []});
    }
    getAttCols() {
        return [
            {
                key: 'id',
                dataIndex: 'id',
                title: '属性ID',
                render: text => text
            },
            {
                key: 'name',
                dataIndex: 'name',
                title: '名称'
            },
            {
                key: 'showName',
                dataIndex: 'showName',
                title: '显示名称'
            },
            {
                key: 'values',
                dataIndex: 'values',
                title: '属性值',
                render: (text, record, index) => {
                    return (record.values || []).map(it => it.value).join(',')
                }
            }
        ];
    }
    render () {
        const {visible=false, attributes=[], attParams={}, attTotal=0, skus={}, ...props} = this.props;
        let spuInfoAttributeResults = skus.spuInfoAttributeResults || [];
        let {selected=[]} = this.state
        const rowSelection = {
            hideDefaultSelections: true,
            selectedRowKeys: selected,
            onChange: selectedRowKeys => {
                this.setState({selected: selectedRowKeys});
            },
            getCheckboxProps: record => ({
                title: 1,
                disabled: spuInfoAttributeResults.map(it => it.id).includes(record.id), // 已添加的不可以选择
            })
        }
        return visible && <Modal
            visible={visible}
            title={<p style={{fontSize: 20, fontWeight: 600}}>{'选择属性'}<span style={{fontWeight: 'normal', fontSize: 12, color: 'red'}}>{'（属性最多可以选择3个）'}</span></p>}
            footerIsNull={true}
            width={550}
            onCancel={this.props.onCancel}
        >
            <div className="add-attribute-list">
                <div className="search-box">
                    <FormItem
                        label={'属性名称'}
                    >
                        <Input onChange={e => this.setState({val: e.target.value})} placeholder={'输入显示名称'} />
                    </FormItem>
                    <Button onClick={this.handleSearch.bind(this)} style={{marginLeft: '20px'}}>{'搜索'}</Button>
                </div>
                <div className="btn-line">
                    <a className="btns" onClick={this.handleAdd.bind(this)}>{'添加'}</a>
                </div>
                <div className="search-body">
                    <Table
                        bordered
                        rowSelection={rowSelection}
                        columns={this.getAttCols()}
                        dataSource={attributes.map(it => Object.assign({}, it, {key: it.id}))}
                        pagination={{
                            pageSize: attParams.ps || 5,
                            pageCurrent: attParams.pn,
                            total: attTotal,
                            onChange: this.pageChange.bind(this)
                        }}
                    />
                </div>
            </div>
        </Modal>
    }
}
export default AddAttribute;