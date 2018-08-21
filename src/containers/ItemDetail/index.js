/**
 * @authors sunlei
 * @date    2018-08-16
 * @module  商品详情页
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
import {formatMoney} from 'utils/tools'
import intl from 'react-intl-universal';
import * as Actions from '../../actions/itemDetail';
import {fetchCartNum} from '../../actions/header';
import './style.scss';
import Config from 'config';
import InputPlus from './InputPlus';

const initQuery = location => {
  let arr = location.search.replace('?', '');
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
class ItemDetail extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      img: 0,
      path: undefined
    }
    this.stopListening = null;
    this.getItem = this.getItem.bind(this);
  }

  componentDidMount() {
    this.fetchData(window.location);
    this.stopListening = browserHistory.listen(this.fetchData.bind(this));
  }

  componentWillReceiveProps(next) {
    if (!this.state.path && Object.keys(next.detail || {}).length) {
      let path = next.detail.skuResultList[0].skuAttributes.map(it => it.id);
      this.setState({path: path});
    }
  }
  componentWillUnmount() {
    this.stopListening && this.stopListening();
  }
  fetchData(location) {
    if (location.pathname !== '/itemDetail') {
      return;
    }
    let query = location.query || initQuery(location);
    this.props.fetchItemDetail({spuId: query.spuId});
    if (query.path) {
      this.setState({path: query.path ? query.path.split('|') : null});
    }
    // this.getCatlogs(path, this.props.catlogs || []);
  }
  getItem(list) {
    let path = this.state.path;
    if (path) {
      return list.filter(it => it.skuAttributes.every((l, i) => l.id === +path[i]))[0] || {};
    }
    return list[0] || {}
  }
  addCart(params) {
    this.props.addCart(params, x => this.props.fetchCartNum());
  }
  render() {
    const {loading=false, detail={}, catlogs=[], catalogList=[]} = this.props;
    const {img=0, path=[]} = this.state;
    let {skuResultList = [], spuInfoAttributeResults = [], spuResult={}} = detail;
    let item = skuResultList ? this.getItem(skuResultList) : {};
    let keys = item.catalogNamePath ? item.catalogNamePath.split('/').filter(it => !!it) : [];
  const url = 'https://axhub.im/pro/2c176f905a592e7b/images/%E9%A6%96%E9%A1%B5/u2214.jpg';
    return (
      <div className="item-detail-content">
        <Breadcrumb className="persional-bread" separator=">">
          <Breadcrumb.Item>{'首页'}</Breadcrumb.Item>
          {
            keys.map((it, idx) => {
              return <Breadcrumb.Item key={idx}>
                <span className="title-bread"><Tooltip title={it}>{it}</Tooltip></span>
              </Breadcrumb.Item>
            })
          }
        </Breadcrumb>
        <Loading display={loading ? 'block' : 'none'} />
        <div className="basic-info">
          <div className="images">
            <div className="big-img" style={{background: `url('${url}') no-repeat center center`, backgroundSize: '100% 100%'}}></div>
            <div className="sm-img-list">
              {
                (spuResult.imageUrl || '').split('|').map((it, idx) => {
                  return <a 
                    onClick={x => this.setState({img: idx})} 
                    className={`sm-img ${this.state.img === idx ? 'active' : ''}`} key={idx} 
                    style={{background: `url(${url}) no-repeat center center`, backgroundSize: '100% 100%'}}></a>
                })
              }
            </div>
          </div>
          <div className="item-info">
            <p className="item-title">{spuResult.name || '暂无'}</p>
            <div className="price-info">
              <div className="price-line">
                <span className="title">{'价格'}</span>
                <span className=" underline price">{'￥' + formatMoney(item.maxMarketPrice || '')}</span>
              </div>
              <div className="new-price price-line">
                <span className="title">{'价格'}</span>
                <span className="price">{'￥' + formatMoney(item.maxMarketPrice || '')}</span>
              </div>
              <div className="other-info price-line">
                <span className="title">{'信息'}</span>
                <span>{`${item.includeFreight === 1 ? '含运费' : '不含运费'}，${item.includeTax === 1 ? '含税' : '不含税'} 商品编码：${spuResult.code}`}</span>
              </div>
            </div>
            {spuInfoAttributeResults && spuInfoAttributeResults.length ? <div className="att-info">
                {
                    spuInfoAttributeResults.map((it, idx) => {
                      return <div className="att-line" key={idx}>
                        <span className="title">{it.showName}</span>
                        <div className="att-items">
                          {
                            it.attributeValueResult instanceof Array && it.attributeValueResult.length 
                              ? it.attributeValueResult.map((l, i) => {
                                return <span key={i} 
                                  className={`att-item ${+path[i] === l.id ? 'selected' : ''}`}
                                  onClick={x => {
                                    let path = this.state.path || [];
                                    path[i] = l.id;
                                    browserHistory.push(`/itemDetail?spuId=${detail.spuId}&path=${path.join('|')}`);
                                  }}
                                >{l.value}</span>
                              }) 
                              : null
                          }
                        </div>
                      </div>
                    }) 
                }
            </div> : null}
            <div className="count-line">
              <span className="title">{'数量'}</span>
              <div className="count-content">
                <InputPlus  num={this.state.count || spuResult.minQuantity} 
                  onComplete={val => this.setState({count: val})} 
                  min={spuResult.minQuantity || 1}/>
                <span>{`起订数量：${spuResult.minQuantity || 1}`}</span>
              </div>
            </div>
            <div className="btn-lines">
                <Button size="large" onClick={x => {
                  browserHistory.push('/settlement/' + item.id)
                }} className=" special-btn ">{'立即购买'}</Button>
                <Button size="large" type="primary" 
                  onClick={this.addCart.bind(this, {
                    spuId: detail.spuId, 
                    skuId: item.id,
                    commodityNumber: this.state.count || spuResult.minQuantity
                    })}>{'加入购物车'}</Button>
            </div>
          </div>
        </div>
        <div className="item-detail">
          <p className="title">{'商品描述'}</p>
          <div
            className="detail-content"
            dangerouslySetInnerHTML={{
              __html: spuResult.introduction
            }}
          ></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('itemDetail').toJS(),
     catlogs: state.get('catlogs').toJS().list || []
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...Actions, fetchCartNum: fetchCartNum}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);
