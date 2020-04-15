import React from 'react';
import {Button, Table} from "antd"

export default class Setting extends React.PureComponent {

  render() {
    return (
      <div>
        <Table
          size="small"
          rowKey={'rowId'}
          columns={[
            {title:'排课方案',dataIndex: 'schemeName'},
            {title: '年级', dataIndex: 'gradeName'},
            {title: '班级', dataIndex: 'className'},
            {title: '科目', dataIndex: 'subjectName'},
            {title: '教师', dataIndex: 'teacher'},
            {title: '课节数', dataIndex: 'sectionCount'},
            {title: '连堂次数', dataIndex: 'continuousCount'},
            {title: '互斥组', dataIndex: 'exclusiveGroup'},
            {title: '单双周', dataIndex: 'alternative'},
            {title: '匹配组', dataIndex: 'matchGroup'},
            {title: '教学场地', dataIndex: 'spaceName'},
            {
              title: '操作', render: (value, row) => (
                <Button type={'link'}>修改</Button>
              )
            }
          ]}
          dataSource={[
            {
              rowId: 1,
              schemeName:'2019-2020第二学期课务安排',
              gradeName: '七年级',
              className: '（1）班',
              subjectName: '语文',
              teacher: '张三',
              sectionCount: 8,
              continuousCount: 2,
              exclusiveGroup: '',
              alternative: 0,
              matchGroup: '',
              spaceName: '教学楼1楼左1'
            }
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
