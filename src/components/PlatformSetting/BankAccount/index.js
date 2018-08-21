import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { bindActionCreators } from 'redux';
import { Input, Form, Button, Radio, Row, Col, Modal } from 'antd';
import { connect } from 'react-redux';
import message from 'components/Common/message';
import * as Tools from 'utils/tools.js';
import * as Actions from '../../../actions/PlatformSetting/finance'
import './style.scss';
const FormItem = Form.Item;

const accountType = {
  1: '银行账户',
  2: '支付宝',
  3: '微信'
};
const accountStatusMap = {
  1: '正常',
  2: '停用'
}
class BankAccount extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.renderList = this.renderList.bind(this);
  }

  componentDidMount() {
    this.props.fetchAccountList();
  }
  handleDefault(id) {
    this.props.setDefault(id, () => {
      message.success('操作成功');
      this.props.fetchAccountList();
    }, () => {
      message.error('操作失败');
    });
  }
  renderList(line, idx) {
    return <div className="account-line" key={idx}>
      <div className="account-info">
        <div className="info-line">
          <span className="left">{`账户类型：`}</span>
          <span className="right">{accountType[line.accountType]}{+line.sysDefault === 1 && <span className="default-sign">{`默认账户`}</span>}</span>
        </div>
        {
          +line.accountType === 1 && <div className="info-line">
            <span className="left">{`账户名称：`}</span>
            <span className="right">{line.accountName || '暂无'}</span>
          </div>
        }
        {
          +line.accountType === 1 && <div className="info-line">
            <span className="left">{`开户银行：`}</span>
            <span className="right">{line.bankName || '暂无'}</span>
          </div>
        }
        <div className="info-line">
          <span className="left">{+line.accountType === 1 ? `账户名称：` : '账号：'}</span>
          <span className="right">{line.bankCard || '暂无'}</span>
        </div>
        <div className="info-line">
          <span className="left">{'状态：'}</span>
          <span className="right">{accountStatusMap[+line.status]}</span>
        </div>
      </div>
      <div className="btns">
        <Button onClick={x => this.props.update(line.id, line)} type="primary">{`修改`}</Button>
        {
          +line.sysDefault === 1 ? null : <Button onClick={x => this.handleDefault(line.id)} style={{marginLeft: '20px'}}>{`设为默认账户`}</Button>
        }
      </div>
    </div>
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {accountList = []} = this.props;
    // const avatarUrl = (users && users.avatar) ? users.avatar : Imgs.accountLogo;
    return (
      <div className="bank-account-page">
        {accountList.map((it, idx) => this.renderList(it, idx))}
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
)(Form.create()(BankAccount));
