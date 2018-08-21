import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import intl from 'react-intl-universal';
import * as Tools from '../../../../utils/tools.js';

import {fechEmployees, distributionRoles, deleteEmployees} from '../../../../actions/Settings/account';
import {fetchCountry} from '../../../../actions/country.js';

import GetCountryCodeBat from 'components/Common/GetCountryCodeBat';
import { Breadcrumb, Form, Input, Row, Col, Button, Table, Modal, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import AddEpyes from '../../../../components/Settings/Account/Employees/AddEpyes/index';
import EmployeRigister from '../../../../components/Settings/Account/Employees/EmployeRigister/index';
import AddRole from '../../../../components/Settings/Account/Employees/AddRoleModal/index';
import DeleteConfirm from 'components/Common/DeleteConfirm/index.js';

import {getCurrentLocale} from '../../../../utils/tools';

import './style.scss';

const lang_page_prefix = 'lv.settings.account.employees';

// 设置多语言
const currentLocale = Tools.getCurrentLocale();
intl.init({
  currentLocale,
  locales: {
    [currentLocale]: require(`../../../../locales/${currentLocale}.json`),
  },
});

const translate = (name,title) => {
  return intl.get(title);
}

class Employees extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      visible: false, //添加员工
      visible2: false, //注册员工
      visible3: false, //添加角色
      visible4:false,//删除弹框
      userName: '', // 员工账号
      userRealName: '', // 员工姓名
      defaultUserPhone:'',//默认的手机号
      defaultUserCountry:'',//默认手机区号
      currentRecord:'',//当前的记录record
      hotelManagerRecord:'',//当前的记录的配置门店的record
      columns: [
        { title: intl.get(`${lang_page_prefix}.columns.title`), dataIndex: 'name', key: 'name',width:200 },
        { title: intl.get(`${lang_page_prefix}.columns.realName`), dataIndex: 'realName', key: 'realName',width:240 },
        { title: intl.get(`${lang_page_prefix}.allocationRole`), dataIndex: 'roleName', key: 'roleName',className:'role-name',render: text => <div className="names">{text}</div> },
        { title: intl.get(`lv.common.operate`), dataIndex: 'control', width: 300,key: 'control',
          render: this.employeesControl.bind(this)
        }
      ]
    };
    //$('body').css('overflow','auto');
    $('body').attr('style', 'overflow:hidden !important;');
  }

  componentWillMount() {

  }

  showHotelManager(record) {
    this.setState({
      hotelManagerRecord:  record
    }, () => {
      $('.set-hotel-manager-pop-show').trigger('click');
    });
  }

  employeesControl(text, record, index){
    let userInfo = this.props.userInfo,
      users = userInfo.users || {},
      group = userInfo.group || {};
      
    if(group.creator === users.id){
      
    }
    if (text == 1) {
      return (
        <p className="employees-control">
          <a
            href="javascript:void(0)"
            className="control-look"
            onClick={this.distributionRoles.bind(this, record)}>
              <span>{translate('分配角色','lv.settings.account.employees.allocationRole')}</span>
          </a>
          <a href="javascript:void(0)"
            className="control-look"
            onClick={this.deleteEmployees.bind(this, record)}>
            <span>{translate('删除','lv.settings.account.employees.control.delete')}</span>
          </a>
        </p>
      )
    } else if (text == 2) {
      return (
        <p>
          {translate('无','lv.settings.account.employees.info.no')}
        </p>
      );
      return (
        <p className="employees-control">
          <a href="javascript:void(0)">admin</a>
          <a href="javascript:void(0)"
            className="control-look"
            onClick={this.deleteEmployees.bind(this, record)}>
            <span>{translate('删除','lv.settings.account.employees.control.delete')}</span>
          </a>
        </p>
      )
    } else if (text == 4) {
      return (
        // <p>{translate('无','lv.settings.account.employees.info.no')}</p>
        <p>
          {translate('无','lv.settings.account.employees.info.no')}
        </p>
      )
    } else {
      return (
        <p>
          <a
            href="javascript:void(0)"
            className="control-look"
            onClick={this.distributionRoles.bind(this, record)}>
            <span>{translate('分配角色','lv.settings.account.employees.allocationRole')}</span>
          </a>
          <a href="javascript:void(0)"
            className="control-look">
            <span>{translate('删除','lv.settings.account.employees.control.delete')}</span>
          </a>
        </p>
      )
    }
  }

  // 分配角色
  distributionRoles(data_record) {
    var promise = this.props.distributionRoles(data_record);
    promise.then(function(){
      this.openAddRoleMadel()
    }.bind(this))
  }

  // 删除角色
  deleteEmployees(data_record) {
    // 弹出删除框
    this.setState({
      visible4:true,
      currentRecord:data_record
    });
  }

  getTable() {
    if(this.props.employees.employeesList) {
      return (
        <Table
          className="employees-table"
          loading={false}
          pagination={{
            defaultCurrent: 1,
            pageSize: this.props.pageSize,
            current: this.props.currentPage,
            onChange: this.onChangePage.bind(this),
            total: this.props.employees.total
          }}
          dataSource={this.getDataSource()}
          columns={this.state.columns}
        />
      );
    }
  }

  getDataSource() {
    var data = this.props.employees.employeesList;
    if(!data.length){
      return null;
    }
    return data.map((item, key) => {
      return {
        key: key,
        userId: item.userInfo?item.userInfo.id:'',
        name: item.userInfo?item.userInfo.mobile:'',
        realName: item.userName || translate('无','lv.settings.account.employees.info.no'),
        roleName: item.roles.length
          ? item.roles.map((itemRoles) => {
            if(item.userGroup==2){
              return translate('管理员','lv.settings.account.employees.info.manager');
            }else if(item.userGroup==4){
              return translate('超级管理员','lv.settings.account.employees.info.supermanager');
            }else{
              return itemRoles.name;
            }
          }).join(', ')
          : this.dealRoleName(item),
        roleIds: item.roles.length
          ? item.roles.map((itemRoles) => {
            return itemRoles.id
          })
          : [],
        control: item.userGroup,
        master: item.master,
      }
    })
  }

  // 处理角色
  dealRoleName(data){
    if(data.userGroup==2){
      return translate('管理员','lv.settings.account.employees.info.manager');
    }else if(data.userGroup==4){
      return translate('超级管理员','lv.settings.account.employees.info.supermanager');
    }else{
      return translate('无','lv.settings.account.employees.info.no');
    }
  }

  // 添加员工账号
  handleClickAddEmployees() {
    this.setState({visible: true, visible2: false, visible3: false});
  }

  // 打开注册Madel
  openRigisterMadel() {
    this.setState({visible: false, visible2: true, visible3: false});
  }

  // 打开添加角色
  openAddRoleMadel() {
    this.setState({visible: false, visible2: false, visible3: true});
  }

  // 取消添加员工
  cancelAddEmployeesModal() {
    this.setState({visible: false, visible2: false, visible3: false});
  }

  // 取消添加角色
  cancelAddRoleMadel() {
    this.setState({visible: false, visible2: false, visible3: false});
  }

  // 取消添加角色
  cancelRigisterModal() {
    this.setState({visible3: false, visible2: false, visible: false})
  }

  handleChangeUserName(e) {
    this.setState({userName: e.target.value});
  }

  handleChangeUserRealName(e) {
    this.setState({userRealName: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let form = this.props.form;
    let userCurrentCountry = form.getFieldValue('prefix');
    if(this.state.userName){
      this.props.fechEmployees({ mobile: userCurrentCountry + '-' + this.state.userName, realName: this.state.userRealName, pn: 1, ps: this.props.pageSize})
    }else{
      this.props.fechEmployees({ mobile: '', realName: this.state.userRealName, pn: 1, ps: this.props.pageSize})
    }
  }


  // 处理国家信息
  dealCountry(areaCode) {
    if (areaCode.length == 4) {
      return areaCode;
    } else if (areaCode.length == 3) {
      return '0' + areaCode;
    } else if (areaCode.length == 2) {
      return '00' + areaCode;
    } else {
      return '000' + areaCode;
    }
  }

  cleanSearchRes(){
    this.setState({
      userName:'',
      userRealName:'',
    });
    this.props.fechEmployees({
      ps:this.props.pageSize,
      pn:1
    })
  }

  componentDidMount() {
    this.props.fetchCountry({lang: getCurrentLocale()});
    this.props.fechEmployees({
      ps:this.props.pageSize,
      pn:1
    });
  }
  onChangePage(page,pageSize){
    if(this.state.userName || this.state.userRealName){
      this.props.fechEmployees({
        ps:pageSize,
        pn:page,
        name: userCurrentCountry+'-'+this.state.userName,
        realName: this.state.userRealName,
      });
    }else{
      this.props.fechEmployees({
        ps:pageSize,
        pn:page,
      });
    }
  }


  setDefaultUserPhone(value){
    this.setState({
      defaultUserPhone:value
    });
  }

  setDefaultUserCountry(value){
    this.setState({
      defaultUserCountry:value
    });
  }


  // 清除搜索条件
  cleanSeachWhile(){
    this.setState({
      userName:'',
      userRealName:''
    });
  }


  hideDeleteConfirmModal(){
    this.setState({
      visible4:false
    })
  }

  okDeleteConfirmModal(){
    let _this = this;
    let data_record = this.state.currentRecord;
    this.setState({
      visible4:false
    },function(){
      let form = _this.props.form;
      let userCurrentCountry = form.getFieldValue('prefix');
      var promise = _this.props.deleteEmployees({userId: data_record.userId}).then(function() {
        _this.setState({
          userName: '', // 员工账号
          userRealName: '', // 员工姓名
        });
        _this.props.fechEmployees({
          ps:_this.props.pageSize,
          pn:1
        });
      })
    })
  }


  render() {
    let countryList = this.props.country.country;
    let {getFieldDecorator} = this.props.form;
    const prefixSelector = countryList && countryList.length&& getFieldDecorator('prefix', {
      initialValue: parseInt(countryList[0].code).toString()
    })(
      <GetCountryCodeBat getCountrycodeId="search-country" dataList={countryList}/>
    );

    return (

      <div className="employees-container">

        <div className="employees-condition">
          <Form onSubmit={this.handleSubmit.bind(this)} layout="horizontal">

            <Row className="employees-serch">
              <Col span={8}>
                <FormItem className="employees-input-item phone-addon" label={`${translate('员工账号','lv.settings.account.employees.accountno')}`} labelCol={{
                  span: 4
                }} wrapperCol={{
                  span: 18
                }}>
                  <Input addonBefore={prefixSelector} placeholder={`${translate('请输入手机号','lv.settings.account.employees.inputphoneno')}`} value={this.state.userName} onChange={this.handleChangeUserName.bind(this)}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem className="employees-input-item" label={`${translate('员工姓名','lv.settings.account.employees.name')}`} labelCol={{
                  span: 4
                }} wrapperCol={{
                  span: 18
                }}>
                  <Input value={this.state.userRealName} placeholder={`${translate('请输入员工姓名','lv.settings.account.employees.inputname')}`} onChange={this.handleChangeUserRealName.bind(this)}/>
                </FormItem>
              </Col>
              <Col span={7} offset={1}>
                <Button type="primary" htmlType="submit">
                  {translate('查询','lv.common.query')}
                </Button>
                <Button onClick={this.cleanSearchRes.bind(this)} style={{'marginLeft':'20px'}}>
                  {translate('清空','lv.common.empty')}
                </Button>
              </Col>

            </Row>
            <Row className="employees-null-row"></Row>

            <Row className="employees-add-box">
              <Col span={24}>
                <div onClick={this.handleClickAddEmployees.bind(this)}>
                  <span className='i-icon'>&#xe674;</span>
                  <span>{translate('添加员工账号','lv.settings.account.employees.control.adds')}</span>
                </div>
                <span className="employees-add-box-notes">{translate('可以设置多个不同角色员工账号，权限可随时变更','lv.settings.account.employees.info.moreroleset')}</span>
              </Col>
            </Row>

          </Form>
        </div>

        <div className="employees-table-container">
          {this.getTable()}
        </div>

        <AddEpyes
          countryList={this.props.country.country}
          onCancel={this.cancelAddEmployeesModal.bind(this)}
          visible={this.state.visible}
          openRigisterMadel={this.openRigisterMadel.bind(this)}
          openAddRoleMadel={this.openAddRoleMadel.bind(this)}
          defaultUserPhone={this.state.defaultUserPhone}
          defaultUserCountry={this.state.defaultUserCountry}
          setDefaultUserPhone={this.setDefaultUserPhone.bind(this)}
          setDefaultUserCountry={this.setDefaultUserCountry.bind(this)}
          cleanSeachWhile={this.cleanSeachWhile.bind(this)}
        />

        <EmployeRigister
          visible={this.state.visible2}
          countryList={this.props.country.country}
          onCancel={this.cancelRigisterModal.bind(this)}
          openAddRoleMadel={this.openAddRoleMadel.bind(this)}
          openAddEmployeMadel={this.handleClickAddEmployees.bind(this)}
          defaultUserPhone={this.state.defaultUserPhone}
          defaultUserCountry={this.state.defaultUserCountry}
          setDefaultUserPhone={this.setDefaultUserPhone.bind(this)}
          setDefaultUserCountry={this.setDefaultUserCountry.bind(this)}
          cleanSeachWhile={this.cleanSeachWhile.bind(this)}
        />

        <AddRole
          visible={this.state.visible3}
          countryList={this.props.country.data}
          allRoles={this.props.employees.allRoles}
          currentUser={this.props.employees.currentUser}
          onCancel={this.cancelAddRoleMadel.bind(this)}
          cleanSeachWhile={this.cleanSeachWhile.bind(this)}
          searchData={
            {
              userName:this.state.userName,
              userRealName:this.state.userRealName
            }
          }
          form={this.props.form}
        />

        <DeleteConfirm
          visible={this.state.visible4}
          title={`${translate('员工管理','lv.settings.account.employees.deleteconfirm.manage')}`}
          contentText={`${translate('删除后，该信息将被清空并不可恢复。您确定要删除该记录吗','lv.settings.account.employees.deleteconfirm.contentText')}?`}
          onOk={this.okDeleteConfirmModal.bind(this)}
          onCancel={this.hideDeleteConfirmModal.bind(this)}
          okText={`${translate('确认','lv.common.confirm')}`}
          cancelText={`${translate('取消','lv.common.cancel')}`}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  let employees = state.get('employees').toJS();
  return {
    employees: employees,
    country: state.get('country').toJS(),
    userInfo: state.get('userInfo').toJS(),
    currentPage: employees.currentPage,
    pageSize: employees.pageSize,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fechEmployees: bindActionCreators(fechEmployees, dispatch),
    fetchCountry: bindActionCreators(fetchCountry, dispatch),
    distributionRoles: bindActionCreators(distributionRoles, dispatch),
    deleteEmployees: bindActionCreators(deleteEmployees, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps,)(Form.create()(Employees));


// <Breadcrumb.Item>账号管理</Breadcrumb.Item>
// <Breadcrumb.Item>员工账号配置</Breadcrumb.Item>
