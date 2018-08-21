/**
 * @authors sunlei
 * @date    2018-08-14
 * @module  商品组件
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Form, Input, InputNumber, Radio,Tabs ,Upload,Icon,Carousel} from 'antd';
import {formatMoney} from 'utils/tools';
import './item.scss';
import { browserHistory } from 'react-router/lib';

export default class Item extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    const {item={}} = this.props;
    return (
      <div className="item-line" onClick={x => browserHistory.push('/itemDetail?spuId=' + item.id)}>
          <img src={item.imgPath || 'https://axhub.im/pro/2c176f905a592e7b/images/%E9%A6%96%E9%A1%B5/u2214.jpg'}/>
          <div className="new-goods-message">
              <div className="goods-title-top">
                <div className="goods-name">{item.name}</div>
                <div className="goods-price">
                  {!item.minPrice && item.minPrice !== 0 ? '暂无' : `￥${formatMoney(item.minPrice)}` }
                  <span className="market-price">{!item.maxMarketPrice && item.maxMarketPrice !== 0 ? '暂无' : `￥${formatMoney(item.maxMarketPrice)}` }</span>
                </div>
              </div>
              <div className="goods-title-bottom">
                  {item.feature}
              </div>
          </div>
      </div>
    );
  }
}
