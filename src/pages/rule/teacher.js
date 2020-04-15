import React from 'react';
import {Table} from "antd";


export default class Teacher extends React.PureComponent {

  state = {
    teacherAllList: [
      {
        rowId: '1', name: '语文组', children: [
          {rowId: '11', name: '张三',},
          {rowId: '12', name: '李四'}]
      },
      {
        rowId: '2', name: '数学组', children: [
          {rowId: '21', name: '王五',},
          {rowId: '22', name: '赵六'}]
      },
    ],
    teachersSelected: null,
    demandList: [
      {
        rowId: '1', teachers: [
          {rowId: '11', name: '张三'},
          {rowId: '12', name: '李四'}
        ], condition: '每周最多上4天'
      },
      {
        rowId: '2', teachers: [
          {rowId: '21', name: '王五'},
          {rowId: '22', name: '赵六'}
        ], condition: '每周最多上3个早读'
      },
      {
        rowId: '3', teachers: [
          {rowId: '21', name: '王五'},
          {rowId: '22', name: '赵六'}
        ], condition: '每天最多安排3节'
      },
      {
        rowId: '4', teachers: [
          {rowId: '21', name: '王五'},
          {rowId: '22', name: '赵六'}
        ], condition: '每天上午最多上2节'
      },
      {
        rowId: '5', teachers: [
          {rowId: '21', name: '王五'},
          {rowId: '22', name: '赵六'}
        ], condition: '不能同时上课'
      },
      {
        rowId: '6', teachers: [
          {rowId: '21', name: '王五'},
          {rowId: '22', name: '赵六'}
        ], condition: '每周最多安排2次上午第一节课'
      }
    ],
    refreshPage: false
  };

  render() {
    const {
      teacherAllList, demandList, refreshPage
    } = this.state;
    return (
      <div>
        <Table
          rowKey={'rowId'}
          bordered
          size={'small'}
          pagination={false}
          scroll={{y: 240}}
          columns={[
            {title: "教师/教师组", dataIndex: "name"},
          ]}
          dataSource={teacherAllList}
          defaultExpandAllRows
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({
                teachersSelected: selectedRows
              })
            }
          }}
        />
        <Table
          rowKey={'rowId'}
          bordered
          size={'small'}
          pagination={false}
          scroll={{y: 240}}
          columns={[
            {
              title: "教师",
              dataIndex: "teachers",
              render: (value, record) => value.map((v) => v.name).join('，')
            },
            {title: '要求', dataIndex: "condition"}
          ]}
          dataSource={demandList}
        />
      </div>
    );
  }

}
