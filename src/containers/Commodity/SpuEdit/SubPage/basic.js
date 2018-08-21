import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import { Button, Icon, Tabs, Select, Form, Input, InputNumber, Radio, DatePicker, Upload } from 'antd';
import Modal from 'components/Common/Modal';
import message from 'components/Common/message';
import ImgUpload from 'components/Common/ImgUpload';
import MyRichEditor from 'components/Common/MyRichEditor'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import Config from 'config';
import {getDate} from 'utils/date';
import intl from 'react-intl-universal';
import {COMMODITY} from '../../../../constants/actionApi.js';
import moment from 'moment';
import './basic.scss';
import { set } from '../../../../utils/cookie.js';

const url_prefix = Config.env[Config.scheme].prefix;
const STATUS_MAP = {
    1: '正常',
    2: '停用'
};
class Basic extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showUpdate: false
        };
    }

    componentWillMount() {
        if (!+this.props.params.id) {
            this.setState({
                content: ''
            });
        }
    }
    componentWillReceiveProps(next) {
        if (!this.props.basic && next.basic && Object.keys(next.basic).length) {
            let cats = (next.basic.catalogPath || '').match(/\d(?=\/)/g) || [];
            let images = next.basic.imageUrl || '';
            images = images.split('|').map((it, idx) => ({
                fileName: `${idx}.${it.split('.')[1] || 'png'}`,
                url: it
            }));
            this.setState({
                cat1: cats[0] || '',
                cat2: cats[1] || '',
                cat3: cats[2] || '',
                images,
                content: next.basic.introduction
            });
        }
    }
    componentWillUnmount() {
        this.setState({
            showUpdate: false
        });
    }
    // 图片上传回调
    handleComplete(file) {
        let images = this.state.images || [];
        let isUploaded = images.some(it => {
           return it.url === file.url;
        });
        if (isUploaded) {
            return;
        }
        images.push(file);
        this.setState({images: [...images]});
    }
    // 删除上传图片
    handleRemove(file) {
        let url = file.url || file.response.data.url;
        let images = this.state.images || [];
        images = image.filter(it => it.url !== url);
        this.setState({image: [...images]});
    }
    // 保存
    handleSubmit() {
        const {basic = {}, catalogs=[], ...props} = this.props;
        this.props.form.validateFields((err, val) => {
            if (err) {
                return;
            }
            let {images=[], content} = this.state;
            if (!images.length) {
                message.warn('请上传至少一张图片');
                return;
            }
            if (!content) {
                message.warn('请添加商品描述');
                return;
            }
            let {cat1, cat2, cat3, name, brand, includeTax, includeFreight, minQuantity, feature=''} = val;
            let catalog1 = catalogs.filter(it => it.id === +cat1)[0];
            let catalog2 = catalog1.catalogResults.filter(it => it.id === +cat2)[0];
            let catalog3 = catalog2.catalogResults.filter(it => it.id === +cat3)[0];
            let params = {
                name, 
                description: '0',
                catalogId: +cat3,
                catalogPath: `/${cat1}/${cat2}/${cat3}/`,
                catalogNamePath: `/${catalog1.name}/${catalog2.name}/${catalog3.name}/`,
                onSale: basic.id ? basic.onSale : 2,
                includeTax: +includeTax,
                includeFreight: +includeFreight,
                operator: props.users.realName,
                feature,
                introduction: content,
                imageUrl: images.map(it => it.url).join('|'),
                defaultImageUrl: images[0].url,
                minQuantity
            }
            if (+brand.key) {
                params.brandId = +brand.key;
                params.brandName = brand.label;
            }
            if (+this.props.params.id) {
                params.id = basic.id;
                params.code = basic.code;
            }
            console.log(params);
            this.setState({btnLoading: true});
            this.props.updateSpu(basic.id, params, (id) => {
                message.success('操作成功');
                this.setState({btnLoading: false});
                if(!basic.id) {
                    setTimeout(x => {
                        browserHistory.push('/commodity/spuEdit/' + id);
                        window.location.reload();
                    }, 1000);
                }
            }, () => {
                message.warn('操作失败');
                this.setState({btnLoading: false});
            });
        });
    }
    // 上架
    handleOnSale() {

    }
    render () {
        const {getFieldDecorator} = this.props.form;
        const {basic = {}, catalogs=[], brands=[], ...props} = this.props;
        const {cat1='', cat2='', images=[]} = this.state;
        let list1 = cat1 && catalogs.length ? catalogs.filter(it => it.id === +cat1)[0].catalogResults || [] : [];
        let list2 = cat2 && list1.length ? list1.filter(it => it.id === +cat2)[0].catalogResults || [] : [];
        const chooseLabel = [{id: '0', name: '请选择'}];
        const {
            name='', code='', catalogPath='', brandId='', onSale='', 
            includeTax, includeFreight, minQuantity, feature
        } = basic;
        let cats = catalogPath.match(/\d(?=\/)/g) || [];
        return (
        <div className="basic-page">
            <Form>
                <div className="basic-info">
                    <div className="row">
                        <div className="title required">{'所属类目'}</div>
                        <div className="content">
                            <div className="line-item normal">
                                <FormItem className="onSale"
                                >
                                    {
                                        getFieldDecorator('cat1',
                                            {
                                                initialValue: (cats[0] || '0').toString(),
                                                rules: [{required: true, message: '请选择一级类目', pattern: '^[1-9]\\d*$'}]
                                            }
                                        )(
                                            <Select onChange={val => {
                                                this.setState({cat1: +val, cat2: 0, cat3: 0}, () => {
                                                    this.props.form.setFieldsValue({cat2: '0', cat3: '0'});
                                                });
                                            }}>
                                                {
                                                    chooseLabel.concat(catalogs).map(it => {
                                                        return <Option key={it.id}>{it.name}</Option>
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </div>
                            <div className="line-item normal">
                                <FormItem className="onSale">
                                    {
                                        getFieldDecorator('cat2',
                                            {
                                                initialValue: (cats[1] || '0').toString(),
                                                rules: [{required: true, message: '请选择二级类目', pattern: '^[1-9]\\d*$'}]
                                            }
                                        )(
                                            <Select onChange={val => this.setState({cat2: +val, cat3: 0}, x => {
                                                this.props.form.setFieldsValue({cat3: '0'});
                                            })}>
                                                {
                                                    chooseLabel.concat(list1).map(it => {
                                                        return <Option key={it.id}>{it.name}</Option>
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </div>
                            <div className="line-item normal">
                                <FormItem className="onSale">
                                    {
                                        getFieldDecorator('cat3',
                                            {
                                                initialValue: (cats[2] || '0').toString(),
                                                rules: [{required: true, message: '请选择三级类目', pattern: '^[1-9]\\d*$'}]
                                            }
                                        )(
                                            <Select onChange={val => this.setState({cat3: +val})}>
                                                {
                                                    chooseLabel.concat(list2).map(it => {
                                                        return <Option key={it.id}>{it.name}</Option>
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="title required">{'商品名称'}</div>
                        <div className="content">
                            <div className="line-item large">
                                <FormItem>
                                    {
                                        getFieldDecorator('name', {
                                            initialValue: basic.name || '',
                                            rules: [{required: true, message: '请填写商品名称', whitespace: true}]
                                        })(
                                            <Input />
                                        )
                                    }
                                </FormItem>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="left">
                            <div className="title">{'商品品牌'}</div>
                            <div className="content">
                                <div className="line-item">
                                    <FormItem>
                                        {
                                            getFieldDecorator('brand', {
                                                initialValue: basic.brandId ? {key: basic.brandId.toString(), label: basic.brandName} : {key: '0', label: '请选择'}
                                            })(
                                                <Select labelInValue>
                                                    {
                                                        chooseLabel.concat(brands).map(it => {
                                                            return <Option key={it.id}>{it.name}</Option>
                                                        })
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
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
                                    <FormItem>
                                        {
                                            getFieldDecorator('includeTax', {
                                                initialValue: (basic.includeTax || '1').toString(),
                                                rules: [{required: true, message: '请选择是否含税'}]
                                            })(
                                                <RadioGroup>
                                                <Radio value="1">{'含税'}</Radio>
                                                <Radio value="2">{'不含税'}</Radio>
                                                </RadioGroup>
                                            )
                                        }
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="left">
                            <div className="title required">{'是否含运费'}</div>
                            <div className="content">
                                <div className="line-item">
                                    <FormItem>
                                        {
                                            getFieldDecorator('includeFreight', {
                                                initialValue: (basic.includeFreight || '1').toString(),
                                                rules: [{required: true, message: '请选择是否运费'}]
                                            })(
                                                <RadioGroup>
                                                <Radio value="1">{'含运费'}</Radio>
                                                <Radio value="2">{'不含运费'}</Radio>
                                                </RadioGroup>
                                            )
                                        }
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <div className="title required">{'起订数量'}</div>
                            <div className="content">
                                <div className="line-item">
                                    <FormItem>
                                        {
                                            getFieldDecorator('minQuantity', {
                                                initialValue: basic.minQuantity || '',
                                                rules: [{required: true, message: '请填写起订数量'}]
                                            })(
                                                <InputNumber min={1} max={999} step={1} precision={0} />
                                            )
                                        }
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="title">{'商品特点'}</div>
                        <div className="content">
                            <div className="line-item large">
                                <FormItem>
                                    {
                                        getFieldDecorator('feature', {
                                            initialValue: basic.feature || '',
                                        })(
                                            <Input placeholder={'15个字以内'} maxLength={15} />
                                        )
                                    }
                                </FormItem>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
                <div className="images-info">
                    <p className="title">{'商品图片'}<span className="sub-title">{'(至少上传1张图片，最多上传10张图片，前后排序按照上传顺序。)'}</span></p>
                    <div className="images-list">
                    <ImgUpload 
                        fileList={images.map((it, idx) => ({
                            uid: idx,
                            status: 'done',
                            name: it.fileName,
                            url: it.url
                        }))} 
                        fileListNum={10}
                        action={url_prefix + COMMODITY.SPU_FILE_UPLOAD} 
                        onComplete={this.handleComplete.bind(this)}
                        handleOnRemove={this.handleRemove.bind(this)}
                        handlePreview={file => this.setState({showImgModal: true, url: file.url || file.response.data.url})}
                    />
                    </div>
                </div>
                <div className="description-info">
                    <p className="title">{'商品描述'}</p>
                    {this.state.content !== undefined && <MyRichEditor
                        value={this.state.content}
                        onChange={(content) => {
                            this.setState({
                                content: content
                            })
                        }}
                        clear={this.state.clear}
                        clearCallBack={() => {
                            this.setState({
                                clear: false
                            })
                        }}
                        // uploadImgParams={{ type: 102 }}
                        imgUpload={COMMODITY.SPU_FILE_UPLOAD}
                        // imgUpload={`${url_prefix}/sys/image/upload.json`}
                        defaultValue={basic.introduction || ''}
                    ></MyRichEditor>}
                </div>
                <div className="btn-line">
                    <Button onClick={x => browserHistory.push('/commodity/spu')}>{'取消'}</Button>
                    <Button type="primary" disabled={this.state.btnLoading} onClick={this.handleSubmit.bind(this)}>{'保存'}</Button>
                    {basic.id && basic.onSale !== 1 ? <Button type="primary" onClick={this.handleOnSale.bind(this)}>{'发布上线'}</Button> : null}
                    {basic.id && basic.onSale === 1 ? <Button type="primary">{'在线预览'}</Button> : null}
                </div>
        {
          this.state.showConfirm && <Modal
            visible={this.state.showConfirm}
            title="提示"
            onCancel={x => {
              this.state.back && this.state.back();
              this.setState({
                showConfirm: fasle,
                params: null
              });
            }}
            onOk={callback => {
              callback();
              this.setState({showConfirm: false}, x => {
                this.submit(this.state.id, this.state.params, this.state.back);
              })
            }}
          >
            <p style={{textAlign: 'center'}}>{'确定要新增吗，新增后将无法删除。'}</p>
          </Modal>
        }
        {this.state.showImgModal && <Modal
          visible={this.state.showImgModal}
          title=""
          wrapClassName="view-image-modal"
          onCancel={x => this.setState({showImgModal: false, url: null})}
          footerIsNull={true}
          width={1000}
        >
          <img src={this.state.url} />
        </Modal>}
      </div>)
    }
}
export default Form.create()(Basic);