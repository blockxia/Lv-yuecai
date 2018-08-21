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
// import * as Actions from '../../../actions/PlatformSetting/finance';
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
            const {id='', cat1='', cat2='', cat3='', brandName='',
                name, code, supplierName, operator
            } = val;
            const params = {pn: 1, ps: 10}
            if (id) {
                params.id = id;
            }
            if (+cat1) {
                params.catalogPath = '/' + cat1 + '/';
            }
            if (+cat2) {
                params.catalogPath += cat2 + '/';
            }
            if (+cat3) {
                params.catalogPath += cat1 + '/';
            }
            if (name) {
                params.name = name;
            }
            if (code) {
                params.code = code;
            }
            if (supplierName) {
                params.supplierName = supplierName;
            }
            if (operator) {
                params.operator = operator;
            }
            if (brandName) {
                params.brandName = brandName;
            }
            console.log(params);
            this.props.fetchList && this.props.fetchList(params);
        })
    }
    clearSearch() {
        this.props.form.resetFields();
        this.props.fetchList && this.props.fetchList({pn: 1, ps: 10, status: 0})
    }
    render () {
        const {getFieldDecorator} = this.props.form;
        const {catalogs=[]} = this.props;
        const {cat1='', cat2=''} = this.state;
        let list1 = cat1 ? catalogs.filter(it => it.id === cat1)[0].catalogResults || [] : [];
        let list2 = cat2 ? list1.filter(it => it.id === cat2)[0].catalogResults || [] : [];
        return (
            <div className="spu-search">
                    <Form>
                    <div className="search-items">
                        <div className="line-item normal">
                            <FormItem>
                                {
                                    getFieldDecorator('id')(
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
                                        <Select onChange={val => this.setState({cat1: +val, cat2: 0, cat3: 0}, x => {
                                            this.props.form.setFieldsValue({cat2: '0', cat3: '0'});
                                        })}>
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
                                        <Select onChange={val => this.setState({cat2: +val, cat3: '0'}, x => {
                                            this.props.form.setFieldsValue({cat3: '0'});
                                        })}>
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
                                    getFieldDecorator('onSale',
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
                        </div>

                        <div className="search-items">
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
                                    getFieldDecorator('code')(
                                        <Input placeholder="商品编码" />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem className="supplierName">
                                {
                                    getFieldDecorator('supplierName')(
                                        <Input placeholder="供应商" />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem className="operator">
                                {
                                    getFieldDecorator('operator')(
                                        <Input placeholder="上架人" />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem className="brandName">
                                {
                                    getFieldDecorator('brandName')(
                                        <Input placeholder="品牌" />
                                    )
                                }
                            </FormItem>
                        </div>
                        </div>
                    </Form>
                
                <div className="search-btns">
                    <Button onClick={this.handleSearch.bind(this)} type="primary">{'查询'}</Button>
                    <Button onClick={this.clearSearch.bind(this)}>{'清空'}</Button>
                </div>
            </div>
        );
    }
}
export default Form.create()(SearchBox);