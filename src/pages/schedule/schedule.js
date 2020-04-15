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
            {title: '排课方案', dataIndex: 'name'},
            {title: '排课状态', dataIndex: 'status',render(value){
              switch (value) {
                case 0:
                  return '尚未配置';
                case 1:
                  return '未排';
                case 2:
                  return '已排';
              }
              }},
            {
              title: '操作', render: (value, row) => (
                <Button type={'link'}>开始排课</Button>
              )
            }
          ]}
          dataSource={[
            {rowId: 1, name: '2020-2021学年第二学期课表', status: 1},
            {rowId: 2, name: '2020-2021学年第一学期课表', status: 1},
            {rowId: 3, name: '2019-2020学年第二学期课表', status: 0},
            {rowId: 3, name: '2019-2020学年第一学期课表', status: 2},
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
