/**
 * @authors wangchen
 * @date    2018-07-17
 * @module  采购端设置
 */
import React, { PureComponent } from 'react';
import { Table, Input, Button, Popconfirm, Form ,InputNumber,message ,Modal} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../actions/PlatformSetting/purchase';
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = (title) => {
    if (this.props.inputType === 'number') {
      return <InputNumber placeholder={`请您输入${title}`}/>;
    }
    return <Input placeholder={`请您输入${title}`}/>;
  };


  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
      {(form) => {
        const { getFieldDecorator } = form;
        return (
          <td {...restProps}>
            {editing ? (
              <FormItem style={{ margin: 0 }}>
                {getFieldDecorator(dataIndex, {
                  rules: [{
                    required: true,
                    message: `请您输入 ${title}!`,
                  }],
                  initialValue: record[dataIndex],
                })(this.getInput(title))}
              </FormItem>
            ) : restProps.children}
          </td>
        );
      }}
    </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '菜单名称',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    }, {
      title: '菜单链接地址',
      dataIndex: 'link',
      editable: true,
    }, {
      title: '排序',
      dataIndex: 'weight',
      editable: true,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="您确定取消?"
                    onConfirm={() => this.cancel(record)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <div style={{textAlign: 'center'}}>
                  <span onClick={this.edit.bind(this,record.index)} style={{cursor: 'pointer', color: '#3AA6F5'}}>{`编辑`}</span>
                  <span onClick={x=> this.setState({homePageDelete: true,id:record.id,record})} style={{cursor: 'pointer', color: '#3AA6F5',marginLeft: '10px'}}>{`删除`}</span>
                </div>
              )}
            </div>
        );
      },
    }];

    this.state = {
      dataSource:null,
      count: null,
      editingKey: '',
      homePageDelete: false,
    };
  }

  componentWillReceiveProps(props){
    this.setState({
      dataSource: props.dataSource,
      count: props.dataSource.length
    })
  }




  // 添加单行数据
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      index: count,
      name: ``,
      link: '',
      weight: ``,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      editingKey: dataSource.length
    });
  }


  //点击编辑按钮后转换为可编辑状态
  isEditing = (record) => {
    return record.index === this.state.editingKey;
  };

  //编辑
  edit(index) {
    this.setState({ editingKey: index });
  }


  //保存
  save(form, record) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      let id = record.id;
      if (id) {
        row.id = id;
      }
      this.props.updateListHomePage(row, !!id, () => {
        // callback && callback();
        this.setState({ editingKey: '' });
        this.props.fetchListHomePage();
      }, () => {
        // callback && callback();
        message.error('操作失败');
      });
      
    });
  }

  //取消
  cancel = (record) => {
    this.setState({ editingKey: '' });
    const DataSource = this.props.dataSource;
    for(let i in DataSource){
      if(record == DataSource[i]){
        return;
      }
    }
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.index !== record.index) });
  };

  // 删除单行数据
  deleteHomePage() {
    let record = this.state.record;
    const DataSource = this.props.dataSource;
    for(let i in DataSource){
      if(record == DataSource[i]){
        this.props.deleteListHomePage({id: this.state.id}, () => {
          this.setState({homePageDelete: false, id: null});
          this.props.fetchListHomePage();
          return;
        }, () => {
            message.error('操作失败');
            this.setState({homePageDelete: false, id: null});
        });
      }
    }
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.index !== record.index),id:null, homePageDelete: false,record:null});
  }

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'weight' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <div>
        <div className='opt-container'>
                <div className="opt-right">
                  <a href='#'  onClick={this.handleAdd}>
                    <i className="i-icon">&#xe699;</i>
                    添加菜单
                  </a>
                </div>
              </div>
        <Table
          rowKey="index"
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        {
          this.state.homePageDelete && <Modal
            visible={this.state.homePageDelete}
            title="提示"
            onOk={this.deleteHomePage.bind(this)}
            onCancel={x => this.setState({homePageDelete: false,id: null})}
          >
          <p style={{textAlign: 'center'}}>{`你确定要删除此菜单吗？`}</p>
          <p style={{textAlign: 'center'}}>{`删除后将不能恢复`}</p>
          </Modal>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
     ...state.get('purchase').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditableTable));