/**
 * @authors wangchen
 * @date    2018-08-20
 * @module  退货流程
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Slider from 'components/Common/SliderBar';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {SubMenu} = Menu;
const {Content, Sider} = Layout;
import './style.scss';

export default class ReturnGoods extends PureComponent {
  constructor(props, context) {
    super(props, context);
  }


  render() {
    return (
      <div className="Introduction-content">
          <div className="help-main-title">
            {'退换货政策'}
          </div>
          <div className="help-content">
              {'尊敬的悦采网会员： '}
          </div>
          <div className="help-content">
              {'感谢您选择悦采网！为保障您的权益，请您收到货物后即与配送人员当面核对商品的种类、数量、规格、赠品、金额、保质期等是否正确，确认无误后再进行签收。 在特殊情况下，您委托他人签收的行为视同于您本人已对商品进行签收。您对商品进行签收后，悦采网将不再接受以上问题的投诉。 '}
          </div>
          <div className="help-content">
              {'如有任何问题，请致电：4008-987-118，客服人员会及时为您处理。谢谢配合！对于退换货规则请仔细阅读以下内容。'}
          </div>
          <div className="help-title">
              {'退换货总则'}
          </div>
          <div className="help-content">
            {'(1).客户应在签收前检查商品的质量，若签收后发现验货时无法发现的质量问题，请自签收订单起48小时内致电客服中心联系，如是悦采网原因 或商品质量问题，我们将及时为您进行退、换货，如因客户个人原因造成质量问题的商品，恕不退换。'}
          </div>
          <div className="help-content">
            {'(2).依据《中华人民共和国产品质量法》、《中华人民共和国消费者权益保护法》等法律法规，经合法食品检验机构检验，悦采网承诺对已销售 的存在质量问题的商品办理售后服务。'}
          </div>
          <div className="help-content">
            {'(3).关于退换货产生的运费，如果由于产品本身质量问题造成的退换，运费由大茶网商城承担，由于礼盒的款式、颜色、个人喜好等原因造成的 退换货，由客户承担来回运费。'}
          </div>
          <div className="help-title">
              {'特别说明'}
          </div>
          <div className="help-content">
            {'以下情况悦采网恕不提供退换货服务：  '}
          </div>
          <div className="help-content">
            {'(1)任何非由悦采网出售的商品（商品序列号不符合）；'}
          </div>
          <div className="help-content">
            {' (2)商品已使用（有质量问题除外）或为正常使用磨损；'}
          </div>
          <div className="help-content">
            {'(3)商品外包装不完整或损坏，标配配件、赠品（如购买时有赠品）或说明书不完整，订单凭证或发票任一缺失或涂改，订单凭证上的的商品型号或序列号与商品实物不符；'}
          </div>
          <div className="help-content">
            {'(4)未经授权的误用、疏忽、滥用、事故、改动、不正确的使用方法所造成的商品质量问题，或撕毁、涂改标贴、防伪标记的商品不予退换货； '}
          </div>
          <div className="help-content">
            {'(5)任何因个人原因或非正常使用及保管导致出现的质量问题的商品； '}
          </div>
          <div className="help-content">
            {'(6)因个人喜好（如外观、色泽、口味等）或不适合个人体质、饮食禁忌等理由要求退换货的，不予处理； '}
          </div>
          <div className="help-content">
            {'(7)客户丢弃或食用产品之后进行投诉存在质量问题的商品。'}
          </div>
          <div className="help-title">
              {'退换货规则及注意事项'}
          </div>
          <div className="help-content-returnGoods">
            {'初次提出开票申请的请提供资料如下并加盖公章： '}
          </div>
          <div className="help-content">
            {'(1).一般纳税人资格证书 '}
          </div>
          <div className="help-content">
            {'(2).营业执照（需有年检合格章）'}
          </div>
          <div className="help-content">
            {' (3).税务登记证 '}
          </div>
          <div className="help-content">
            {'(4).开户许可证 '}
          </div>
          <div className="help-content-returnGoods">
            {'准确填写公司名称、单位地址电话、公司税号、开户银行和帐号、发票邮寄地址详细信息，并注意所填的内容须与纳税信息一致：'}
          </div>
          <div className="help-content">
            {'(1).公司名称必须为工商注册登记的名称   '}
          </div>
          <div className="help-content">
            {'(2).公司的地址和电话是贵公司开票信息上的地址和电话'}
          </div>
          <div className="help-content">
            {'(3).税务登记号是您公司《税务登记证》的编号，一般为15位，请仔细核对后输入 '}
          </div>
          <div className="help-content">
            {'(4).开户银行名称与银行帐号两者必须都要填写，缺一不可 '}
          </div>
          <div className="help-content">
            {'(5).请注明正确的发票邮寄地址，保证发票能够准确送达。'}
          </div>

          <div className="help-content-returnGoods">
            {'资料提供方式： '}
          </div>
          <div className="help-content">
            {'邮寄：将开票资料邮寄至：北京市海淀区东升科技园D1座3层（收件人：客服部） ； '}
          </div>
          <div className="help-content">
            {'邮件：将扫描件发送到邮箱： kefu@lvyue.com ；'}
          </div>
      </div>
    );
  }
}
