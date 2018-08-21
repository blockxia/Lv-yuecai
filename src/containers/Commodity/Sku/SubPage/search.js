import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Select, Form, Input, Radio, DatePicker } from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import './search.scss';

const STATUS_MAP = {
    0: '商品状态',
    1: '已上架',
    2: '未上架'
};
class SearchBox extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    }
    handleSearch() {
        this.props.form.validateFields((err, val) => {
            if (err) {
                return;
            }
            const {spuId='', cat1='', cat2='', cat3='', 
                name, status,supplierName
            } = val;
            const params = {pageNumber: 1, pageSize: 10}
            if (spuId) {
                params.spuId = spuId;
            }
            if (+cat3) {
                params.catalogId = +cat3;
            }
            else if (+cat2) {
                params.catalogId = +cat2;
            }
            else if (+cat1) {
                params.catalogId = +cat1;
            }
            if (name) {
                params.name = name;
            }
            if (supplierName) {
                params.supplierName = supplierName;
            }
            if (status) {
                params.status = status;
            }
            this.props.fetchList && this.props.fetchList(params);
        })
    }
    clearSearch() {
        this.props.form.resetFields();
        this.props.fetchList && this.props.fetchList({pageNumber: 1, pageSize: 10, status: 0})
    }
    render () {
        const {getFieldDecorator} = this.props.form;
        const {catalogs=[]} = this.props;
        const {cat1='', cat2=''} = this.state;
        let list1 = cat1 ? catalogs.filter(it => it.id === cat1)[0].catalogResults || [] : [];
        let list2 = cat2 ? list1.filter(it => it.id === cat2)[0].catalogResults || [] : [];
        return (
            <div className="spu-search">
                <div className="search-items">
                    <Form>
                        <div className="line-item normal">
                            <FormItem>
                                {
                                    getFieldDecorator('spuId')(
                                        <Input placeholder="SPUID" />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem className="onSale">
                                {
                                    getFieldDecorator('cat1',
                                        {
                                            initialValue: '0'
                                        }
                                    )(
                                        <Select onChange={val => this.setState({cat1: +val})}>
                                            {
                                                [{id: 0, name: '一级类目'}].concat(catalogs).map(it => {
                                                    return <Option key={it.id}>{it.name}</Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem className="onSale">
                                {
                                    getFieldDecorator('cat2',
                                        {
                                            initialValue: '0'
                                        }
                                    )(
                                        <Select onChange={val => this.setState({cat2: +val})}>
                                            {
                                                [{id: 0, name: '二级类目'}].concat(list1).map(it => {
                                                    return <Option key={it.id}>{it.name}</Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem className="onSale">
                                {
                                    getFieldDecorator('cat3',
                                        {
                                            initialValue: '0'
                                        }
                                    )(
                                        <Select onChange={val => this.setState({cat3: +val})}>
                                            {
                                                [{id: 0, name: '三级类目'}].concat(list2).map(it => {
                                                    return <Option key={it.id}>{it.name}</Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem className="onSale">
                                {
                                    getFieldDecorator('status',
                                        {
                                            initialValue: '0'
                                        }
                                    )(
                                        <Select>
                                            {
                                                Object.entries(STATUS_MAP).map(it => {
                                                    return <Option key={it[0]} code={it[0]}>{it[1]}</Option>
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem>
                                {
                                    getFieldDecorator('name')(
                                        <Input placeholder="商品名称" />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem>
                                {
                                    getFieldDecorator('supplierName')(
                                        <Input placeholder="供应商" />
                                    )
                                }
                            </FormItem>
                        </div>
                    </Form>
                </div>
                <div className="search-btns">
                    <Button onClick={this.handleSearch.bind(this)} type="primary">{'查询'}</Button>
                    <Button onClick={this.clearSearch.bind(this)}>{'清空'}</Button>
                </div>
            </div>
        );
    }
}
export default Form.create()(SearchBox);