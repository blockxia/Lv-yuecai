import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, Table, Tooltip, Input, InputNumber ,Form,Upload} from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import storage from '../../../../utils/storage';
import { formatMoney } from '../../../../utils/tools';
import './table.scss';
import Config from 'config';
const FormItem = Form.Item;
const url_prefix = Config.env[Config.scheme].prefix;

const STATUS_MAP = {
    1: '已上架',
    2: '未上架'
};
class SkuTable extends PureComponent {
      constructor(props, context) {
        super(props, context);
        this.state = {
            showUpdate: false,
            showStateConfirm: false,
            showQuery: false,
            file: {}
        };
        this.getColumns = this.getColumns.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
    }

    getColumns() {
        let columns = [
            {
                key: 'id',
                title: 'SKUID',
                dataIndex: 'id'
            },
            {
                key: 'spuId',
                title: 'SPUID',
                dataIndex: 'spuId'
            },
            {
                key: 'skuAttributes',
                title: 'SKU商品属性',
                dataIndex: 'skuAttributes'
            },
            {
                key: 'name',
                title: '商品名称',
                dataIndex: 'name',
                render: text => <Tooltip title={text}>{text}</Tooltip>
            },
            {
                key: 'skuSuppliers',
                title: '供应商',
                dataIndex: 'skuSuppliers',
                render: text => <Tooltip title={text}>{text}</Tooltip>
            },
            {
                key: 'buyPrice',
                title: '成本',
                dataIndex: 'buyPrice',
                render: (text, record) => {
                    return `¥ ${formatMoney(text)}`
                  }
            },
            {
                key: 'standardPrice',
                title: '销售价',
                dataIndex: 'standardPrice',
                render: (text, record) => {
                    return `¥ ${formatMoney(text)}`
                  }
            },
            {
                key: 'status',
                title: 'SKU状态',
                dataIndex: 'status',
                render: text => STATUS_MAP[text]
            },
            {
                key: 'operator',
                title: '更新人',
                dataIndex: 'operator'
            },
            {
                key: 'operateTime',
                title: '最后更新时间',
                dataIndex: 'operateTime',
                render: text => text ? getDate(text, 'yyyy-MM-DD HH-MM-SS') : '暂无'
            },
            {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return <div className="line-operation">
                        <a className="link-btn" onClick={this.queryBtn.bind(this,record)}>{'查看'}</a>
                        <a className="link-btn" onClick={this.updateBtn.bind(this,record)}>{'修改'}</a>
                        <a className="link-btn" onClick={x => this.setState({showStateConfirm: true, record: record})}>{record.status === 1 ? '下架' : '上架'}</a>
                    </div>
                }
            },
        ];
        return columns;
    }
    getPrice = () => {
        let obj = {skuPrices:'',skuSuppliers:''};
        if(this.props.skuData){
            let skuPrices = this.props.skuData.skuPrices;
            let skuSuppliers = this.props.skuData.skuSuppliers;
            let objSkuPrices = [];
            let objSkuSuppliers = [];
            for(let i in skuPrices){
                objSkuPrices.push({key:"price"+i,title:skuPrices[i].priceTypeName,dataIndex:"price"+i})
            }
            for(let i in skuSuppliers){
                objSkuSuppliers.push({key:"buyPrice"+i,title:skuSuppliers[i].supplierName,dataIndex:"buyPrice"+i})
            }
            obj.skuPrices = objSkuPrices;
            obj.skuSuppliers = objSkuSuppliers;
        }
        return obj;
    }

    getSKUdata = () => {
        let obj = {};
        if(this.props.skuData) {
            let skuData = this.props.skuData;
            if(skuData.skuAttributes.length == 3){
                obj.color = skuData.skuAttributes[0].value;
                obj.size = skuData.skuAttributes[1].value;
                obj.dimension = skuData.skuAttributes[2].value
            }
            let skuPrices = this.props.skuData.skuPrices;
            let skuSuppliers = this.props.skuData.skuSuppliers;
                for(let i in skuPrices){
                    obj["price"+i] = skuPrices[i].price;
                }
                for(let i in skuSuppliers){
                    obj["buyPrice"+i] = skuSuppliers[i].buyPrice;
                }
            obj.code = skuData.code;
            obj.marketPrice = skuData.marketPrice;
        }
        let objArr = [obj];
        return objArr;
    }

    getSKUColumns = () => {
        let obj = this.getPrice();
        let columns = [
            {
                key: 'color',
                title: '颜色',
                dataIndex: 'color'
            },
            {
                key: 'size',
                title: '大小',
                dataIndex: 'size'
            },
            {
                key: 'dimension',
                title: '尺寸',
                dataIndex: 'dimension'
            },
            {
                key: 'name',
                title: '成本',
                dataIndex: 'name',
                children:obj.skuSuppliers
            },
            {
                key: 'skuSuppliers',
                title: '销售价',
                dataIndex: 'skuSuppliers',
                children:obj.skuPrices
            },
            {
                key: 'code',
                title: 'SKU商品编码',
                dataIndex: 'code',
            },
            {
                key: 'marketPrice',
                title: '市场价',
                dataIndex: 'marketPrice',
                render: (text, record) => {
                    return `¥ ${formatMoney(text)}`
                  }
            }
        ];
        if(obj.skuSuppliers.length == 0){
            columns = columns.filter(x => x.key != "name")
        }
        if(obj.skuPrices.length == 0){
            columns = columns.filter(x => x.key != "skuSuppliers")
        }
        return columns;
    }

    updateBtn = (record) => {
       this.setState({showUpdate: true, record: record});
       this.props.fetchSKUData({skuId:record.id}); 
    }
    queryBtn = (record) => {
        this.setState({showQuery: true, record: record});
        this.props.fetchSKUData({skuId:record.id}); 
    }
    // 上/下 架
    handleChangeStatus(callback) {
        const {users} = this.props;
        let record = this.state.record;
        let params = {
            id:  record.id.toString(),
            status: record.status === 1 ? 2 : 1,
            operator: users.realName
        };
        this.props.changeStatus && this.props.changeStatus(params, () => {
            message.success('操作成功');
            callback();
            this.setState({
                showStateConfirm: false,
                record: null,
            });
            setTimeout(x => this.props.fetchList(this.props.params), 1000);
        }, () => {
            message.warn('操作失败');
            callback();
            this.setState({
                showStateConfirm: false,
                record: null,
            });
        });
    }

    //修改SKU
    handleChangeSKU = (callback) => {
        this.props.form.validateFields((err, val) => {
            if (err && Object.keys(err).length) {
              return;
            }
            if(this.props.skuData){
                let skuPrices = this.props.skuData.skuPrices;
                let skuSuppliers = this.props.skuData.skuSuppliers;
                for(let i in skuPrices){
                    this.props.skuData.skuPrices[i].price = val["price"+i]
                }
                for(let i in skuSuppliers){
                    this.props.skuData.skuSuppliers[i].buyPrice = val["buyPrice"+i]
                }
                let skuData = this.props.skuData;
                skuData.marketPrice = val.marketPrice;
                let param = {id:skuData.id,code:skuData.code,name:skuData.name,catalogId:skuData.catalogId,catalogPath:skuData.catalogPath,catalogNamePath:skuData.catalogNamePath,spuId:skuData.spuId,spuCode:skuData.spuCode,spuName:skuData.spuName,standardPrice:skuData.standardPrice,marketPrice:skuData.marketPrice,imageUrls:skuData.imageUrls,status:skuData.status,operator:skuData.operator,operateTime:skuData.operateTime,description:skuData.description,groupId:skuData.groupId,groupName:skuData.groupName,skuAttributes:skuData.skuAttributes,skuPrices:skuData.skuPrices,skuSuppliers:skuData.skuSuppliers};
                this.props.updateSkuData && this.props.updateSkuData(param, () => {
                    message.success('操作成功');
                    callback && callback();
                    this.setState({
                        showUpdate: false,
                        record: null,
                    });
                    this.props.fetchList({pageSize: 10, pageNumber: 1});
                }, () => {
                    message.warn('操作失败');
                    callback && callback();
                    this.setState({
                        showUpdate: false,
                        record: null,
                    });
                    this.props.fetchList({pageSize: 10, pageNumber: 1});
                });
            }
          });
    }

    //查看页面确定按钮
    handleUpdateSKU = (callback) => {
        if(this.state.file){
            if (this.state.file.response && this.state.file.response.data) {
                let url = this.state.file.response.data.url;
                let skuData = this.props.skuData;
                let param = {id:skuData.id,code:skuData.code,name:skuData.name,catalogId:skuData.catalogId,catalogPath:skuData.catalogPath,catalogNamePath:skuData.catalogNamePath,spuId:skuData.spuId,spuCode:skuData.spuCode,spuName:skuData.spuName,standardPrice:skuData.standardPrice,marketPrice:skuData.marketPrice,imageUrls:skuData.imageUrls,status:skuData.status,operator:skuData.operator,operateTime:skuData.operateTime,description:skuData.description,groupId:skuData.groupId,groupName:skuData.groupName,skuAttributes:skuData.skuAttributes,skuPrices:skuData.skuPrices,skuSuppliers:skuData.skuSuppliers};
                param.imageUrls = url;
                this.props.updateSkuData && this.props.updateSkuData(param, () => {
                    message.success('操作成功');
                    callback && callback();
                    this.setState({
                        showQuery: false,
                        file:{},
                        record: null,
                    });
                }, () => {
                    message.warn('操作失败');
                    callback && callback();
                    this.setState({
                        showQuery: false,
                        file:{},
                        record: null,
                    });
                });
            }
        }
    }
    // 翻页
    pageChange(val) {
        let params = this.props.params;
        params.pageNumber = val;
        this.props.fetchList && this.props.fetchList(params);
    }

    //设置修改框
    setFormInput(data,getFieldDecorator){
        let formItem = data.map((elem,index) => {
            return(
                <div className="sup-formInput-content" key={index+"sku"}>
                    <div className="row">
                    <div className="row-title">{elem.priceTypeName}</div>
                    <div className="price-form">
                    <FormItem>
                        {
                        getFieldDecorator('price'+index, {
                            initialValue:  elem.price
                        })(
                            <InputNumber min={0}/>
                        )
                        }
                    </FormItem>
                    </div>
                </div>
                </div>
            )
        })
        return formItem;
    }

        //设置修改框(成本)
        setFormInputSupplier(data,getFieldDecorator){
            let formItem = data.map((elem,index) => {
                return(
                    <div className="sup-formInput-content" key={index+"supplier"}>
                        <div  className="row">
                        <div className="row-title">{elem.supplierName}</div>
                        <div className="price-form">
                        <FormItem>
                            {
                            getFieldDecorator('buyPrice'+index, {
                                initialValue:  elem.buyPrice
                            })(
                                <InputNumber min={0}/>
                            )
                            }
                        </FormItem>
                        </div>
                    </div>
                    </div>
                )
            })
            return formItem;
        }


        //图片上传
        handleChange = ({ file }) => {
            const _this = this;
            this.setState({ file });
            if (file.response) {
              if (file.response.success) {
                _this.setState({ file });
              } else {
                message.error(file.response.msg);
              }
            }
          }

    render () {
        const {list = [], params ={}, total} = this.props;
        const { getFieldDecorator } = this.props.form;
        let skuData = this.getSKUdata();
        let file = this.state.file;
        let responseUrl = '';
        if (file.response && file.response.data) {
        responseUrl = file.response.data.url;
        }
        let imageUrls = null;
        if(this.props.skuData){
            imageUrls = this.props.skuData.imageUrls;
        } 
        function getLogoUrl() {
              if (responseUrl != '') {
                return <div className='logo-upload'>
                  <img className='logo-url' src={responseUrl} style={{width:100,height:100}}/>
                </div>;
              } else {
                return <div className='logo-upload'>
                  <img className='logo-url' src={imageUrls}  style={{width:100,height:100}}/>
                </div>;
              }
          }
        return (
            <div className="spu-table">
                <Table
                    columns={this.getColumns()}
                    rowKey={record => record.id}
                    dataSource={list.map(it => Object.assign({}, it, {key: it.id}))}   //数据源
                    locale={
                        {
                            emptyText:intl.get("lv.common.noData")
                        }
                    } 
                    pagination={{
                        current: params.pageNumber || 1,
                        pageSize: params.pageSize || 10,
                        total: total || 0,
                        onChange:  this.pageChange.bind(this),
                        showTotal: (total, range) => `总共${total}条数据，当前为第${params.pageNumber || 1}页`
                    }}
                />
                {
                    this.state.showStateConfirm && <Modal
                        visible={this.state.showStateConfirm}
                        title="提示"
                        onCancel={x => this.setState({showStateConfirm: false, record: null})}
                        onOk={this.handleChangeStatus}
                    >
                        {
                          this.state.record && this.state.record.status !== 1
                            ? <div >
                                <p style={{textAlign: 'center'}}>{'你确定要将此SKU商品上架销售吗？'}</p>
                                <p style={{textAlign: 'center'}}>{'上架销售后将不能修改该SKU商品的任何信息。'}</p>
                            </div>
                            : <div>
                                <p style={{textAlign: 'center'}}>{'你确定要将此SKU商品下架吗？'}</p>
                            </div>
                        }
                    </Modal>
                }
                {
                    this.state.showUpdate&& <Modal
                        visible={this.state.showUpdate}
                        title="SKU商品修改"
                        onCancel={x => this.setState({showUpdate: false, record: null})}
                        onOk={this.handleChangeSKU}
                    >
                        <div>
                            <div>
                                <Form>
                                <div>成本</div>
                                {this.props.skuData ? this.setFormInputSupplier(this.props.skuData.skuSuppliers,getFieldDecorator) : ''}
                                <div>销售价</div>
                                {this.props.skuData ? this.setFormInput(this.props.skuData.skuPrices,getFieldDecorator) : ''}
                                <div>市场价</div>
                                    <div style={{marginLeft: 100}}>
                                        {this.props.skuData ? <FormItem>
                                            {
                                            getFieldDecorator('marketPrice', {
                                                initialValue:  this.props.skuData.marketPrice
                                            })(
                                                <InputNumber min={0}/>
                                            )
                                            }
                                        </FormItem> : ''}
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </Modal>
                }
                {
                    this.state.showQuery&& <Modal
                        visible={this.state.showQuery}
                        title="SKU商品详情"
                        onCancel={x => this.setState({showQuery: false, record: null,file:{}})}
                        onOk={this.handleUpdateSKU}
                        width={800}
                    >
                        <div>
                            SPU基本信息
                        </div>
                        <div className="sup-formInput-content">
                            <div className="row">
                                <div className="row-title">所属类目：</div>
                                <div className="row-content">
                                    {this.props.skuData ? this.props.skuData.catalogNamePath : ''}
                                </div>
                                <div className="row-title" style={{marginLeft:40}}>商品名称：</div>
                                <div className="row-content">
                                    {this.props.skuData ? this.props.skuData.name : ''}
                                </div>
                            </div>
                        </div>
                        <div>SKU基本信息</div>
                        <Table
                            columns={this.getSKUColumns()}
                            rowKey={(record,index) => index}
                            dataSource={skuData.map(it => Object.assign({}, it, {key: it.id}))}   //数据源
                            locale={
                                {
                                    emptyText:intl.get("lv.common.noData")
                                }
                            } 
                            pagination={false}
                        />
                        <div>SKU图片</div>
                        <Upload
                            listType="text"
                            onChange={this.handleChange}
                            action={`${url_prefix}/mng/api/pimp/product/sku/upload.json`}
                            accept="image/jpg,image/jpeg,image/png,image/bmp"
                            showUploadList={false}
                        >
                            {getLogoUrl()}
                        </Upload>
                    </Modal>
                }
            </div>
        );
    }
}
const SkuTableForm = Form.create()(SkuTable)
export default SkuTableForm;