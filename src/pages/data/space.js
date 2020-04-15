import React from 'react';
import {Button, Table} from "antd"

export default class Space extends React.PureComponent {

  render() {
    return (
      <div>
        <Table
          size="small"
          rowKey={'rowId'}
          columns={[
            {title: '场地名称', dataIndex: 'name'},
            {title: '容量班级数', dataIndex: 'volume'},
            {
              title: '操作', render: (value, row) => (
                <Button type={'link'}>修改</Button>
              )
            }
          ]}
          dataSource={[
            {rowId: 1, name: '1号楼1层左1', volume: 1},
            {rowId: 2, name: '1号楼1层左2', volume: 1},
            {rowId: 3, name: '1号楼2层左1', volume: 1},
            {rowId: 4, name: '1号楼2层左2', volume: 1},
            {rowId: 5, name: '2号楼音乐室', volume: 1},
            {rowId: 6, name: '2号楼物理实验室', volume: 1},
            {rowId: 7, name: '2号楼化学实验室', volume: 1},
            {rowId: 8, name: '2号楼生物实验室', volume: 1},
            {rowId: 9, name: '1号操场', volume: 6},
            {rowId: 10, name: '2号操场', volume: 2},
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
