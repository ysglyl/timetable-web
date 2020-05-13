import React from 'react';
import {connect} from 'dva';
import {Alert, Button, Input, InputNumber, Modal, Table} from "antd"

const {TextArea} = Input;

class Grade extends React.PureComponent {

    state = {
        selectedKeys: [],
        modalVisibleAddGrade: false,
        addGradeNames: [],
        modalVisibleEditSubject: false,
        editGrade: null,
        refreshPage: false
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'baseData/gradeAllList'
        })
        dispatch({
            type: "baseData/subjectAllList"
        });
    }

    render() {
        const {
            baseData: {
                gradeAllList,
                subjectAllList
            }
        } = this.props;
        const {selectedKeys} = this.state;
        return (
            <div>
                <Table
                    size="small"
                    rowKey={'rowId'}
                    columns={[
                        {title: '班级名称', dataIndex: 'name'},
                        {
                            title: "操作", render: (val, record) => (<Button type={'link'} onClick={() => {
                                subjectAllList.forEach(s => {
                                    s.sectionCount = 0;
                                    for (let i = 0; i < record.subjectRelList.length; i++) {
                                        if (record.subjectRelList[i].subjectId == s.rowId) {
                                            s.sectionCount = record.subjectRelList[i].sectionCount;
                                            break;
                                        }
                                    }
                                });
                                this.setState({
                                    modalVisibleEditSubject: true,
                                    editGrade: record
                                });
                            }}>课务安排</Button>)
                        }
                    ]}
                    pagination={false}
                    dataSource={gradeAllList}
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
                                    modalVisibleAddGrade: true
                                })
                            }}>批量新增</Button>
                            {selectedKeys.length > 0 &&
                            <Button type={'danger'} style={{marginLeft: 8}} onClick={() => {
                                const {dispatch} = this.props;
                                dispatch({
                                    type: 'baseData/gradeDeleteBatch',
                                    payload: selectedKeys,
                                    callback: () => {
                                        this.setState({
                                            selectedKeys: []
                                        });
                                        dispatch({
                                            type: 'baseData/gradeAllList'
                                        })
                                    }
                                })
                            }}>批量删除</Button>}
                        </div>
                    )}
                />
                <Modal
                    visible={this.state.modalVisibleAddGrade}
                    title={'批量新增年级'}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalVisibleAddGrade: false
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: this.state.addGradeNames.length === 0
                    }}
                    onOk={() => {
                        const {addGradeNames} = this.state;
                        const {dispatch} = this.props;
                        dispatch({
                            type: "baseData/gradeSaveBatch",
                            payload: addGradeNames.map((name, index) => ({
                                name,
                                shortName: name,
                                orderNum: index + 1
                            })),
                            callback: () => {
                                this.setState({
                                    modalVisibleAddGrade: false
                                })
                                dispatch({
                                    type: 'baseData/gradeAllList'
                                })
                            }
                        });
                    }}>
                    <TextArea rows={10} onChange={(e) => {
                        this.setState({
                            addGradeNames: e.target.value.split("\n").map(i => i.trim()).filter(i => i)
                        })
                    }} />
                    <Alert style={{marginTop: 5}} message={'每年级独占一行'} type="info" />
                </Modal>
                <Modal
                    visible={this.state.modalVisibleEditSubject}
                    title={'编辑教务安排'}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalVisibleEditSubject: false,
                            editGrade: null
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: !subjectAllList.some(s => s.sectionCount)
                    }}
                    onOk={() => {
                        const {dispatch} = this.props;
                        dispatch({
                            type: "baseData/gradeSubjectSaveBatch",
                            payload: {
                                gradeId: this.state.editGrade.rowId,
                                list: subjectAllList.filter(s => s.sectionCount).map(item => ({
                                    gradeId: this.state.editGrade.rowId,
                                    subjectId: item.rowId,
                                    sectionCount: item.sectionCount
                                }))
                            },
                            callback: () => {
                                this.setState({
                                    modalVisibleEditSubject: false
                                })
                                dispatch({
                                    type: 'baseData/gradeAllList'
                                })
                            }
                        });
                    }}>
                    <Table
                        size="small"
                        rowKey={(record) => `${record.gradeId}_${record.subjectId}`}
                        pagination={false}
                        bordered
                        scroll={{y: 400}}
                        columns={[
                            {title: '科目', dataIndex: 'name'},
                            {
                                title: '课节数', dataIndex: 'sectionCount', render: (value, record) => (
                                    <InputNumber min={0} style={{width: 60}} defaultValue={0}
                                                 value={record.sectionCount || 0}
                                                 onChange={value => {
                                                     record.sectionCount = value;
                                                     this.setState({
                                                         refreshPage: !this.state.refreshPage
                                                     })
                                                 }} />
                                )
                            }
                        ]}
                        dataSource={subjectAllList}
                    />
                </Modal>
            </div>
        );
    }

}

export default connect(({baseData}) => ({baseData}))(Grade);
