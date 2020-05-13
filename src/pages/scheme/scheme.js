import React, {Fragment} from 'react';
import {connect} from 'dva';

import {Button, Form, Input, InputNumber, Modal, Select, Table} from 'antd';

import styles from './scheme.less'

class Scheme extends React.PureComponent {

    state = {
        selectedKeys: [],
        addModalVisible: false,
        addForm: null,
        editRowId: null
    }

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
    }

    render() {
        const {scheme: {schemeAllList}, baseData: {gradeAllList, classAllList}} = this.props;
        const {selectedKeys} = this.state;
        return (
            <div>
                <Table
                    size="small"
                    rowKey={'rowId'}
                    pagination={false}
                    bordered
                    title={() => (
                        <div>
                            <Button onClick={() => this.setState({
                                addModalVisible: true
                            })}>新增</Button>
                            {selectedKeys.length > 0 &&
                            <Button type={'danger'} style={{marginLeft: 8}} onClick={() => {
                                const {dispatch} = this.props;
                                dispatch({
                                    type: 'scheme/schemeDeleteBatch',
                                    payload: selectedKeys,
                                    callback: () => {
                                        this.setState({
                                            selectedKeys: []
                                        });
                                        dispatch({
                                            type: 'scheme/schemeAllList'
                                        })
                                    }
                                })
                            }}>批量删除</Button>}
                        </div>
                    )}
                    columns={[
                        {title: '方案名称', dataIndex: 'name'},
                        {title: '每周天数', dataIndex: 'daysInWeek'},
                        {
                            title: '每天节数', children: [
                                {title: '早读', dataIndex: 'sectionsInMorning'},
                                {title: '上午', dataIndex: 'sectionsInForenoon'},
                                {title: '中午', dataIndex: 'sectionsInNoon'},
                                {title: '下午', dataIndex: 'sectionsInAfternoon'},
                                {title: '晚自习', dataIndex: 'sectionsInEvening'},
                            ]
                        },
                        {
                            title: "操作", render: (value, record) => (
                                <Fragment>
                                    <Button type={'link'} onClick={() => {
                                        this.state.addForm.setFieldsValue({
                                            ...record,
                                            classIds: record.classes.map(c => c.rowId)
                                        });
                                        this.setState({
                                            addModalVisible: true,
                                            editRowId: record.rowId
                                        });
                                    }}>修改</Button>
                                </Fragment>
                            )
                        }
                    ]}
                    dataSource={schemeAllList}
                    rowSelection={{
                        onChange: (selectedKeys) => {
                            this.setState({
                                selectedKeys
                            })
                        }
                    }}
                />
                <Modal
                    forceRender
                    centered
                    visible={this.state.addModalVisible}
                    title="基本信息"
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
                                type: "scheme/schemeSave",
                                payload: {
                                    ...values,
                                    rowId: this.state.editRowId,
                                    classes: values.classIds.map(id => ({rowId: id})),
                                    classIds: null
                                },
                                callback: res => {
                                    if (res.code === 200) {
                                        this.setState({
                                            addModalVisible: false
                                        });
                                        dispatch({
                                            type: "scheme/schemeAllList"
                                        })
                                    }
                                }
                            })
                        });
                    }}
                >
                    <Form ref={(form) => {
                        this.setState({
                            addForm: form
                        })
                    }} initialValues={{
                        daysInWeek: 5,
                        sectionsInMorning: 0,
                        sectionsInForenoon: 4,
                        sectionsInNoon: 0,
                        sectionsInAfternoon: 3,
                        sectionsInEvening: 0
                    }} labelCol={{span: 8}} wrapperCol={{span: 12}}>
                        <Form.Item name={'name'} label={'方案名称'}>
                            <Input placeholder={"请输入方案名称"}
                                   rules={[{required: true, message: '请输入方案名称'}]} />
                        </Form.Item>
                        <Form.Item label={"每周"}>
                            <Form.Item name={"daysInWeek"} noStyle>
                                <InputNumber min={1} />
                            </Form.Item>
                            <span className={styles.suffix}>天</span>
                        </Form.Item>
                        <Form.Item label={"早读"}>
                            <Form.Item name={"sectionsInMorning"} noStyle>
                                <InputNumber min={0} />
                            </Form.Item>
                            <span className={styles.suffix}>节</span>
                        </Form.Item>
                        <Form.Item label={"上午"}>
                            <Form.Item name={"sectionsInForenoon"} noStyle>
                                <InputNumber min={0} />
                            </Form.Item>
                            <span className={styles.suffix}>节</span>
                        </Form.Item>
                        <Form.Item label={"中午"}>
                            <Form.Item name={"sectionsInNoon"} noStyle>
                                <InputNumber min={0} />
                            </Form.Item>
                            <span className={styles.suffix}>节</span>
                        </Form.Item>
                        <Form.Item label={"下午"}>
                            <Form.Item name={"sectionsInAfternoon"} noStyle>
                                <InputNumber min={0} />
                            </Form.Item>
                            <span className={styles.suffix}>节</span>
                        </Form.Item>
                        <Form.Item label={"晚自习"}>
                            <Form.Item name={"sectionsInEvening"} noStyle>
                                <InputNumber min={0} />
                            </Form.Item>
                            <span className={styles.suffix}>节</span>
                        </Form.Item>
                        <Form.Item label={'班级'} name={"classIds"}>
                            <Select placeholder={"请选择班级"} mode={'multiple'}>
                                {gradeAllList.map(grade => (
                                    <Select.OptGroup key={`select_group_${grade.rowId}`} label={grade.name}>
                                        {classAllList.filter(c => c.gradeId === grade.rowId).map(c => (
                                            <Select.Option key={`select_option_${c.rowId}`}
                                                           value={c.rowId}>{c.name}</Select.Option>
                                        ))}
                                    </Select.OptGroup>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }

}

export default connect(({scheme, baseData}) => ({scheme, baseData}))(Scheme)
