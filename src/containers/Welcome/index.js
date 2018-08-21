import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import * as Tools from '../../utils/tools.js';
import  {getLocales} from '../../actions/locales.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Button } from 'antd';

import {Layout} from 'antd';
import './style.scss';

class Welcome extends Component {
  constructor(props, context) {
    super(props, context);
    
  }

  /*首次实例化*/
  componentDidMount() {
    this.props.getLocales();
  }

  render() {
    return (
      <div>
        欢迎访问旅悦CRM（物业选址系统）
        <Button type="primary">test</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.get('locales').toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    getLocales: bindActionCreators(getLocales, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Welcome)
