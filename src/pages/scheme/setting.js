import React from 'react';
import {connect} from 'dva';
import {Button, Form, Input, InputNumber, Modal, Select, Table} from "antd"
import grade from "@/pages/data/grade";

class Setting extends React.PureComponent {

    state = {
        selectedSchemeId: null,
        selectedKeys: [],
        addModalVisible: false,
        addForm: null,
        addBatchModalVisible: false,
        addBatchDatasource: [],
        editRowId: null
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'scheme/schemeAllList'
        })
        dispatch({
            type: 'baseData/gradeAllList'
        });
        dispatch({
            type: 'baseData/classAllList'
        });
        dispatch({
            type: "baseData/subjectAllList"
        });
        dispatch({
            type: "baseData/teacherAllList"
        });
        dispatch({
            type: "baseData/spaceAllList"
        });
    }

    render() {
        const {baseData: {gradeAllList, subjectAllList, classAllList, teacherAllList, spaceAllList}, scheme: {schemeAllList, settingAllList}} = this.props;
        const {selectedKeys, addBatchDatasource} = this.state
        return (
            <div>
                <Table
                    size="small"
                    rowKey={'rowId'}
                    pagination={false}
                    bordered
                    scroll={{y: 500}}
                    title={() => (
                        <div>
                            <Select
                                style={{minWidth: 200}}
                                placeholder={"请选择排课方案"}
                                onChange={(value) => {
                                    const {dispatch} = this.props;
                                    this.setState({
                                        selectedSchemeId: value
                                    })
                                    dispatch({
                                        type: 'scheme/settingAllList',
                                        payload: {schemeId: value}
                                    });
                                }}
                                options={schemeAllList.map(s => ({
                                    value: s.rowId,
                                    label: s.name
                                }))} />
                            <Button style={{marginLeft: 8}} disabled={!this.state.selectedSchemeId} onClick={() => {
                                this.setState({
                                    addModalVisible: true,
                                    editRowId: null
                                });
                                this.state.addForm.resetFields();
                            }}>新增</Button>
                            <Button style={{marginLeft: 8}} disabled={!this.state.selectedSchemeId} onClick={() => {
                                if (this.state.addBatchDatasource.length === 0) {
                                    const ds = [];
                                    gradeAllList.forEach(grade => {
                                        subjectAllList.forEach(subject => {
                                            ds.push({
                                                gradeId: grade.rowId,
                                                gradeName: grade.name,
                                                subjectId: subject.rowId,
                                                subjectName: subject.name,
                                                sectionCount: 0,
                                                continuousCount: 0
                                            })
                                        })
                                    })
                                    this.setState({
                                        addBatchModalVisible: true,
                                        addBatchDatasource: ds
                                    })
                                } else {
                                    this.setState({
                                        addBatchModalVisible: true
                                    })
                                }
                            }}>年级批量设置</Button>
                            {selectedKeys.length > 0 &&
                            <Button type={'danger'} style={{marginLeft: 8}} onClick={() => {
                                const {dispatch} = this.props;
                                dispatch({
                                    type: 'scheme/settingDeleteBatch',
                                    payload: selectedKeys,
                                    callback: () => {
                                        this.setState({
                                            selectedKeys: []
                                        });
                                        dispatch({
                                            type: 'scheme/settingAllList',
                                            payload: {schemeId: this.state.selectedSchemeId}

                                        })
                                    }
                                })
                            }}>批量删除</Button>}
                        </div>
                    )}
                    columns={[
                        {title: '年级', dataIndex: ['classModel', 'grade', 'name']},
                        {title: '班级', dataIndex: ['classModel', 'name']},
                        {title: '科目', dataIndex: ['subject', 'name']},
                        {title: '教师', dataIndex: ['teacher', 'name']},
                        {title: '课节数', dataIndex: 'sectionCount'},
                        {title: '连堂次数', dataIndex: 'continuousCount'},
                        {title: '互斥组', dataIndex: 'dailyExclusiveGroup'},
                        {
                            title: '单双周', dataIndex: 'alternative', render: (val) => {
                                switch (val) {
                                    case 1:
                                        return '单周';
                                    case 2:
                                        return "双周";
                                    default:
                                        return "不限";
                                }
                            }
                        },
                        {title: '匹配组', dataIndex: 'matchGroup'},
                        {title: '教学场地', dataIndex: ['space', 'name']},
                        {
                            title: '操作', render: (value, row) => (
                                <Button type={'link'} disabled={!this.state.selectedSchemeId} onClick={() => {
                                    this.state.addForm.setFieldsValue(row);
                                    this.setState({
                                        addModalVisible: true,
                                        editRowId: row.rowId
                                    });
                                }}>修改</Button>
                            )
                        }
                    ]}
                    dataSource={settingAllList}
                    rowSelection={{
                        onChange: (selectedKeys) => {
                            this.setState({
                                selectedKeys
                            })
                        }
                    }}
                />
                <Modal
                    visible={this.state.addModalVisible}
                    forceRender
                    centered
                    title="新增排课设置"
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            addModalVisible: false
                        });
                    }}
                    okText={"确定"}
                    onOk={() => {
                        this.state.addForm.validateFields().then((values) => {
                            const {dispatch} = this.props;
                            dispatch({
                                type: "scheme/settingSave",
                                payload: {
                                    ...values,
                                    schemeId: this.state.selectedSchemeId,
                                    rowId: this.state.editRowId
                                },
                                callback: res => {
                                    if (res.code === 200) {
                                        this.setState({
                                            addModalVisible: false
                                        });
                                        dispatch({
                                            type: "scheme/settingAllList",
                                            payload: {
                                                schemeId: this.state.selectedSchemeId
                                            }
                                        })
                                    }
                                }
                            })
                        });
                    }}
                >
                    <Form ref={form => this.setState({
                        addForm: form
                    })} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                        <Form.Item label={'班级'} name={"classId"}>
                            <Select placeholder={"请选择班级"}>
                                {gradeAllList.map(grade => (
                                    <Select.OptGroup key={`select_group_${grade.rowId}`} label={grade.name}>
                                        {classAllList.filter(c => c.gradeId === grade.rowId).map(c => (
                                            <Select.Option key={`select_option_${c.rowId}`}
                                                           value={c.rowId}>{grade.name} {c.name}</Select.Option>
                                        ))}
                                    </Select.OptGroup>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label={'科目'} name={"subjectId"}>
                            <Select
                                placeholder={"请选择科目"}
                                options={subjectAllList.map(d => ({
                                    value: d.rowId,
                                    label: d.name
                                }))} />
                        </Form.Item>
                        <Form.Item label={'课节数'} name={"sectionCount"}>
                            <InputNumber min={1} />
                        </Form.Item>
                        <Form.Item label={'连堂次数'} name={"continuousCount"}>
                            <InputNumber min={0} />
                        </Form.Item>
                        <Form.Item label={'日互斥组'} name={"dailyExclusiveGroup"}>
                            <Input placeholder={"同组科目不能同一天上课"} />
                        </Form.Item>
                        <Form.Item label={'单双周'} name={'alternative'}>
                            <Select
                                options={[
                                    {value: 0, label: '不限'},
                                    {value: 1, label: '单周'},
                                    {value: 2, label: '双周'}
                                ]} />
                        </Form.Item>
                        <Form.Item label={'匹配组'} name={"matchGroup"}>
                            <Input
                                placeholder={"同组科目优先匹配相同时间"}
                                options={schemeAllList.map(s => ({
                                    value: s.rowId,
                                    label: s.name
                                }))} />
                        </Form.Item>
                        <Form.Item label={'教师'} name={"teacherId"}>
                            <Select
                                placeholder={"请选择教师"}
                                options={teacherAllList.map(d => ({
                                    value: d.rowId,
                                    label: d.name
                                }))} />
                        </Form.Item>
                        <Form.Item label={'场地'} name={"spaceId"}>
                            <Select
                                placeholder={"请选择场地"}
                                options={spaceAllList.map(s => ({
                                    value: s.rowId,
                                    label: s.name
                                }))} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    visible={this.state.addBatchModalVisible}
                    title="年级批量设置"
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            addBatchModalVisible: false
                        });
                    }}
                    okText={"确定"}
                    onOk={() => {
                        const {dispatch} = this.props;
                        dispatch({
                            type: "scheme/settingSaveBatch",
                            payload: addBatchDatasource.filter(d => d.sectionCount > 0).map(d => ({
                                ...d,
                                schemeId: this.state.selectedSchemeId
                            })),
                            callback: () => {
                                this.setState({
                                    addBatchModalVisible: false
                                });
                                dispatch({
                                    type: "scheme/settingAllList",
                                    payload: {
                                        schemeId: this.state.selectedSchemeId
                                    }
                                })
                            }
                        })
                    }}
                >
                    <Table
                        size="small"
                        rowKey={(record) => `${record.gradeId}_${record.subjectId}`}
                        pagination={false}
                        bordered
                        scroll={{y: 400}}
                        columns={[
                            {title: '年级', dataIndex: 'gradeName'},
                            {title: '科目', dataIndex: 'subjectName'},
                            {
                                title: '课节数', dataIndex: 'sectionCount', render: (value, record) => (
                                    <InputNumber min={0} defaultValue={value} style={{width: 60}} onChange={value => {
                                        record.sectionCount = value;
                                    }} />
                                )
                            },
                            {
                                title: '连堂次数', dataIndex: 'continuousCount', render: (value, record) => (
                                    <InputNumber min={0} defaultValue={value} style={{width: 60}} onChange={value => {
                                        record.continuousCount = value;
                                    }} />
                                )
                            },
                            {
                                title: '日互斥组', dataIndex: 'dailyExclusiveGroup', render: (value, record) => (
                                    <Input defaultValue={value} style={{width: 60}} onChange={e => {
                                        record.dailyExclusiveGroup = e.target.value;
                                    }} />
                                )
                            },
                        ]}
                        dataSource={addBatchDatasource}
                    />
                </Modal>
            </div>
        );
    }

}

export default connect(({scheme, baseData}) => ({scheme, baseData}))(Setting)
