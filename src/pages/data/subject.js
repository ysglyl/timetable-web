import React from 'react';
import {connect} from 'dva';
import {Alert, Button, Input, Modal, Table, Transfer} from "antd"

const {TextArea} = Input;

class Subject extends React.PureComponent {

    state = {
        selectedKeys: [],
        modalVisibleAddSubject: false,
        addSubjectNames: [],
        modalVisibleAddGroup: false,
        addGroupName: null,
        addGroupSubjects: []
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'baseData/subjectGroupAllList'
        });
        dispatch({
            type: 'baseData/subjectAllList'
        });
    }

    render() {
        const {
            baseData: {
                subjectGroupAllList,
                subjectAllList
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
                    childrenColumnName={'subjects'}
                    columns={[
                        {title: '科目/科目组名称', dataIndex: 'name'},
                        {title: '科目简称', dataIndex: 'shortName'}
                    ]}
                    dataSource={subjectGroupAllList.concat(subjectAllList.map(t => ({
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
                            disabled: !(record.subjects || record.canSelect)
                        }),
                    }}
                    title={() => (
                        <div>
                            <Button onClick={() => {
                                this.setState({
                                    modalVisibleAddSubject: true
                                })
                            }}>批量新增</Button>
                            {selectedKeys.length > 0 &&
                            <Button type={'danger'} style={{marginLeft: 8}} onClick={() => {
                                const {dispatch} = this.props;
                                const groupIds = selectedKeys.filter(d => !d.endsWith("_"));
                                const subjectIds = selectedKeys.filter(d => d.endsWith("_")).map(d=>d.replace("_",""));
                                this.setState({
                                    selectedKeys: []
                                });
                                if(groupIds.length > 0) {
                                    // 删除科目组
                                    dispatch({
                                        type: 'baseData/subjectGroupDeleteBatch',
                                        payload: groupIds,
                                        callback: () => {
                                            dispatch({
                                                type: 'baseData/subjectGroupAllList'
                                            })
                                        }
                                    })
                                }
                                if(subjectIds.length > 0) {
                                    // 删除科目
                                    dispatch({
                                        type: 'baseData/subjectDeleteBatch',
                                        payload: subjectIds,
                                        callback: () => {
                                            dispatch({
                                                type: 'baseData/subjectAllList'
                                            });
                                            dispatch({
                                                type: 'baseData/subjectGroupAllList'
                                            });
                                        }
                                    })
                                }
                            }}>批量删除</Button>}
                            <Button style={{marginLeft: 8}} onClick={() => {
                                this.setState({
                                    modalVisibleAddGroup: true
                                })
                            }}>新增科目组</Button>
                        </div>
                    )}
                />
                <Modal
                    visible={this.state.modalVisibleAddSubject}
                    title={'批量新增科目'}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalVisibleAddSubject: false
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: this.state.addSubjectNames.length === 0
                    }}
                    onOk={() => {
                        const {addSubjectNames} = this.state;
                        const {dispatch} = this.props;
                        dispatch({
                            type: "baseData/subjectSaveBatch",
                            payload: addSubjectNames.map(name => ({
                                name,
                                shortName: name.substr(1)
                            })),
                            callback: () => {
                                this.setState({
                                    modalVisibleAddSubject: false
                                })
                                dispatch({
                                    type: 'baseData/subjectAllList'
                                })
                            }
                        });
                    }}>
                    <TextArea rows={10} onChange={(e) => {
                        this.setState({
                            addSubjectNames: e.target.value.split("\n").map(i => i.trim()).filter(i => i)
                        })
                    }} />
                    <Alert style={{marginTop: 5}} message={'每科目独占一行'} type="info" />
                </Modal>
                <Modal
                    visible={this.state.modalVisibleAddGroup}
                    title={'新增科目组'}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalVisibleAddGroup: false
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: !(this.state.addGroupName && this.state.addGroupSubjects.length > 0)
                    }}
                    onOk={() => {
                        const {addGroupName, addGroupSubjects} = this.state;
                        const {dispatch} = this.props;
                        dispatch({
                            type: "baseData/subjectGroupSave",
                            payload: {
                                name: addGroupName,
                                subjects: addGroupSubjects.map(t => ({rowId: t}))
                            },
                            callback: () => {
                                this.setState({
                                    modalVisibleAddGroup: false
                                })
                                dispatch({
                                    type: 'baseData/subjectGroupAllList'
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
                        dataSource={subjectAllList}
                        showSearch
                        locale={{
                            itemUnit: '位', itemsUnit: '位', searchPlaceholder: '根据名称搜索'
                        }}
                        targetKeys={this.state.addGroupSubjects}
                        onChange={(targetKeys) => {
                            this.setState({
                                addGroupSubjects: targetKeys,
                            })
                        }}
                        render={item => item.name}
                    />
                </Modal>
            </div>
        );
    }

}

export default connect(({baseData}) => ({baseData}))(Subject);
