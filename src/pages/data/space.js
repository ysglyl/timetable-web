import React from 'react';
import {connect} from 'dva';
import {Button, Form, Input, InputNumber, Modal, Table} from "antd"

class Space extends React.PureComponent {

    state = {
        selectedKeys: [],
        modalAddVisible: false,
        addModel: {},
        refreshPage: false
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'baseData/spaceAllList'
        })
    }

    render() {
        const {
            baseData: {
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
                        {title: '场地', dataIndex: 'name'},
                        {title: '可容纳班级数', dataIndex: 'volume'},
                        {
                            title: '是否独占', dataIndex: "classId", render:(value) => value != null ? "是" : "否"
                        },
                    ]}
                    pagination={false}
                    dataSource={spaceAllList}
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
                                    modalAddVisible: true
                                })
                            }}>新增</Button>
                            <Button style={{marginLeft: 8}} onClick={() => {
                                const {dispatch} = this.props;
                                dispatch({
                                    type: 'baseData/spaceSaveParticular',
                                    callback: () => {
                                        dispatch({
                                            type: 'baseData/spaceAllList'
                                        })
                                    }
                                })
                            }}>刷新独占教室</Button>
                            {selectedKeys.length > 0 &&
                            <Button type={'danger'} style={{marginLeft: 8}} onClick={() => {
                                const {dispatch} = this.props;
                                dispatch({
                                    type: 'baseData/spaceDeleteBatch',
                                    payload: selectedKeys,
                                    callback: () => {
                                        this.setState({
                                            selectedKeys: []
                                        });
                                        dispatch({
                                            type: 'baseData/spaceAllList'
                                        })
                                    }
                                })
                            }}>批量删除</Button>}
                        </div>
                    )}
                />
                <Modal
                    visible={this.state.modalAddVisible}
                    title={'新增场地'}
                    cancelText={"取消"}
                    onCancel={() => {
                        this.setState({
                            modalAddVisible: false
                        })
                    }}
                    okText={"确定"}
                    okButtonProps={{
                        disabled: !(this.state.addModel.name && this.state.addModel.volume)
                    }}
                    onOk={() => {
                        const {addModel} = this.state;
                        const {dispatch} = this.props;
                        dispatch({
                            type: "baseData/spaceSave",
                            payload: addModel,
                            callback: () => {
                                this.setState({
                                    modalAddVisible: false,
                                    addModel: {volume: 1}
                                })
                                dispatch({
                                    type: 'baseData/spaceAllList'
                                })
                            }
                        });
                    }}>
                    <Form labelCol={{span: 8}} wrapperCol={{span: 16}}>
                        <Form.Item label={"场地名称"}>
                            <Input placeholder={"请输入场地名称"} value={this.state.addModel.name} onChange={(e) => {
                                const {refreshPage, addModel} = this.state;
                                addModel.name = e.target.value;
                                this.setState({
                                    refreshPage: !refreshPage
                                })
                            }} />
                        </Form.Item>
                        <Form.Item label={"可容纳班数"}>
                            <InputNumber placeholder={'请选择班'} min={1} value={this.state.addModel.volume}
                                         onChange={val => {
                                             const {refreshPage, addModel} = this.state;
                                             addModel.volume = val;
                                             this.setState({
                                                 refreshPage: !refreshPage
                                             })
                                         }} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }

}

export default connect(({baseData}) => ({baseData}))(Space);
