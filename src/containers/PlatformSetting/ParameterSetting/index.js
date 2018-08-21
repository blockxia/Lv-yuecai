import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Select, Form, Input, Radio } from 'antd';
import * as Actions from '../../../actions/PlatformSetting/ParameterSetting';
import ParameterItem from 'components/Common/ParameterItem/index.js';
import Loading from 'components/Common/Loading';
import ParameterItemWrapper from 'components/ParameterItemWrapper/index.js';
import './style.scss';

class ParameterSetting extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  componentDidMount() {
    // this.props.fetchList({ps: 10, pn: 1});
    this.props.getAllParameters();
  }
  render() {
    return (
      <div className="parameter-setting-content">
        {this.props.loading ? <Loading /> :
          <div>
            {this.props.list.map((typeItem, index) => {
              return <ParameterItemWrapper
                delParam={this.props.delParameter}
                updateParam={this.props.updateParameter}
                addParam = {this.props.createParameter}
                getAllParameters = {this.props.getAllParameters}
                key={index}
                typeItem={typeItem} />
            })}
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.get('parameterSetting').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ParameterSetting));
