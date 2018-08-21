/**
 * @author zhangwei
 * @date 2018-03-22
 * @requires https://ant.design  input
 * @module 优惠方式组件->Preferential
 */
import React, { Component } from 'react';
import BaseComponent from 'components/Public/BaseComponent';
import './style.scss';

export default class Preferential extends Component {
  constructor(props, context) {
    super(props, context);
  }
  pHandleChange() {

  }
  render() {
    let CreateInput = (status, type, handleChange, value = 0, preferentialInputValid) => {
      //编辑
      let input;
      let classNames = ['input-ss'];
      //满减
      if (type == 'mjM') {
        classNames = classNames.concat(['pl35', 'w100']);
      }
      if (type == 'mjJ') {
        classNames = classNames.concat(['pl50', 'w100']);
      }
      //打折
      if (type == 'dzM') {
        classNames = classNames.concat(['pl35', 'w100']);
      }
      if (type == 'dzJ') {
        classNames = classNames.concat(['pl50', 'w120']);
      }
      //免房券
      if (type == 'mff') {
        classNames = classNames.concat(['pl35', 'w140']);
      }
      if (status == 'edit') {
        input = <input value={value} className={classNames.join(' ')} disabled={true} />
      } else {
        let validExpression = preferentialInputValid[type] ? 'validError' : null;
        input = <input className={classNames.join(' ') + ' ' + validExpression} onChange={(e) => { handleChange(e, type) }} />
      }
      return input;
    }
    //编辑状态
    let status = this.props.edit ? 'edit' : 'create';

    let handleChange = this.props.handlePreferentialInputChange || this.pHandleChange;
    let preferentialInputValid = this.props.preferentialInputValid || {};
    let showPreferential = this.props.showPreferential;
    let disabled = this.props.disabled || false;
    let mjJ;
    let discountAmount = this.props.discountAmount || 0;
    let reachAmount = this.props.reachAmount || 0;
    if (showPreferential == 'mj') {
      return (
        <div className='preferentialInput' key='mj'>
          <span className='pos-relative'>
            <label className='before'>满¥</label>
            {CreateInput(status, 'mjM', handleChange, discountAmount, preferentialInputValid)}
          </span>
          <span className='pos-relative'>
            <label className='before'>立减¥</label>
            {CreateInput(status, 'mjJ', handleChange, discountAmount, preferentialInputValid)}
          </span>
        </div>
      );
    }
    //打折券
    if (showPreferential == 'dz') {
      return (
        <div className='preferentialInput' key='dz'>
          <span className='pos-relative'>
            <label className='before'>满¥</label>
            {CreateInput(status, 'dzM', handleChange, discountAmount, preferentialInputValid)}
          </span>
          <span className='pos-relative'>
            <label className='before'>立减¥</label>
            {CreateInput(status, 'dzJ', handleChange, discountAmount, preferentialInputValid)}
            <label className='after'>%折扣</label>
          </span>
        </div>
      );
    }
    //免房费券
    if (showPreferential == 'mff') {
      return (
        <div className='preferentialInput' key='mff'>
          <span className='pos-relative'>
            <label className='before'>限免</label>
            {CreateInput(status, 'mffM', handleChange, discountAmount, preferentialInputValid)}
            <label className='after'>间夜</label>
          </span>
        </div>
      );
    }
    return null;
  }
}
