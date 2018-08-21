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
    0: '状态',
    1: '正常',
    2: '停用'
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
            const {name='', showName="", status} = val;
            const params = {pn: 1, ps: 10}
            if (name) {
                params.name = name;
            }
            if (status) {
                params.status = +status;
            }
            if (showName) {
                params.showName = showName;
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
        return (
            <div className="attribute-search">
                <div className="search-items">
                    <Form>
                        <div className="line-item normal">
                            <FormItem>
                                {
                                    getFieldDecorator('name')(
                                        <Input placeholder="名称" />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem>
                                {
                                    getFieldDecorator('showName')(
                                        <Input placeholder="显示名称" />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="line-item normal">
                            <FormItem className="status">
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