/**
 * @author litengfei
 * @date 2017-09-14 
 * @requires react
 * @module 前端通用组件->loading
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import './style.scss';

export default class Loading extends Component {
  constructor(props, context){
    super(props, context);
  }

  render(){
    return (
      <div className="pms-loading" style={{display: this.props.display}}> 
        <div className="yo-loading">
          <span className="inner"><i className="yo-ico"></i></span>
        </div>
      </div>
    );
  }
}
