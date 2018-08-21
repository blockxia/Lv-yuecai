import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, Icon, Tabs, Select, Form, Input, InputNumber, Radio, Table, Tooltip, Checkbox } from 'antd';
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
import './addSupplier.scss';

const url_prefix = Config.env[Config.scheme].prefix;

class AddSupplier extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
        this.getAttCols = this.getAttCols.bind(this);
    }
    componentDidMount() {
        if (!this.props.itemTypes) {
            this.props.fetchItemTypes();
        }
        this.props.fetchSuppliers({ps: 5, pn: 1});
    }
    componentWillUnmount() {
        this.props.clearSuppliers();
    }
    // 添加属性
    handleAdd() {
        let {selected=[]} = this.state;
        let {supplierList=[], suppliers=[]} = this.props;
        if (!selected.length) {
            message.warn('请先选择供应商');
            return;
        }
        if (supplierList.length >= 5) {
            message.warn('当前已有5个供应商，请先删除供应商后再添加');
            return;
        }
        if ((supplierList.length + selected.length) > 5) {
            message.warn(`最多可选择5个属性，当前最多可选择${5 - supplierList.length}个`);
            return;
        }
        let arr = suppliers.filter(it => selected.includes(it.id));
        supplierList = supplierList.concat(arr);
        if (supplierList.length && !supplierList.some(it => it.defaultSupplier === 1)) {
            supplierList[0].defaultSupplier = 1;
        }
        this.props.saveSuppliers(supplierList, this.props.skus);
        this.setState({selected: []});
    }
    // 搜索
    handleSearch() {
        let params = this.props.attParams;
        params.supplyName = this.state.supplyName || '';
        params.supplyGoods = this.state.supplyGoods || '';
        this.props.fetchSuppliers(params);
        this.setState({selected: []});
    }
    // 翻页
    pageChange(value) {
        let params = this.props.supParams;
        params.pn = value;
        this.props.fetchSuppliers(params);
        this.setState({selected: []});
    }
    getAttCols(types) {
        let columns = [
            {
                key: 'supplyName',
                title: '名称',
                dataIndex: 'supplyName'
            },
            {
                key: 'cityName',
                title: '所在城市',
                dataIndex: 'cityName',
                render: (text, record) => {
                    let {countryName = '', provinceName = '', cityName=''} = record;
                    let res = [];
                    countryName && res.push(countryName);
                    provinceName && res.push(provinceName);
                    cityName && res.push(cityName);
                    return res.join('-') || '暂无';
                }
            },
            {
                key: 'gradeName',
                title: '等级',
                dataIndex: 'gradeName'
            },
            {
                key: 'supplyGoods',
                title: '供应商品',
                dataIndex: 'supplyGoods',
                render: text => {
                    if (!text) {
                        return '';
                    }
                    let res = text.split(',').map(it => {
                        let id = +it.replace(/[{}]/g, '')
                        let type = types.filter(i => i.id === id)[0];
                        return type ? type.name : id;
                    }).join(',');
                    return <Tooltip title={res}><span className="inline-item-types">{res}</span></Tooltip>
                }
            }
        ];
        return columns;
    }
    render () {
        const {visible=false,supplierList=[], suppliers=[], supParams={}, supTotal=0, itemTypes=[], skus={}, ...props} = this.props;
        let spuInfoAttributeResults = skus.spuInfoAttributeResults || [];
        let {selected=[]} = this.state
        const rowSelection = {
            selectedRowKeys: selected,
            onChange: selectedRowKeys => {
                this.setState({selected: selectedRowKeys});
            },
            getCheckboxProps: record => ({
                title: 1,
                disabled: supplierList.map(it => it.id).includes(record.id), // 已添加的不可以选择
            })
        }
        return visible && <Modal
            visible={visible}
            title={<p style={{fontSize: 20, fontWeight: 600}}>{'选择属性'}<span style={{fontWeight: 'normal', fontSize: 12, color: 'red'}}>{'（属性最多可以选择3个）'}</span></p>}
            footerIsNull={true}
            width={650}
            onCancel={this.props.onCancel}
        >
            <div className="add-supplier-list">
                <div className="search-box">
                    <FormItem className="supplier-name" label={'供应商名称'}>
                        <Input onChange={e => this.setState({supplyName: e.target.value})} placeholder="供应商名称" />
                    </FormItem>
                    <FormItem className="supply-goods" label={'供应商品'}>
                        <Select defaultValue="" style={{width: '140px'}} onChange={val => this.setState({supplyGoods: val === '' ? '' : `{${val}}`})}>
                            {
                                [{id: '', name: '请选择'}].concat(itemTypes).map((it, idx) => {
                                    return <Option key={idx} value={it.id}>{it.name}</Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <Button onClick={this.handleSearch.bind(this)}>{'搜索'}</Button>
                </div>
                <div className="btn-line">
                    <a className="btns" onClick={this.handleAdd.bind(this)}>{'添加'}</a>
                </div>
                <div className="search-body">
                    <Table
                        bordered
                        rowSelection={rowSelection}
                        columns={this.getAttCols(itemTypes)}
                        dataSource={suppliers.map(it => Object.assign({}, it, {key: it.id}))}
                        pagination={{
                            pageSize: supParams.ps || 5,
                            pageCurrent: supParams.pn,
                            total: supTotal,
                            onChange: this.pageChange.bind(this)
                        }}
                    />
                </div>
            </div>
        </Modal>
    }
}
export default AddSupplier;