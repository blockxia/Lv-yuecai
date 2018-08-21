import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Select, Form, Input, Radio, Table } from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import ImgUpload from 'components/Common/ImgUpload';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {getDate} from 'utils/date';
import {formatMoney} from '../../../utils/tools'
import intl from 'react-intl-universal';
import * as Actions from '../../../actions/Commodity/spuView';
import './style.scss';

class SpuView extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tabKey: '1'
    }
  }

  componentDidMount() {
    this.props.fetchPriceList();
    let id = this.props.params.id
    if (+id) {
      this.props.fetchBasic({id});
      this.props.fetchSkus({spuId: id});
    }
  }
  componentWillUnmount() {
    // this.props.clearData();
  }
  tabChange(val) {
    this.setState({tabKey: val});
  }
  // 属性表格
  getAttCols() {
    return [
        {
            key: 'name',
            dataIndex: 'name',
            title: '名称'
        },
        {
            key: 'showName',
            dataIndex: 'showName',
            title: '显示名称'
        },
        {
            key: 'values',
            dataIndex: 'values',
            title: '属性值',
            render: (text, record, index) => {
                return (text || []).map(it => it.value).join(',')
            }
        },
    ];
}
// sku表格
getSkuCols(attributes, list, priceList) {
  let lens = attributes.map(it => (it.values || []).filter(i => i.checked).length || 1);
  let options = [];
  options = attributes.filter(it => (it.values || []).some(i => i.checked)).map((it, idx) => {
      return {
          key: `${idx}`,
          dataIndex: `${idx}`,
          title: it.name,
          render: (text, record, index) => {
              let arr = lens.slice(idx + 1);
              let num = 1;
              if (arr.length) {
                  num = arr.reduce((a, b) => a* b);
              }
              return {
                  children: record.skuAttributes[idx].value,
                  props: {
                      rowSpan: num === 1 ? 1 : index % num === 0 ? num : 0
                  }
              };
          }
      }
  });
  options = options.concat([
      {
          title: '销售价',
          children: priceList.map((it, idx) => {
              return {
                  key: 'price' + idx,
                  dataIndex: 'skuPrices',
                  title: it.name,
                  render: (text, record) => ((text || [])[idx] || {}).price ? formatMoney(((text || [])[idx] || {}).price) : ''
              }
          })
      },
      {
          key: 'code',
          dataIndex: 'code',
          title: 'SKU商品编码',
          render: text => {
              return text === '0' ? '' : text;
          }
      },
      {
          key: 'marketPrice',
          dataIndex: 'marketPrice',
          title: '市场价',
          render: text => text ? formatMoney(text) : ''
      }
  ]);
  return options;
}
  render() {
    const {basic={}, skus={}, priceList=[]} = this.props;
    let images = (basic.imageUrl || '').split('|').map((it, idx) => ({
      fileName: `${idx}.${it.split('.')[1] || 'png'}`,
      url: it
    }))
    let id = +this.props.params.id || +(this.props.basic || {}).id;
    return (
      <div className="spu-view-content">
        <div className="panel-info">
          <p className="panel-title">{'基本信息'}</p>
          <div className="row">
              <div className="title required">{'所属类目'}</div>
              <div className="content">
                <div className="line-item">
                  <span>{basic.catalogNamePath || ''}</span>
                </div>
              </div>
          </div>
          <div className="row">
              <div className="title required">{'商品名称'}</div>
              <div className="content">
                  <div className="line-item large">
                  <span>{basic.name || ''}</span>
                  </div>
              </div>
          </div>
          <div className="row">
              <div className="left">
                  <div className="title">{'商品品牌'}</div>
                  <div className="content">
                      <div className="line-item">
                        <span>{basic.brandName || ''}</span>
                      </div>
                  </div>
              </div>
              <div className="right">
                  <div className="title">{'商品编码'}</div>
                  <div className="content">
                      <div className="line-item">
                          <span>{basic.code || ''}</span>
                      </div>
                  </div>
              </div>
          </div>
          <div className="row">
              <div className="left">
                  <div className="title">{'商品状态'}</div>
                  <div className="content">
                      <div className="line-item">
                          <span className="plain-item">{basic.onSale === '1' ? '已上线' : '未上线'}</span>
                      </div>
                  </div>
              </div>
              <div className="right">
                  <div className="title required">{'是否含税'}</div>
                  <div className="content">
                      <div className="line-item">
                          <span className="plain-item">{basic.includeTax === '1' ? '含税' : '不含税'}</span>
                      </div>
                  </div>
              </div>
          </div>
          <div className="row">
              <div className="left">
                  <div className="title required">{'是否含运费'}</div>
                  <div className="content">
                      <div className="line-item">
                          <span className="plain-item">{basic.includeFreight === '1' ? '含运费' : '不含运费'}</span>
                      </div>
                  </div>
              </div>
              <div className="right">
                  <div className="title required">{'起订数量'}</div>
                  <div className="content">
                      <div className="line-item">
                          <span className="plain-item">{basic.minQuantity}</span>
                      </div>
                  </div>
              </div>
          </div>
          <div className="row">
              <div className="title">{'商品特点'}</div>
              <div className="content">
                  <div className="line-item large">
                    <span className="plain-item">{basic.feature || '暂无'}</span>
                  </div>
              </div>
          </div>
        </div>
        <div className="panel-info">
          <p className="panel-title">
            {'SKU属性和价格'}
            {(skus.skuResultList && !!skus.skuResultList.length) 
              && <span className="sub-title">{`（共${skus.skuResultList.length}种）`}</span>}
            </p>
          
            <div className="muti-table">
                <div className="row">
                    <div className="row-left">
                        <span>{'属性'}</span>
                    </div>
                    <div className="row-right">
                        <Table
                            bordered
                            columns={this.getAttCols()}
                            dataSource={skus.spuInfoAttributeResults || []}
                            rowKey={record => record.id}
                            pagination={false}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="row-left">
                        <span>{'价格'}</span>
                    </div>
                    <div className="row-right">
                        <Table
                            bordered
                            columns={this.getSkuCols(skus.spuInfoAttributeResults || [], skus.skuResultList || [], priceList)}
                            dataSource={(skus.skuResultList || []).map((it, idx) => Object.assign({}, it, {key: idx}))}
                            pagination={false}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className="images-info">
            <p className="title">{'商品图片'}</p>
            <div className="images-list">
              {
                images.map((it, idx) => {
                  return <div key={idx} className="iamge-item" style={{backgroundImage: 'url(' + it.url + ')'}}>

                  </div>
                })
              }
            </div>
        </div>
        <div className="description-info">
            <p className="title">{'商品描述'}</p>
            <div
              dangerouslySetInnerHTML={{
                __html: basic.introduction
              }}
            ></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('spuView').toJS(),
     ...state.get('userInfo').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(SpuView);
