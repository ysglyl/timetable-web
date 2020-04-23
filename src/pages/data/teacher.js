import React from 'react';
import {connect} from 'dva';
import {Alert, Button, Input, Modal, Table, Transfer} from "antd"

const {TextArea} = Input;

class Teacher extends React.PureComponent {

    state = {
        selectedKeys: [],
        modalVisibleAddTeacher: false,
        addTeacherNames: [],
        modalVisibleAddGroup: false,
        addGroupName: null,
        addGroupTeachers: []
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'baseData/teacherGroupAllList'
        });
        dispatch({
            type: 'baseData/teacherAllList'
        });
    }

    render() {
        const {
            baseData: {
                teacherGroupAllList,
                teacherAllList
            }
        } = this.props;
        const {selectedKeys} = this.state;
        return (
            <div>
                <Table
                    size="small"
                    rowKey={'rowId'}
                    bordered
                    pagination={false}
                    defaultExpandAllRows
                    childrenColumnName={'teachers'}
                    columns={[
                        {title: '教师/教师组', dataIndex: 'name'},
                        {title: '教师简称', dataIndex: 'shortName'}
                    ]}
                    dataSource={teacherGroupAllList.concat(teacherAllList.map(t => ({
                        ...t,
                        rowId: `${t.rowId}_`,
                        canSelect: true
                    })))}
                    rowSelection={{
                        onChange: (selectedKeys) => {
                            this.setState({
                                selectedKeys
                            })
                        },
                        getCheckboxProps: record => ({
                            disabled: !(record.teachers || record.canSelect)
                        }),
                    }}
                    title={() => (
                        <div>
                            <Button onClick={() => {
                                this.setState({
                                    modalVisibleAddTeacher: true
                                })
                            }}>批量新增</Button>
                            {selectedKeys.length > 0 &&
                            <Button type={'danger'} style={{marginLeft: 8}} onClick={() => {
                                const {dispatch} = this.props;
                                const groupIds = selectedKeys.filter(d => !d.endsWith("_"));
                                const teacherIds = selectedKeys.filter(d => d.endsWith("_")).map(d=>d.replace("_",""));
                                this.setState({
                                    selectedKeys: []
                                });
                                if(groupIds.length > 0) {
                                    // 删除教师组
                                    dispatch({
                                        type: 'baseData/teacherGroupDeleteBatch',
                                        payload: groupIds,
                                        callback: () => {
                                            dispatch({
                                                type: 'baseData/teacherGroupAllList'
                                            })
                                        }
                                    })
                                }
                                if(teacherIds.length > 0) {
                                    // 删除教师
                                    dispatch({
                                        type: 'baseData/teacherDeleteBatch',
                                        payload: teacherIds,
                                        callback: () => {
                                            dispatch({
                                                type: 'baseData/teacherAllList'
                                            });
                                            dispatch({
                                                type: 'baseData/teacherGroupAllList'
                                            });
                                        }
                                    })
                                }
                            }}>批量删除</Button>}
                            <Button style={{marginLeft: 8}} onClick={() => {
                                this.setState({
                                    modalVisibleAddGroup: true
                                })
                            }}>新增教师组</Button>
                        </div>
                    )}
                />
                <Modal
                    visible={this.state.modalVisibleAddTeacher}
                    title={'批量新增教师'}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalVisibleAddTeacher: false
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: this.state.addTeacherNames.length === 0
                    }}
                    onOk={() => {
                        const {addTeacherNames} = this.state;
                        const {dispatch} = this.props;
                        dispatch({
                            type: "baseData/teacherSaveBatch",
                            payload: addTeacherNames.map(name => ({
                                name,
                                shortName: name.substr(1)
                            })),
                            callback: () => {
                                this.setState({
                                    modalVisibleAddTeacher: false
                                })
                                dispatch({
                                    type: 'baseData/teacherAllList'
                                })
                            }
                        });
                    }}>
                    <TextArea rows={10} onChange={(e) => {
                        this.setState({
                            addTeacherNames: e.target.value.split("\n").map(i => i.trim()).filter(i => i)
                        })
                    }} />
                    <Alert style={{marginTop: 5}} message={'每位教师独占一行'} type="info" />
                </Modal>
                <Modal
                    visible={this.state.modalVisibleAddGroup}
                    title={'新增教师组'}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalVisibleAddGroup: false
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: !(this.state.addGroupName && this.state.addGroupTeachers.length > 0)
                    }}
                    onOk={() => {
                        const {addGroupName, addGroupTeachers} = this.state;
                        const {dispatch} = this.props;
                        dispatch({
                            type: "baseData/teacherGroupSave",
                            payload: {
                                name: addGroupName,
                                teachers: addGroupTeachers.map(t => ({rowId: t}))
                            },
                            callback: () => {
                                this.setState({
                                    modalVisibleAddGroup: false
                                })
                                dispatch({
                                    type: 'baseData/teacherGroupAllList'
                                })
                            }
                        });
                    }}>
                    <Input onChange={(e) => {
                        this.setState({
                            addGroupName: e.target.value
                        })
                    }} />
                    <Transfer
                        rowKey={record => record.rowId}
                        dataSource={teacherAllList}
                        showSearch
                        locale={{
                            itemUnit: '位', itemsUnit: '位', searchPlaceholder: '根据名称搜索'
                        }}
                        targetKeys={this.state.addGroupTeachers}
                        onChange={(targetKeys) => {
                            this.setState({
                                addGroupTeachers: targetKeys,
                            })
                        }}
                        render={item => item.name}
                    />
                </Modal>
            </div>
        );
    }

}

export default connect(({baseData}) => ({baseData}))(Teacher);
