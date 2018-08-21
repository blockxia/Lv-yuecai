/**
 * @author litengfei
 * @date 2017-08-25 
 * @requires jquery-ui 拖动组件
 * @module 前端通用组件->SortableGridItem
 */
import React, { Component } from 'react';
import intl from 'react-intl-universal';
//import 'lib/jquery-ui/jquery-ui';
import './style.scss';

export default class SortableGridItem extends Component {
  constructor(props, context){
    super(props, context);
  }

  componentDidMount(){
    let that = this;
    $( "#consumptionSortable" + this.props.type).sortable({
      items: ".sort-item",
      revert: true,
      update: function( event, ui ) {
        that.props.updateSort(event, ui);
      }
    }).mouseup((event) => {
      let currentTarget = event.srcElement || event.target;
      if(currentTarget.tagName !== 'INPUT'){
        document.activeElement.blur();
      }
    });
    $( "#consumptionSortable" + this.props.type).disableSelection();
  }

  render(){
    let canEdit = !(this.props.module === 'channel' && this.props.type === '1');
    let gridItems = this.props.items.map(function(item, i) {
      let editSpan = null,
          deleteSpan = null;
      if(item.system !== 1){
        editSpan = <span><img src={this.props.imgs['edit']} onMouseDown={this.props.editItem.bind(this, item.id)}/></span>;
        deleteSpan = <span><img src={this.props.imgs['delete']} onMouseDown={this.props.deleteItem.bind(this, item.id)}/></span>;
      }
      if(canEdit) {
        return (
          <li key={i} className={item.edit ? 'pointer input' : 'sort-item'} data-id={item.id} >
            <span className={item.edit ? 'hide' : 'show'}>
              <span className="category-name fn-text-overflow" title={item.name}>
                {item.name}
              </span>
              {editSpan}
              {deleteSpan}
            </span>
            <span className={item.edit ? 'show edit-item' : 'hide'}>
              <input type="text" className="itemName" maxLength={20} value={this.props.currentEditValue} onChange={this.props.editChange.bind(this)} onBlur={this.props.saveItem.bind(this, item.id)}/>
              <img src={this.props.imgs['delete1']} onMouseDown={this.props.cancelEdit.bind(this, item.id)}/>
            </span>
          </li>
        );
      }else{
        return (
          <li key={i} className='sort-item' data-id={item.id} >
            <span className="category-name fn-text-overflow" title={item.name}>
              {item.name}
            </span>
          </li>
        );
      }
    }, this);
    let addBtn = null;
    if(canEdit){
      addBtn = <li className="add-btn" onClick={this.props.addItem.bind(this)}><span className="btn btn-success" title={intl.get('lv.settings.SortableGridItem.addItem')}>+{intl.get('lv.settings.SortableGridItem.addItem')}</span></li>;
    }
    
    return (
      <ul id={'consumptionSortable' + this.props.type} className="ui-sortable">
        {gridItems}
        {addBtn}
      </ul>
    );
  }
}
