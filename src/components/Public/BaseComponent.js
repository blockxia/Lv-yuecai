
/**
 * @author litengfei
 * @date 2017-08-21 
 * @requires react
 * @module 组件基类，实现国际化等公用相关内容
 */
import { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intl from 'react-intl-universal';
import { getCurrentLocale } from 'utils/tools.js';

export default class BaseComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    // 设置多语言
    const currentLocale = getCurrentLocale();
    intl.init({
      currentLocale,
      locales: {
        [currentLocale]: require(`../../locales/${currentLocale}.json`),
      },
    });
  }
}