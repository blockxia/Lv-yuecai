/**
 * @authors wangqinqin
 * @date    2017-08-022
 * @module  头部酒店下拉菜单
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Menu, Dropdown, Icon } from 'antd';
import intl from 'react-intl-universal';
import './style.scss';

const MenuItem = Menu.Item;

class MenuList extends Component {

  componentDidMount() {
    this.initData();
  }
  componentDidUpdate() {
    this.initData();
  }
  componentWillUnmount() {
    $(`#${this.props.getCountrycodeId}`).select2('destroy');
  }

  initData() {
    let _this = this;
    const initialHotel = sessionStorage.getItem('attachments');
    $(`#${this.props.getCountrycodeId}`).select2({
      width: 'resolve',
      dropdownCssClass: 'header-hotelList',
      language: {
        noResults: function () {
          return intl.get('lv.common.global.search.noResult');
        }
      }
    });
    if (initialHotel) {
      $(`#${this.props.getCountrycodeId}`).val([initialHotel]).trigger('change');
    } else {
      $(`#${this.props.getCountrycodeId}`).val([this.props.attachments && this.props.attachments[0] && this.props.attachments[0].id]).trigger('change');
    }
    $(`#${this.props.getCountrycodeId}`).on('select2:select', function (e) {
      const data = e.params.data;
      const hotelId = data.id;
      _this.dropdownValue({key: hotelId})
    });
  }

  /**
  * 切换酒店名称
  */
  dropdownValue = (item) => {
    $('#music').trigger('click');
    sessionStorage.setItem('attachments', item.key);
    sessionStorage.removeItem('currentMenuCode');
    sessionStorage.removeItem('pageUrl');
    window.location.href = '/';
  }

  createDom() {
    const attachmentsList = this.props.attachments && this.props.attachments.length && this.props.attachments.map((item, i) => {
      return <option key={i} value={item.id} data-name={item.name}>{item.name}</option>;
    });
    return (
      <div>
        <select style={{width:"220px"}} id={this.props.getCountrycodeId}>
          {attachmentsList}
        </select>
      </div>
    );
  }

  render() {
    return (
      <div className="header-hotelList">
        {
          this.props.attachments ? this.createDom() : null
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userInfo = state.get('userInfo').toJS();
  const attachments = userInfo.attachments;
  const hotelNameVal = userInfo.hotelName;
  return {
    attachments,
    hotelNameVal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuList);
