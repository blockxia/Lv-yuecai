import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { bindActionCreators } from 'redux';
import { Input, Form, Button, Radio, Row, Col, Modal } from 'antd';
import { connect } from 'react-redux';
import * as Tools from 'utils/tools.js';
import * as Actions from '../../../actions/PlatformSetting/finance'
import './style.scss';

const FormItem = Form.Item;

const invoiceType = {
  1: '普通发票',
  2: '增值税专用发票'
};
class Invoice extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.renderList = this.renderList.bind(this);
  }

  componentDidMount() {
    this.props.fetchInvoice();
  }

  renderList(line, idx) {
    return <div className="account-line" key={idx}>
      <div className="account-info">
        <div className="info-line">
          <span className="left">{`发票类型：`}</span>
          <span className="right">{invoiceType[line.type]}</span>
        </div>
        <div className="info-line">
          <span className="left">{`发票抬头：`}</span>
          <span className="right">{line.companyName || '暂无'}</span>
        </div>
        <div className="info-line">
          <span className="left">{`纳税人识别码：`}</span>
          <span className="right">{line.taxpayerNumber || '暂无'}</span>
        </div>
        {
          +line.type === 1 && <div className="info-line">
          <span className="left">{`发票内容：`}</span>
          <span className="right">{line.content || '暂无'}</span>
        </div>
        }
        {
          +line.type === 2 && <div className="info-line">
            <span className="left">{`注册地址：`}</span>
            <span className="right">{line.regAddress || '暂无'}</span>
          </div>
        }
        {
          +line.type === 1 && <div className="info-line">
            <span className="left">{`注册电话：`}</span>
            <span className="right">{line.regTelephone || '暂无'}</span>
          </div>
        }
        {
          +line.type === 1 && <div className="info-line">
            <span className="left">{`开户银行：`}</span>
            <span className="right">{line.bankName || '暂无'}</span>
          </div>
        }
        {
          +line.type === 1 && <div className="info-line">
            <span className="left">{`银行账户`}</span>
            <span className="right">{line.bankCard || '暂无'}</span>
          </div>
        }
      </div>
      <div className="btns">
        <Button onClick={x => this.props.update(line.id, line)} type="primary">{`修改`}</Button>
      </div>
    </div>
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { invoiceList = []} = this.props;
    // const avatarUrl = (users && users.avatar) ? users.avatar : Imgs.accountLogo;
    return (
      <div className="bank-account-page">
      {invoiceList.map((it, idx) => this.renderList(it, idx))}
    </div>
    );
  }
}

function mapStateToProps(state) {

  return {
    ...state.get('finance').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...Actions}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(Invoice));
