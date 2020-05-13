import React from 'react';
import {connect} from 'dva';
import {Button, Form, Input, InputNumber, Modal, Select, Table} from "antd"
import grade from "@/pages/data/grade";

class Setting extends React.PureComponent {

    state = {
        selectedSchemeId: null,
        selectedKeys: [],
        schemeGradeList: [],
        schemeClassList: [],
        addModalVisible: false,
        addForm: null,
        editRowId: null
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'scheme/schemeAllList'
        })
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
        const {baseData: {subjectAllList, teacherAllList, spaceAllList}, scheme: {schemeAllList, settingAllList}} = this.props;
        const {selectedKeys, schemeGradeList, schemeClassList} = this.state
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
                                    const gradeIds = [];
                                    const gradeList = [];
                                    const scheme = schemeAllList.find(d => d.rowId === value);
                                    scheme.classes.forEach(d => {
                                        if (!gradeIds.includes(d.gradeId)) {
                                            gradeIds.push(d.gradeId);
                                            gradeList.push(d.grade);
                                        }
                                    })
                                    this.setState({
                                        selectedSchemeId: value,
                                        schemeGradeList: gradeList,
                                        schemeClassList: scheme.classes
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
                    title="排课设置"
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
                                {schemeGradeList.map(grade => (
                                    <Select.OptGroup key={`select_group_${grade.rowId}`} label={grade.name}>
                                        {schemeClassList.filter(c => c.gradeId === grade.rowId).map(c => (
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
            </div>
        );
    }

}

export default connect(({scheme, baseData}) => ({scheme, baseData}))(Setting)
