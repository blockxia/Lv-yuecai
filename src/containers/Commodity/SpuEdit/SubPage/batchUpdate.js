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
import './batchUpdate.scss';

const url_prefix = Config.env[Config.scheme].prefix;

class BatchUpdate extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            standardPrice: '',
            marketPrice: '',
            skuPrices: []
        };
        this.getAttCols = this.getAttCols.bind(this);
    }
    componentDidMount() {
        let priceList = this.props.priceList || [];
        let skuPrices = priceList.map(it => ({price: ''}));
        this.setState({
            skuPrices: [...skuPrices]
        });
    }
    componentWillUnmount() {
    }
    onOk(callback) {
        callback && callback();
        this.setState({shouldCheck: true});
        let {standardPrice, marketPrice, skuPrices=[]} = this.state;
        if (standardPrice === '' || marketPrice === '' || skuPrices.some(it => it.price === '')) {
            message.warn('有必填项未填');
            return;
        }
        this.props.updateLine({...this.state});
    }
    getAttCols(priceList) {
        return [
            {
                key: 'standardPrice',
                dataIndex: 'standardPrice',
                title: '售卖基准价',
                width: 120,
                render: (text, record, index) => {
                    return <InputNumber 
                        className={this.state.shouldCheck && text === '' ? 'err' : ''} 
                        onChange={this.changePrice.bind(this, 'standardPrice')} 
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
                                className={this.state.shouldCheck && record.skuPrices[idx].price === '' ? 'err' : ''} 
                                onChange={this.changePriceList.bind(this, idx)} 
                                min={0} precision={2} step={1} value={record.skuPrices[idx].price} />
                        }
                    }
                })
            },
            {
                key: 'marketPrice',
                dataIndex: 'marketPrice',
                title: '市场价',
                width: 120,
                render: (text, record, index) => {
                    return <InputNumber 
                        className={this.state.shouldCheck && text === '' ? 'err' : ''} 
                        onChange={this.changePrice.bind(this, 'marketPrice')} 
                        min={0} precision={2} step={1} value={text} />
                }
            },
        ];
    }
    changePrice(key, val) {
        val = val === undefined ? '' : val;
        if (key === 'marketPrice') {
            this.setState({marketPrice: val});
        }
        else {
            let {priceList=[], marketPrice=[]} = this.props;
            let skuPrices = this.state.skuPrices;
            let marketPrice1 = this.state.marketPrice;
            skuPrices.forEach((it, idx) => {
                let newPrice = val === '' ? '' : val * priceList[idx].salePricePercent / 100 + priceList[idx].salePriceIncr
                it.price = isNaN(newPrice) ? '' : newPrice;
            });
            let marketRule = marketPrice[0];
            if (marketRule) {
                let va = val === '' ? '' : val * marketRule.salePricePercent / 100 + marketRule.salePriceIncr;
                marketPrice1 = isNaN(va) ? '' : va;
            }
            else {
                marketPrice1 = '';
            }
            this.setState({
                standardPrice: val,
                skuPrices: [...skuPrices],
                marketPrice: marketPrice1
            });
        }
    }
    changePriceList(idx, val) {
        val = val === undefined ? '' : val;
        let skuPrices = this.state.skuPrices;
        skuPrices[idx].price = val;
        this.setState({skuPrices: [...skuPrices]});
    }
    render () {
        const {visible=false, priceList=[], marketPrice={}, ...props} = this.props;
        return visible && <Modal
            visible={visible}
            title="批量更新"
            width={600}
            onCancel={this.props.onCancel}
            onOk={this.onOk.bind(this)}
        >
            <div className="batch-update-body">
                <Table
                    bordered
                    columns={this.getAttCols(priceList)}
                    dataSource={[this.state].map((it, idx) => Object.assign({}, it, {key: idx}))}
                    pagination={false}
                />
            </div>
        </Modal>
    }
}
export default BatchUpdate;