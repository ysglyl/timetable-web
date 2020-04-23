import React from 'react';
import {Button, Checkbox, Form, InputNumber, Modal, Select, Table, Transfer} from "antd";
import {connect} from "dva";
import {getSectionNameList, getTeacherSpecialCondition} from "@/utils/tool";


class Teacher extends React.PureComponent {

    state = {
        selectedKeys: [],
        selectedScheme: {},
        modalVisibleAdd: false,
        addTeachers: [],
        addForm: null
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'scheme/schemeAllList'
        });
        dispatch({
            type: 'baseData/teacherAllList'
        });
    }

    render() {
        const {baseData: {teacherAllList}, scheme: {schemeAllList}, rule: {teacherSpecialAllList}} = this.props;
        const {selectedScheme, selectedKeys} = this.state;
        return (
            <div>
                <Table
                    rowKey={'rowId'}
                    bordered
                    size={'small'}
                    pagination={false}
                    scroll={{y: 500}}
                    title={() => (
                        <div>
                            <Select
                                style={{minWidth: 200}}
                                placeholder={"请选择排课方案"}
                                onChange={(value) => {
                                    const {dispatch} = this.props;
                                    this.setState({
                                        selectedScheme: schemeAllList.find(d => d.rowId === value)
                                    });
                                    dispatch({
                                        type: "rule/teacherSpecialAllList",
                                        payload: {schemeId: value}
                                    })
                                }}
                                options={schemeAllList.map(s => ({
                                    value: s.rowId,
                                    label: s.name
                                }))} />
                            <Button disabled={!selectedScheme.rowId} style={{marginLeft: 8}} onClick={() => {
                                this.setState({
                                    modalVisibleAdd: true
                                })
                            }}>新增</Button>
                            {selectedKeys.length > 0 &&
                            <Button type={'danger'} style={{marginLeft: 8}} onClick={() => {
                                const {dispatch} = this.props;
                                this.setState({
                                    selectedKeys: []
                                });
                                dispatch({
                                    type: 'rule/teacherSpecialDeleteBatch',
                                    payload: selectedKeys,
                                    callback: () => {
                                        dispatch({
                                            type: 'rule/teacherSpecialAllList',
                                            payload: {schemeId: selectedScheme.rowId}
                                        })
                                    }
                                })
                            }}>批量删除</Button>}
                        </div>
                    )}
                    columns={[
                        {
                            title: "教师",
                            dataIndex: "teachers",
                            render: (value) => value.map((v) => v.name).join('，')
                        },
                        {
                            title: '要求',
                            dataIndex: "type",
                            render: (value, record) => getTeacherSpecialCondition(value, record.condition)
                        }
                    ]}
                    dataSource={teacherSpecialAllList}
                    rowSelection={{
                        onChange: (selectedKeys) => {
                            this.setState({
                                selectedKeys
                            })
                        }
                    }}
                />
                <Modal
                    centered
                    visible={this.state.modalVisibleAdd}
                    title={'新增要求'}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalVisibleAdd: false
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: !(this.state.addTeachers.length > 0)
                    }}
                    onOk={() => {
                        const {addForm, addTeachers} = this.state;
                        const {dispatch} = this.props;
                        const specials = [];
                        const values = addForm.getFieldsValue();
                        if (values.daysLimit > 0) {
                            specials.push({
                                type: 1,
                                condition: values.daysLimit
                            });
                        }
                        if (values.sectionsLimit > 0) {
                            specials.push({
                                type: 2,
                                condition: values.sectionsLimit
                            });
                        }
                        if (values.forenoonSectionsLimit > 0) {
                            specials.push({
                                type: 3,
                                condition: values.forenoonSectionsLimit
                            });
                        }
                        if (values.afternoonSectionsLimit > 0) {
                            specials.push({
                                type: 4,
                                condition: values.afternoonSectionsLimit
                            });
                        }
                        if (values.sectionIndex != null && values.countLimit) {
                            specials.push({
                                type: 5,
                                condition: `${values.sectionIndex.label}:${values.sectionIndex.key}_${values.countLimit}`
                            });
                        }
                        if (values.diffFlag) {
                            specials.push({
                                type: 6
                            });
                        }
                        dispatch({
                            type: "rule/teacherSpecialSaveBatch",
                            payload: {
                                schemeId: selectedScheme.rowId,
                                list: specials,
                                teacherIds: addTeachers,
                            },
                            callback: (res) => {
                                if (res.code === 200) {
                                    this.setState({
                                        modalVisibleAdd: false
                                    })
                                    dispatch({
                                        type: 'rule/teacherSpecialAllList',
                                        payload: {schemeId: selectedScheme.rowId}
                                    })
                                }
                            }
                        });
                    }}>
                    <Transfer
                        rowKey={record => record.rowId}
                        dataSource={teacherAllList}
                        showSearch
                        locale={{
                            itemUnit: '位', itemsUnit: '位', searchPlaceholder: '根据名称搜索'
                        }}
                        targetKeys={this.state.addTeachers}
                        onChange={(targetKeys) => {
                            this.setState({
                                addTeachers: targetKeys,
                            })
                        }}
                        render={item => item.name}
                    />
                    <Form ref={form => this.setState({
                        addForm: form
                    })}>
                        <Form.Item label={"每周最多上"} colon={false}>
                            <Form.Item noStyle name={"daysLimit"}>
                                <InputNumber min={0} max={selectedScheme.daysInWeek} />
                            </Form.Item>天
                        </Form.Item>
                        <Form.Item label={"每天最多上"} colon={false}>
                            <Form.Item noStyle name={"sectionsLimit"}>
                                <InputNumber min={0}
                                             max={selectedScheme.sectionsInMorning + selectedScheme.sectionsInForenoon + selectedScheme.sectionsInNoon + selectedScheme.sectionsInAfternoon + selectedScheme.sectionsInEvening} />
                            </Form.Item>节
                        </Form.Item>
                        <Form.Item label={"每天上午最多上"} colon={false}>
                            <Form.Item noStyle name={"forenoonSectionsLimit"}>
                                <InputNumber min={0} max={selectedScheme.sectionsInForenoon} />
                            </Form.Item>节
                        </Form.Item>
                        <Form.Item label={"每天下午最多上"} colon={false}>
                            <Form.Item noStyle name={"afternoonSectionsLimit"}>
                                <InputNumber min={0} max={selectedScheme.sectionsInAfternoon} />
                            </Form.Item>天
                        </Form.Item>
                        <Form.Item>
                            <Form.Item noStyle name={"sectionIndex"}>
                                <Select style={{width: 120}} labelInValue
                                        options={getSectionNameList(selectedScheme.sectionsInMorning, selectedScheme.sectionsInForenoon, selectedScheme.sectionsInNoon, selectedScheme.sectionsInAfternoon, selectedScheme.sectionsInEvening)} />
                            </Form.Item>每周最多安排
                            <Form.Item noStyle name={"countLimit"}>
                                <InputNumber min={0} max={selectedScheme.daysInWeek} />
                            </Form.Item>次
                        </Form.Item>
                        <Form.Item name={"diffFlag"} valuePropName={"checked"}>
                            <Checkbox>不能同时上课</Checkbox>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }

}

export default connect(({scheme, rule, baseData}) => ({scheme, rule, baseData}))(Teacher)
