/**
 * @authors wangchen
 * @date    2018-08-09
 * @module  首页
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Form, Input, InputNumber, Radio,Tabs ,Upload,Icon,Carousel} from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
import Templet from './Templet';
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../actions/HomePage/homePage';
import './style.scss';
import Config from 'config';

const url_prefix = Config.env[Config.scheme].prefix;
class HomePage extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      slideUpdate: false,
      showDelete: false,
      homePageDelete: false,
      previewVisible: false,
      previewImage: '',
      fileList: [{
      uid:-1,
      url:""
      }],
      imgFile:null,
      record:null
    }
  }

  componentDidMount() {
    this.props.fetchListSlide();
    this.props.fetchListTemplet();
  }

  setListSlide = () => {
    let listSlide = this.props.listSlide;
    let listContent = null;
    if(listSlide.length>0) {
      listContent = listSlide.map((elem,index) => {
        return(
          <div key={elem.id}><img src={elem.imgPath}/></div>
        )
      })
    }
    return listContent;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {listSlide = [],listHomePage = [], total = 0, params, loading=false, commonLoading=false} = this.props;
    const { previewVisible, previewImage, fileList ,record} = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <div className="homePage-content">
        <Carousel autoplay>
          {this.setListSlide()}
        </Carousel>
        <Templet/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('homePage').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(HomePage));
