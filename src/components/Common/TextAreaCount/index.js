/**
 * @author litengfei
 * @date 2017-08-27 
 * @requires 
 * @module 前端通用组件->文本域输入字数倒数
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import './style.scss';

export default class TextAreaCount extends Component {
  constructor(props, context){
    super(props, context);
  }

  componentDidMount(){ 
    this.props.inputKeyEvent && this.props.inputKeyEvent();
  }

  componentDidUpdate() {
    $('.textareaInput').html(this.props.currentLength);
  }

  render() {
    return (
      <div className="textarea-count">
        <span className="textareaInput">{this.props.currentLength || 0}</span>/<span className="textareaTotal">{this.props.maxLength}</span>
      </div>
    );
  }
}
