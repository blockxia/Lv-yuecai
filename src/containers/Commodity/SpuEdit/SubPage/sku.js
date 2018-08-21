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
import AddAttributes from './addAttribute';
import BatchUpdate from './batchUpdate';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import Config from 'config';
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import {COMMODITY} from '../../../../constants/actionApi.js';
import moment from 'moment';
import './sku.scss';

const url_prefix = Config.env[Config.scheme].prefix;

class SKU extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showModal: false
        };
        this.getAttCols = this.getAttCols.bind(this);
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
        const skus = this.props.skus || {};
        if (!skus.skuResultList) {
            return;
        }
        else {
            this.setState({showBatchUpdate: true});
        }
    }
    // 重新计算
    reCaculate() {
        let {skus={}, priceList=[], marketPrice=[]} = this.props;
        if (!skus.skuResultList) {
            return;
        }
        skus.skuResultList.forEach(line => {
            let val = line.standardPrice;
            line.skuPrices.forEach((it, idx) => {
                let newPrice = val === '' ? '' : val * priceList[idx].salePricePercent / 100 + priceList[idx].salePriceIncr
                it.price = isNaN(newPrice) ? '' : newPrice;
            });
            let marketRule = marketPrice[0];
            if (marketRule) {
                let va = val === '' ? '' : val * marketRule.salePricePercent / 100 + marketRule.salePriceIncr;
                line.marketPrice = isNaN(va) ? '' : va;
            }
            else {
                line.marketPrice = '';
            }
        });
        this.props.skuChange(skus);
    }
    // 选择属性值
    valueChange(lineIdx, idx, e) {
        let {skus={}} = this.props;
        let {spuInfoAttributeResults=[]} = skus;
        spuInfoAttributeResults[lineIdx].values[idx].checked = e.target.checked;
        this.props.attrChange(spuInfoAttributeResults, skus, this.props);
    }
    // 属性表格
    getAttCols() {
        return [
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
                    return (text || []).map((it, idx) => {
                        return <Checkbox checked={!!it.checked} key={idx} onChange={this.valueChange.bind(this, index, idx)}>{it.value}</Checkbox>
                    })
                }
            },
            {
                key: 'operation',
                dataIndex: 'operation',
                title: '操作',
                render: (text, record, index) => {
                    return (
                        <a onClick={this.deleteAttLine.bind(this, index)}>{'删除'}</a>
                    );
                }
            },
        ];
    }
    // 删除属性行
    deleteAttLine(index) {
        let {skus={}} = this.props;
        let {spuInfoAttributeResults=[]} = skus;
        spuInfoAttributeResults.splice(index, 1);
        this.props.attrChange(spuInfoAttributeResults, skus, this.props);
    }
    // sku表格
    getSkuCols(attributes, list, priceList) {
        let lens = attributes.map(it => (it.values || []).filter(i => i.checked).length || 1);
        let options = [];
        options = attributes.filter(it => (it.values || []).some(i => i.checked)).map((it, idx) => {
            return {
                key: `${idx}`,
                dataIndex: `${idx}`,
                title: it.name,
                render: (text, record, index) => {
                    let arr = lens.slice(idx + 1);
                    let num = 1;
                    if (arr.length) {
                        num = arr.reduce((a, b) => a* b);
                    }
                    return {
                        children: record.skuAttributes[idx].value,
                        props: {
                            rowSpan: num === 1 ? 1 : index % num === 0 ? num : 0
                        }
                    };
                }
            }
        });
        options = options.concat([
            {
                key: 'standardPrice',
                dataIndex: 'standardPrice',
                title: '售卖基准价',
                width: 120,
                render: (text, record, index) => {
                    return <InputNumber 
                        className={this.state.shouldCheck && text === '' ? 'err' : ''} 
                        onChange={this.changeStandard.bind(this, index)} 
                        min={0} precision={2} step={1} value={text} />
                }
            },
            {
                title: '销售价',
                children: priceList.map((it, idx) => {
                    return {
                        key: 'price' + idx,
                        dataIndex: 'skuPrices',
                        title: it.name,
                        width: 120,
                        render: (text, record, index) => {
                            
                            return <InputNumber 
                                className={this.state.shouldCheck && ((text || [])[idx] || {}).price === '' ? 'err' : ''} 
                                onChange={this.changePrice.bind(this, index, idx)} 
                                min={0} precision={2} step={1} value={((text || [])[idx] || {}).price} />
                        }
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
                render: (text, record, index) => {
                    return <InputNumber 
                        className={this.state.shouldCheck && text === '' ? 'err' : ''} 
                        onChange={this.changeMarket.bind(this, index)} 
                        min={0} precision={2} step={1} value={text} />
                }
            },
            {
                title: '是否上架',
                children: [
                    {
                        title: <Checkbox 
                            onClick={this.changeStatus.bind(this, -1)} 
                            checked={!list.some(it => it.status !== 1)}
                            indeterminate={list.some(it => it.status === 1) && list.some(it => it.status !== 1)}
                            >{'全部'}</Checkbox>,
                        key: 'status',
                        dataIndex: 'status',
                        render: (text, record, index) => {
                            return <Checkbox checked={text === 1} onClick={this.changeStatus.bind(this, index)} key={index}>{'上架'}</Checkbox>
                        }
                    }
                ]
            },
        ]);
        return options;
    }
    // 基准价改变
    changeStandard(index, val) {
        let {skus={}, priceList=[], marketPrice=[]} = this.props;
        let skuResultList = skus.skuResultList;
        if (val === undefined) {
            val = '';
        }
        skuResultList[index].standardPrice = val;
        skuResultList[index].skuPrices.forEach((it, idx) => {
            let newPrice = val === '' ? '' : val * priceList[idx].salePricePercent / 100 + priceList[idx].salePriceIncr
            it.price = isNaN(newPrice) ? '' : newPrice;
        });
        let marketRule = marketPrice[0];
        if (marketRule) {
            let va = val === '' ? '' : val * marketRule.salePricePercent / 100 + marketRule.salePriceIncr;
            skuResultList[index].marketPrice = isNaN(va) ? '' : va;
        }
        else {
            skuResultList[index].marketPrice = '';
        }
        skus.skuResultList = skuResultList;
        this.props.skuChange(skus);
    }
    // 配置价格变化
    changePrice(lineIdx, idx, val) {
        let {skus={}} = this.props;
        skus.skuResultList[lineIdx].skuPrices[idx].price = val === undefined ? '' : val;
        this.props.skuChange(skus);
    }
    // 价格变化
    changeMarket(idx, val) {
        let {skus} = this.props;
        skus.skuResultList[idx].marketPrice = val === undefined ? '' : val;
        this.props.skuChange(skus);
    }
    // 上架/下架
    changeStatus(index, e) {
        let {skus={}} = this.props;
        let {skuResultList=[]} = skus;
        if (index === -1) {
            skus.skuResultList = skuResultList.map(it => Object.assign({}, it, {status: e.target.checked ? 1 : 2}));
        }
        else {
            skus.skuResultList[index].status = e.target.checked ? 1 : 2;
        }
        this.props.skuChange(skus);
    }
    // 批量修改行价格
    updateLine(l) {
        let {skus={}} = this.props;
        skus.skuResultList.forEach(line => {
            line.standardPrice = l.standardPrice;
            line.skuPrices.forEach((it, idx) => {
                it.price = l.skuPrices[idx].price;
            });
            line.marketPrice = l.marketPrice;
        });
        this.props.skuChange(skus);
        this.setState({showBatchUpdate: false});
    }
    // 保存
    onSubmit() {
        this.setState({shouldCheck: true});
        let {skus=[], basic} = this.props;
        let skuResultList = skus.skuResultList;
        let isReturn = skuResultList.some(it => {
            return it.standardPrice === '' || it.marketPrice === '' || it.skuPrices.some(i => i.price === '');
        });
        if (isReturn) {
            message.warn('有必填项未填');
            return;
        }
        this.setState({saving: true});
        skuResultList.forEach(it => {
            it.standardPrice = it.standardPrice*10000;
            it.marketPrice = it.marketPrice*10000;
            it.skuPrices.forEach(i => {
                i.price = i.price * 10000;
            });
        });
        this.props.saveSku(skuResultList, () => {
            message.success('操作成功');
            this.setState({saving: false});
            this.props.fetchSkus({spuId: basic.id});
        }, () => {
            message.warn('操作失败');
            this.setState({saving: false});
        });
    }
    render () {
        const {skus={}, priceList=[], skuLoading=false, ...props} = this.props;
        return (
            <div className="sku-update-page">
                <Loading display={skuLoading ? 'block' : 'none'} />
                <div className="sku-title">
                    <div className="title">
                        {'SKU属性和价格'}
                        {(skus.skuResultList && !!skus.skuResultList.length) && <span className="sub-title">{`（共${skus.skuResultList.length}种）`}</span>}
                    </div>
                    <div className="actions">
                        <a onClick={this.batchUpdate.bind(this)}>{'批量更新'}</a>
                        <a onClick={this.reCaculate.bind(this)}>{'重新计算'}</a>
                        <a onClick={x => this.setState({showModal: true})}>{'选择属性'}</a>
                    </div>
                </div>
                <div className="muti-table">
                    <div className="row">
                        <div className="row-left">
                            <span>{'属性'}</span>
                        </div>
                        <div className="row-right">
                            <Table
                                bordered
                                columns={this.getAttCols()}
                                dataSource={skus.spuInfoAttributeResults || []}
                                rowKey={record => record.id}
                                pagination={false}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="row-left">
                            <span>{'价格'}</span>
                        </div>
                        <div className="row-right">
                            <Table
                                bordered
                                columns={this.getSkuCols(skus.spuInfoAttributeResults || [], skus.skuResultList || [], priceList)}
                                dataSource={(skus.skuResultList || []).map((it, idx) => Object.assign({}, it, {key: idx}))}
                                pagination={false}
                            />
                        </div>
                    </div>
                </div>
                {skus.skuResultList && skus.skuResultList.length  ? <div className="btn-line">
                    <Button type="primary" onClick={this.onSubmit.bind(this)}>{'保存'}</Button>
                </div> : null}
                {
                    this.state.showModal && <AddAttributes 
                        visible={this.state.showModal}
                        onCancel={x => this.setState({showModal: false})}
                        skus={skus}
                        {...props}
                    />
                }
                {
                    this.state.showBatchUpdate && <BatchUpdate
                        visible={this.state.showBatchUpdate}
                        onCancel={x => this.setState({showBatchUpdate: false})}
                        priceList={this.props.priceList || []}
                        marketPrice={this.props.marketPrice || []}
                        updateLine={this.updateLine.bind(this)}
                    />
                }
            </div>
        )
    }
}
export default SKU;