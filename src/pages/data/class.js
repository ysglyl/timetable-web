import React from 'react';
import {Button, Table} from "antd"

export default class Class extends React.PureComponent {

  render() {
    return (
      <div>
        <Table
          size="small"
          rowKey={'rowId'}
          columns={[
            {title: '年级名称', dataIndex: 'gradeName'},
            {title: '班级名称', dataIndex: 'className',render:(value,row)=> (`${row.gradeName}${value}`)},
            {title: '班主任', dataIndex: 'director'},
            {
              title: '操作', render: (value, row) => (
                <Button type={'link'}>修改</Button>
              )
            }
          ]}
          dataSource={[
            {rowId: 1, gradeName: '七年级', className: '（1）班',director:'张三'},
            {rowId: 2, gradeName: '七年级', className: '（2）班',director:'李四'},
            {rowId: 3, gradeName: '八年级', className: '（1）班',director:'王五'},
            {rowId: 4, gradeName: '八年级', className: '（2）班',director:'赵六'},
            {rowId: 5, gradeName: '八年级', className: '（3）班',director:'田七'},
          ]}
          bordered
          title={() => (
            <div>
              <Button onClick={() => {
              }}>新增</Button>
            </div>
          )}
        />
      </div>
    );
  }

}
