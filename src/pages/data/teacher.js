import React from 'react';
import {Button, Table} from "antd"

export default class Teacher extends React.PureComponent {

  render() {
    return (
      <div>
        <Table
          size="small"
          rowKey={'rowId'}
          columns={[
            {title: '教师名称', dataIndex: 'name'},
            {title: '教师简称', dataIndex: 'shortName'},
            {title: '可授科目', dataIndex: 'canSubjects'},
            {title: '现授科目', dataIndex: 'subjects'},
            {
              title: '操作', render: (value, row) => (
                <Button type={'link'}>修改</Button>
              )
            }
          ]}
          dataSource={[
            {rowId: 1, name: '张三', shortName: '张'},
            {rowId: 2, name: '李四', shortName: '李'},
            {rowId: 3, name: '王五', shortName: '王'},
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
