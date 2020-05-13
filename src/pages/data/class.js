import React from 'react';
import {connect} from 'dva';
import {Alert, Button, InputNumber, Modal, Select, Table} from "antd";

import styles from './class.less';

class Class extends React.PureComponent {

    state = {
        selectedKeys: [],
        modalVisibleAddClass: false,
        addClassMap: {},
        modalVisibleEditTeacher: false,
        editClass: null,
        editTeacherDataSource: [],
        refreshPage: false
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'baseData/gradeAllList'
        });
        dispatch({
            type: 'baseData/classAllList'
        });
        dispatch({
            type: 'baseData/teacherAllList'
        });
        dispatch({
            type: 'baseData/spaceAllList'
        });
    }

    render() {
        const {
            baseData: {
                gradeAllList,
                classAllList,
                teacherAllList,
                spaceAllList
            }
        } = this.props;
        const {selectedKeys} = this.state;
        return (
            <div>
                <Table
                    size="small"
                    rowKey={'rowId'}
                    columns={[
                        {title: '年级', dataIndex: ['grade', 'name']},
                        {title: '班级', dataIndex: 'name'},
                        {
                            title: '操作', render: (value, record) => (<Button type={'link'} onClick={() => {
                                let ds = [];
                                const defaultSpace = spaceAllList.find(item => item.classId === record.rowId);
                                const grade = gradeAllList.find(g => g.rowId === record.gradeId);
                                if (grade) {
                                    if (grade.subjectRelList) {
                                        ds = grade.subjectRelList.map(item => {
                                            const teacherRel = record.teacherRelList.find(r => r.subjectId === item.subjectId);
                                            return {
                                                rowId: item.rowId,
                                                classId: record.rowId,
                                                subjectId: item.subjectId,
                                                name: item.subject.name,
                                                teacherId: teacherRel ? teacherRel.teacherId : null,
                                                spaceId: teacherRel ? teacherRel.spaceId : defaultSpace.rowId
                                            }
                                        })
                                    }
                                }
                                this.setState({
                                    modalVisibleEditTeacher: true,
                                    editClass: record,
                                    editTeacherDataSource: ds
                                });
                            }}>
                                编辑授课教师
                            </Button>)
                        },
                    ]}
                    pagination={false}
                    dataSource={classAllList}
                    bordered
                    rowSelection={{
                        onChange: (selectedKeys) => {
                            this.setState({
                                selectedKeys
                            })
                        }
                    }}
                    title={() => (
                        <div>
                            <Button onClick={() => {
                                this.setState({
                                    modalVisibleAddClass: true
                                })
                            }}>批量新增</Button>
                            {selectedKeys.length > 0 &&
                            <Button type={'danger'} style={{marginLeft: 8}} onClick={() => {
                                const {dispatch} = this.props;
                                dispatch({
                                    type: 'baseData/classDeleteBatch',
                                    payload: selectedKeys,
                                    callback: () => {
                                        this.setState({
                                            selectedKeys: []
                                        });
                                        dispatch({
                                            type: 'baseData/classAllList'
                                        })
                                    }
                                })
                            }}>批量删除</Button>}
                        </div>
                    )}
                />
                <Modal
                    visible={this.state.modalVisibleAddClass}
                    title={'批量新增班级'}
                    width={600}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalVisibleAddClass: false
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: Object.keys(this.state.addClassMap).length === 0
                    }}
                    onOk={() => {
                        const {addClassMap} = this.state;
                        const {dispatch} = this.props;
                        dispatch({
                            type: "baseData/classSaveBatch",
                            payload: Object.entries(addClassMap).map(([k, v]) => ({
                                gradeId: k,
                                classCount: v
                            })),
                            callback: () => {
                                this.setState({
                                    modalVisibleAddClass: false
                                })
                                dispatch({
                                    type: 'baseData/classAllList'
                                })
                            }
                        });
                    }}>
                    <Alert message={'班级数量设置为0的年级不会增加班级'} type="info" />
                    <div className={styles.modalContainer}>
                        {gradeAllList.map(grade => (
                            <div key={`add_class_${grade.rowId}`} className={styles.gradeContainer}>
                                <span className={styles.grade}>{grade.name}</span>
                                新增<InputNumber
                                min={0} max={100} defaultValue={0} style={{width: 60}}
                                onChange={value => {
                                    const {addClassMap, refreshPage} = this.state;
                                    if (value > 0) {
                                        addClassMap[grade.rowId] = value;
                                    } else {
                                        delete addClassMap[grade.rowId];
                                    }
                                    this.setState({
                                        refreshPage: !refreshPage
                                    })
                                }}
                            />班
                            </div>
                        ))}
                    </div>
                </Modal>
                <Modal
                    visible={this.state.modalVisibleEditTeacher}
                    title={this.state.editClass ? this.state.editClass.name : "编辑授课教师"}
                    width={800}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalVisibleEditTeacher: false
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: false
                    }}
                    onOk={() => {
                        const {dispatch} = this.props;
                        const {editTeacherDataSource} = this.state;
                        console.log(editTeacherDataSource);
                        dispatch({
                            type: "baseData/classTeacherSaveBatch",
                            payload: {
                                classId: this.state.editClass.rowId,
                                list: editTeacherDataSource
                            },
                            callback: () => {
                                this.setState({
                                    modalVisibleEditTeacher: false,
                                    editClass: null
                                })
                                dispatch({
                                    type: 'baseData/classAllList'
                                })
                            }
                        });
                    }}>
                    <Table
                        size="small"
                        rowKey={"rowId"}
                        pagination={false}
                        bordered
                        scroll={{y: 400}}
                        columns={[
                            {title: '科目', dataIndex: 'name'},
                            {
                                title: '教师', dataIndex: 'teacherId', render: (value, record) => (
                                    <Select
                                        style={{width: 200}}
                                        value={record.teacherId}
                                        onChange={value => {
                                            record.teacherId = value;
                                            this.setState({
                                                refreshPage: !this.state.refreshPage
                                            })
                                        }}
                                        options={teacherAllList.map(t => ({
                                            value: t.rowId,
                                            label: t.name
                                        }))} />
                                )
                            },
                            {
                                title: "场地", dataIndex: "spaceId", render: (value, record) => (
                                    <Select
                                        style={{width: 200}}
                                        value={record.spaceId}
                                        onChange={value => {
                                            record.spaceId = value;
                                            this.setState({
                                                refreshPage: !this.state.refreshPage
                                            })
                                        }}
                                        options={spaceAllList.map(s => ({
                                            value: s.rowId,
                                            label: s.name
                                        }))}
                                    />
                                )
                            }
                        ]}
                        dataSource={this.state.editTeacherDataSource}
                    />
                </Modal>
            </div>
        );
    }

}

export default connect(({baseData}) => ({baseData}))(Class);
