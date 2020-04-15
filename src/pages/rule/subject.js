import React from 'react';
import {Table} from "antd";


export default class Subject extends React.PureComponent {

    state = {
        subjectAllList: [
            {
                rowId: '1', name: '主课', children: [
                    {rowId: '11', name: '语文'},
                    {rowId: '12', name: '数学'},
                    {rowId: '13', name: '外语'}
                ]
            },
            {
                rowId: '2', name: '理科', children: [
                    {rowId: '21', name: '物理'},
                    {rowId: '22', name: '化学'},
                    {rowId: '23', name: '生物'}
                ]
            },
            {
                rowId: '3', name: '文科', children: [
                    {rowId: '31', name: '政治'},
                    {rowId: '32', name: '历史'},
                    {rowId: '33', name: '地理'}
                ]
            }
        ],
        subjectsSelected: null,
        demandList: [
            {
                rowId: '1', subjects: [
                    {rowId: '11', name: '语文'},
                    {rowId: '12', name: '数学'}
                ], condition: '不能同时上课'
            },
            {
                rowId: '2', subjects: [
                    {rowId: '21', name: '语文'},
                    {rowId: '22', name: '数学'}
                ], condition: '前者紧跟后者上课'
            }
        ],
        refreshPage: false
    };

    render() {
        const {
            subjectAllList, demandList, refreshPage
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
                        {title: "科目/科目组", dataIndex: "name"},
                    ]}
                    dataSource={subjectAllList}
                    defaultExpandAllRows
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({
                                subjectsSelected: selectedRows
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
                            title: "科目",
                            dataIndex: "subjects",
                            render: (value, record) => value.map(v => v.name).join('，')
                        },
                        {title: '要求', dataIndex: "condition"}
                    ]}
                    dataSource={demandList}
                />
            </div>
        );
    }

}
