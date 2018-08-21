/**
 * @authors sunlei
 * @date    2018-08-14
 * @module  搜索页
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, Breadcrumb, Tooltip, Table, Form, Input, InputNumber, Radio,Tabs ,Upload,Icon,Carousel,Pagination} from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import Loading from 'components/Common/Loading'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import * as Actions from '../../actions/search';
import Item from './Sub/item';
import './style.scss';
import Config from 'config';

const initQuery = location => {
  let arr = decodeURI(location.search).replace('?', '');
  if (arr) {
    let params = {};
    arr.split('&').map(it => {
      let [key, value] = it.split('=');
      params[key] = value;
    })
    return params;
  }
  return null;
}
class Search extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
    this.stopListening = null;
    this.getKey = this.getKey.bind(this);
    this.getCatlogs = this.getCatlogs.bind(this);
  }

  componentDidMount() {
    this.fetchData(window.location);
    this.stopListening = browserHistory.listen(this.fetchData.bind(this));
  }

  componentWillReceiveProps(next) {
    if (!(this.props.catlogs && this.props.catlogs.length) && next.catlogs && next.catlogs.length) {
      let query = initQuery(location);
      this.getCatlogs(query.path || '', next.catlogs || []);
    }
  }
  componentWillUnmount() {
    this.stopListening && this.stopListening();
  }
  fetchData(location) {
    if (location.pathname !== '/search') {
      return;
    }
    let query = location.query ? Object.assign({}, location.query, {name: decodeURI(location.query.name)}) : initQuery(location);
    let path = '';
    if (query) {
      path = query.path;
      delete query.path;
    }
    this.props.fetchItems(query || {pn: 1, ps: 20});
    if (query.name) {
      this.props.fetchCatalogList({commodityName: query.name});
    }
    this.getCatlogs(path, this.props.catlogs || []);
  }
  getKey(query, catlogs) {
    let key = '';
    if (!catlogs.length) {
      return '';
    }
    if (query && query.name) {
      return query.name;
    }
    if (query && query.path) {
      query.path.split('|').map(it => {
        key = catlogs.filter(l => l.id === +it)[0].name;
        catlogs = catlogs.filter(l => l.id === +it)[0].catalogResults;
      });
      return key
    }
  }
  getCatlogs(path, catlogs) {
    if (path && catlogs.length) {
      path.split('|').map((it, idx) => {
        if (idx !== 2) {
          catlogs = catlogs.filter(l => l.id === +it)[0].catalogResults || [];
        }
        else {
          catlogs = catlogs.filter(l => l.id === +it);
        }
      });
      this.props.setCatalogList(catlogs.map(it => Object.assign({}, it, {path: `${it.path}${it.id}/`})));
    }
  }
  handlePageChange(page) {
    let pathname = window.location.pathname;
    let search = window.location.search;
    let search1 = search.replace(/pn=\d+/, `pn=${page}`);
    browserHistory.push(pathname + search1);
  }
  sortChange(type, val) {
    let query = initQuery(location);
    delete query.salesOrder;
    delete query.priceOrder;
    if (type === 'default') {
      let url = `/search?${Object.entries(query).map(it => `${it[0]}=${it[1]}`).join('&')}`;
      browserHistory.push(url);
    }
    else {
      query[type] = val;
      let url = `/search?${Object.entries(query).map(it => `${it[0]}=${it[1]}`).join('&')}`;
      browserHistory.push(url);
    }
  }
  render() {
    const {loading=false, list=[], total = 0, params={}, catlogs=[], catalogList=[]} = this.props;
    let query = initQuery(location) || {};
    let key = this.getKey(query, catlogs);
    let cats = [...catlogs];
    return (
      <div className="search-content">
        <Breadcrumb className="persional-bread" separator=">">
          <Breadcrumb.Item>{'首页'}</Breadcrumb.Item>
          {key 
              ? query.name 
                  ? <Breadcrumb.Item><span className="title-bread"><Tooltip title={query.name}>{query.name}</Tooltip></span></Breadcrumb.Item>
                  : (query.path || '').split('|').map((it, idx) => {
                    let name = cats.filter(l => l.id === +it)[0].name
                    cats = cats.filter(l => l.id === +it)[0].catalogResults;
                    return <Breadcrumb.Item key={idx}><span className="title-bread"><Tooltip title={name}>{name}</Tooltip></span></Breadcrumb.Item>
                  })
              : <Breadcrumb.Item>{'全部'}</Breadcrumb.Item>
          }
        </Breadcrumb>
        <Loading display={loading ? 'block' : 'none'} />
        {!loading && !list.length ? null : <div className="search-list">
          {query.path && <div className="catalog-line search-item-line">
            <div className="title">{'分类：'}</div>
            <div className="content-line">
              {
                catalogList.map((it, idx) => {
                    return <a key={idx} onClick={x => {
                      let path = it.path.split('/').filter(i => !!i).join('|');
                      let q = initQuery(location);
                      q.path = path;
                      delete q.name;
                      let url = `/search?${Object.entries(q).map(it => `${it[0]}=${it[1]}`).join('&')}`;
                      browserHistory.push(url);
                    }}>{it.name}</a>
                })
              }
            </div>
          </div>}
          <div className="search-item-line">
            <div className="title">{'排序：'}</div>
            <div className="content-line">
              <a className={params.salesOrder || params.priceOrder ? '' : 'active'} onClick={this.sortChange.bind(this, 'default')}>{'默认'}</a>
              <a className={`sort-item ${params.salesOrder 
                  ? +params.salesOrder === 1 ? 'up active' : 'down active' : ''}`}
                onClick={this.sortChange.bind(this, 'salesOrder', +params.salesOrder === 1 ? 2 : 1)}
              >{'热销'}<i className="up-icon"></i><i className="down-icon"></i></a>
              <a className={`sort-item ${params.priceOrder 
                  ? +params.priceOrder === 1 ? 'up active' : 'down active' : ''}`}
                  onClick={this.sortChange.bind(this, 'priceOrder', +params.priceOrder === 1 ? 2 : 1)}
              >{'价格'}<i className="up-icon"></i><i className="down-icon"></i></a>
            </div>
          </div>
          <p className="total-count">{`共搜到${total || 0}个商品`}</p>
        </div>}
        <div className="item-list">
          {
            !loading && list.length  ? list.map((it, idx) => {
              return <Item key={idx} item={it} />
            }) : null
          }
        </div>
        {!loading && list.length ? <div className="item-pagination">
          <Pagination 
            total={total || 0} 
            pageSize={+params.ps || 1}
            current={+params.pn || 20}
            onChange={this.handlePageChange.bind(this)}
          />
        </div> : <div className="no-search-data">
          <div className="no-data-img"></div>
          <p>{`抱歉！没有找到“${key || ''}”相关的商品`}</p>
        </div>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('search').toJS(),
     catlogs: state.get('catlogs').toJS().list || []
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);
