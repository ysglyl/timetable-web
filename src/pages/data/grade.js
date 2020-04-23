import React from 'react';
import {connect} from 'dva';
import {Alert, Button, Input, Modal, Table, Transfer} from "antd"

const {TextArea} = Input;

class Grade extends React.PureComponent {

    state = {
        selectedKeys: [],
        modalVisibleAddGrade: false,
        addGradeNames: [],
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'baseData/gradeAllList'
        })
    }

    render() {
        const {
            baseData: {
                gradeAllList
            }
        } = this.props;
        const {selectedKeys} = this.state;
        return (
            <div>
                <Table
                    size="small"
                    rowKey={'rowId'}
                    columns={[
                        {title: '班级名称', dataIndex: 'name'}
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
                            payload: addGradeNames.map(name => ({
                                name
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
            </div>
        );
    }

}

export default connect(({baseData}) => ({baseData}))(Grade);
