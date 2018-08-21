/**
 * @author zhangwei
 * @date 2018-3-17 
 * @requires https://ant.design  Table
 * @module 前端通用组件->Table
 */
import React, { Component } from 'react';
import { Table as AntdTable } from 'antd';
import Pagination from '../Pagination';
import './style.scss';

export default class Table extends AntdTable {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        let paginationInfo = this.props.paginationInfo ? this.props.paginationInfo : false;
        return (
            <div>
                <AntdTable {...this.props} pagination={paginationInfo} />
                {/* {this.props.paginationInfo ? (<div className="pagination"><Pagination {...this.props.paginationInfo}/></div>) : ""} */}
            </div>
        )
    }
}