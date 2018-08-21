import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, Icon, Tabs, Select, Form, Input, InputNumber, Radio, Table, Upload, Checkbox } from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import ImgUpload from 'components/Common/ImgUpload';
import Loading from 'components/Common/Loading';
import MyRichEditor from 'components/Common/MyRichEditor'
import AddSupplier from './addSupplier';
import BatchUpdate from './batchUpdate';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import Config from 'config';
import {getDate} from 'utils/date';
import {formatMoney} from '../../../../utils/tools'
import intl from 'react-intl-universal';
import {COMMODITY} from '../../../../constants/actionApi.js';
import moment from 'moment';
import './supplier.scss';

const url_prefix = Config.env[Config.scheme].prefix;

class Supplier extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showModal: false
        };
        this.getSkuCols = this.getSkuCols.bind(this);
    }
    componentDidMount() {
        if (!this.props.skus) {
            this.props.fetchSkus({spuId: this.props.basic.id});
        }
        if (!this.props.priceList) {
            this.props.fetchPriceList();
        }
        if (!this.props.marketPrice) {
            this.props.fetchMarketPrice();
        }
    }
    // 批量更新
    batchUpdate() {
        const {skus={}, supplierList=[]} = this.props;
        if (!skus.skuResultList || !supplierList.length) {
            return;
        }
        else {
            this.setState({showBatchUpdate: true, updateList: supplierList.map(it => '')});
        }
    }
    // 供应商成本改变
    handleChange(lineIdx,idx, val) {
        let {skus={}} = this.props;
        skus.skuResultList[lineIdx].skuSuppliers[idx].buyPrice = val;
        this.props.skuChange(skus);
    }
    // 行上供应商选择
    lineCheck(lineIdx, idx, supplier, e) {
        let {skus={}} = this.props;
        skus.skuResultList[lineIdx].skuSuppliers[idx].checked = e.target.checked;
        this.props.skuChange(skus);
    }
    // 供应商全选
    allCheck(idx, supplier, e) {
        let {skus={}} = this.props;
        skus.skuResultList.forEach(it => {
            it.skuSuppliers[idx].checked = e.target.checked;
        });
        this.props.skuChange(skus);
    }
    // sku表格
    getSkuCols(list, supplierList) {
        let options = [];

        if (!list.length) {
            return [];
        }
        options = list[0].skuAttributes.map((it, idx) => {
            return {
                key: `${idx}`,
                dataIndex: `${idx}`,
                title: it.attributeName,
                render: (text, record, index) => ((record.skuAttributes || [])[idx] || {}).value
            }
        });
        if (supplierList.length) {
            options.push({
                title: '成本',
                children: supplierList.map((it, idx) => {
                    let len = list.filter(i => ((i.skuSuppliers || [])[idx] || {}).checked).length;
                    return {
                        key: 'sup' + idx,
                        dataIndex: 'supplier',
                        width: 150,
                        title: <Checkbox onChange={this.allCheck.bind(this, idx, it)} checked={len === list.length} indeterminate={len && len !== list.length} >{it.supplyName}</Checkbox>,
                        render: (text, record, index) => {
                            return (<div className="inline-items">
                                <Checkbox onChange={this.lineCheck.bind(this, index, idx, it)} checked={record.skuSuppliers[idx].checked} />
                                <InputNumber 
                                    className={this.state.submitCheck && record.skuSuppliers[idx].buyPrice === '' ? 'err' : ''}
                                    value={record.skuSuppliers[idx].buyPrice} 
                                    min={0} 
                                    onChange={this.handleChange.bind(this,index, idx)} 
                                    precision={2}
                                    step={1}
                                />
                            </div>);
                        }
                    };
                })
            });
        }
        options = options.concat([
            {
                title: '销售价',
                children: list[0].skuPrices.map((it, idx) => {
                    return {
                        key: 'price' + idx,
                        dataIndex: 'skuPrices',
                        title: it.priceTypeName,
                        width: 120,
                        render: (text, record, index) => record.skuPrices[idx].price ? formatMoney(record.skuPrices[idx].price * 10000) : record.skuPrices[idx].price
                    }
                })
            },
            {
                key: 'code',
                dataIndex: 'code',
                title: 'SKU商品编码',
                render: text => {
                    return text === '0' ? '' : text;
                }
            },
            {
                key: 'marketPrice',
                dataIndex: 'marketPrice',
                title: '市场价',
                width: 120,
                render: text => text ? formatMoney(text * 10000) : text
            }
        ]);
        return options;
    }
    // 保存
    onSubmit() {
        this.setState({submitCheck: true});
        let {skus=[], basic} = this.props;
        let skuResultList = skus.skuResultList;
        let noChecked = skuResultList.some(it => {
            return !it.skuSuppliers.some(it => it.checked);
        });
        let isReturn = skuResultList.some(it => {
            return it.skuSuppliers.some(it => it.checked && it.buyPrice === '');
        });
        if (noChecked) {
            message.warn('每个sku必须选择至少一个供应商');
            return;
        }
        if (isReturn) {
            message.warn('有必填项未填');
            return;
        }
        this.setState({saving: true});
        let list = [];
        skuResultList.map(i => {
            list = list.concat(i.skuSuppliers.filter(it => it.checked));
            list.forEach(it => {
                delete it.checked;
            });
        });
        this.props.fetchUpdateSuppliers(list, () => {
            message.success('操作成功');
            this.setState({saving: false});
            this.props.fetchSkus({spuId: basic.id});
        }, () => {
            message.warn('操作失败');
            this.setState({saving: false});
        });
    }
    // 设置默认供应商
    setDefault(idx, type) {
        if (type === 1) {
            return;
        }
        const {supplierList=[] } = this.props;
        supplierList.forEach((it, i) => {
            if (i === idx) {
                it.defaultSupplier = 1;
            }
            else {
                it.defaultSupplier = 2;
            }
        });
        this.props.saveSuppliers(supplierList, this.props.skus);
    }
    // 删除供应商
    handleDelete(idx) {
        const {supplierList=[] } = this.props;
        let id = supplierList.splice(idx, 1)[0].id;
        if (supplierList.length && !supplierList.some(it => it.defaultSupplier === 1)) {
            supplierList[0].defaultSupplier = 1;
        }
        this.props.saveSuppliers(supplierList, this.props.skus);
    }
    // 批量更新
    handleUpdate(callback) {
        callback && callback();
        let list  = this.state.updateList || [];
        this.setState({shouldCheck: true});
        if (list.some(it => it === '')) {
            message.warn('有必填项未填');
            return;
        }
        let {skus={}} = this.props;
        skus.skuResultList.forEach(it => {
            it.skuSuppliers.forEach((i, idx) => {
                i.buyPrice = list[idx];
            });
        });
        this.props.skuChange(skus);
        this.setState({showBatchUpdate: false, shouldCheck: false, updateList: null});
    }
    render () {
        const {skus={}, supplierList=[], skuLoading=false, ...props} = this.props;
        return (
            <div className="supplier-update-page">
                <Loading display={skuLoading ? 'block' : 'none'} />
                <div className="supplier-list">
                    <div className="title required">
                        {'供应商'}
                    </div>
                    <div className="content-list">
                        {
                            supplierList.map((it, idx) => {
                                return (
                                    <span key={idx} className={`choose-label ${it.defaultSupplier === 1 ? 'checked' : ''}`}>
                                        <span className="name-line" onClick={this.setDefault.bind(this,idx, it.defaultSupplier)}>{it.supplyName}</span>
                                        <a className="under-btn">
                                            {it.defaultSupplier === 1 ? '默认' : '设为默认'}</a>
                                        <a onClick={this.handleDelete.bind(this, idx)} className="inline-btn i-icon  icon-butongguo"></a>
                                    </span>
                                );
                            })
                        }
                    </div>
                    <div className="actions">
                        <a onClick={this.batchUpdate.bind(this)}>{'批量更新'}</a>
                        <a onClick={x => this.setState({showModal: true})}>{'选择供应商'}</a>
                    </div>
                </div>
                <Table
                    bordered
                    columns={this.getSkuCols(skus.skuResultList || [], supplierList)}
                    dataSource={(skus.skuResultList || []).map((it, idx) => Object.assign({}, it, {key: idx}))}
                    pagination={false}
                />
                <div className="btn-line">
                    <Button type="primary" onClick={this.onSubmit.bind(this)}>{'保存'}</Button>
                </div>
                {
                    this.state.showModal && <AddSupplier 
                        visible={this.state.showModal}
                        onCancel={x => this.setState({showModal: false})}
                        skus={skus}
                        supplierList={supplierList}
                        {...props}
                    />
                }
                {
                    this.state.showBatchUpdate && <Modal
                        visible={this.state.showBatchUpdate}
                        title="批量更新"
                        onCancel={x => this.setState({showBatchUpdate: false, shouldCheck: false, updateList: null})}
                        onOk={this.handleUpdate.bind(this)}
                    >
                        <div className="supplier-batch-update">
                        {
                            supplierList.map((it, idx) => {
                                return <FormItem key={idx} required label={it.supplyName}>
                                    <InputNumber 
                                    className={this.state.shouldCheck && this.state.updateList[idx] === '' ? 'err' : ''}
                                    value={this.state.updateList[idx]} 
                                    min={0} precision={2} step={1} 
                                    onChange={val => {
                                        let list = this.state.updateList || [];
                                        list[idx] = val === undefined ? '' : val;
                                        this.setState({updateList: [...list]});
                                    }} />
                                </FormItem>
                            })
                        }
                        </div>
                    </Modal>
                }
            </div>
        )
    }
}
export default Supplier;