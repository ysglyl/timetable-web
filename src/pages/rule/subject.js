import React from 'react';
import {Button, Checkbox, Form, Modal, Select, Table, Transfer} from "antd";
import {connect} from "dva";
import {getSubjectSpecialCondition} from "@/utils/tool";


class Subject extends React.PureComponent {

    state = {
        selectedKeys: [],
        selectedScheme: {},
        modalVisibleAdd: false,
        addSubjects: [],
        addForm: null
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'scheme/schemeAllList'
        });
        dispatch({
            type: 'baseData/subjectAllList'
        });
    }

    render() {
        const {baseData: {subjectAllList}, scheme: {schemeAllList}, rule: {subjectSpecialAllList}} = this.props;
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
                                        type: "rule/subjectSpecialAllList",
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
                                    type: 'rule/subjectSpecialDeleteBatch',
                                    payload: selectedKeys,
                                    callback: () => {
                                        dispatch({
                                            type: 'rule/subjectSpecialAllList',
                                            payload: {schemeId: selectedScheme.rowId}
                                        })
                                    }
                                })
                            }}>批量删除</Button>}
                        </div>
                    )}
                    columns={[
                        {
                            title: "科目",
                            dataIndex: "subjects",
                            render: (value) => value.map((v) => v.name).join('，')
                        },
                        {
                            title: '要求',
                            dataIndex: "type",
                            render: (value, record) => getSubjectSpecialCondition(value, record.condition)
                        }
                    ]}
                    dataSource={subjectSpecialAllList}
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
                        disabled: !(this.state.addSubjects.length > 0)
                    }}
                    onOk={() => {
                        const {addForm, addSubjects} = this.state;
                        const {dispatch} = this.props;
                        const specials = [];
                        const values = addForm.getFieldsValue();
                        if (values.diffDayFlag) {
                            specials.push({
                                type: 1
                            });
                        }
                        if (values.diffForenoonFlag) {
                            specials.push({
                                type: 2
                            });
                        }
                        if (values.diffAfternoonFlag) {
                            specials.push({
                                type: 3,
                            });
                        }
                        if (values.diffTogetherFlag) {
                            specials.push({
                                type: 4,
                            });
                        }
                        dispatch({
                            type: "rule/subjectSpecialSaveBatch",
                            payload: {
                                schemeId: selectedScheme.rowId,
                                list: specials,
                                subjectIds: addSubjects,
                            },
                            callback: (res) => {
                                if (res.code === 200) {
                                    this.setState({
                                        modalVisibleAdd: false
                                    })
                                    dispatch({
                                        type: 'rule/subjectSpecialAllList',
                                        payload: {schemeId: selectedScheme.rowId}
                                    })
                                }
                            }
                        });
                    }}>
                    <Transfer
                        rowKey={record => record.rowId}
                        dataSource={subjectAllList}
                        showSearch
                        locale={{
                            itemUnit: '科', itemsUnit: '科', searchPlaceholder: '根据名称搜索'
                        }}
                        targetKeys={this.state.addSubjects}
                        onChange={(targetKeys) => {
                            this.setState({
                                addSubjects: targetKeys,
                            })
                        }}
                        render={item => item.name}
                    />
                    <Form ref={form => this.setState({
                        addForm: form
                    })}>
                        <Form.Item name={"diffDayFlag"} valuePropName={"checked"}>
                            <Checkbox>不能同天上课</Checkbox>
                        </Form.Item>
                        <Form.Item name={"diffForenoonFlag"} valuePropName={"checked"}>
                            <Checkbox>不能同天上午上课</Checkbox>
                        </Form.Item>
                        <Form.Item name={"diffAfternoonFlag"} valuePropName={"checked"}>
                            <Checkbox>不能同天下午上课</Checkbox>
                        </Form.Item>
                        <Form.Item name={"diffTogetherFlag"} valuePropName={"checked"}>
                            <Checkbox>不能相邻上课</Checkbox>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }

}

export default connect(({scheme, rule, baseData}) => ({scheme, rule, baseData}))(Subject)
