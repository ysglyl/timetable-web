import React from 'react';
import {connect} from 'dva';
import {Alert, Button, InputNumber, Modal, Table} from "antd";

import styles from './class.less';

class Class extends React.PureComponent {

    state = {
        selectedKeys: [],
        modalVisibleAddClass: false,
        addClassMap: {},
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
    }

    render() {
        const {
            baseData: {
                gradeAllList,
                classAllList
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
                        {title: '班主任', dataIndex: 'director'},
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
                            payload: Object.entries(addClassMap).map(([k,v]) => ({
                                gradeId:k,
                                classCount:v
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
            </div>
        );
    }

}

export default connect(({baseData}) => ({baseData}))(Class);
