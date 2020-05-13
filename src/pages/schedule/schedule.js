import React from 'react';
import {Button, Table} from "antd"
import {connect} from "dva";
import {LoadingOutlined} from '@ant-design/icons';


class Schedule extends React.PureComponent {

    state = {
        refreshTask: null
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'scheme/schemeAllList'
        });
    }

    render() {
        const {scheme: {schemeAllList}} = this.props;
        if (schemeAllList.some(item => item.status === 2)) {
            if (this.state.refreshTask != null) {
                clearTimeout(this.state.refreshTask);
            }
            this.state.refreshTask = setTimeout(() => {
                const {dispatch} = this.props;
                dispatch({
                    type: 'scheme/schemeAllList'
                });
            }, 1000)
        }
        return (
            <div>
                <Table
                    size="small"
                    rowKey={'rowId'}
                    bordered
                    pagination={false}
                    columns={[
                        {title: '排课方案', dataIndex: 'name'},
                        {
                            title: '排课状态', dataIndex: 'status', render(value) {
                                switch (value) {
                                    case 0:
                                        return '尚未配置';
                                    case 1:
                                        return '未排';
                                    case 2:
                                        return "正在排课";
                                    case 3:
                                        return '已排';
                                    case -1:
                                        return "排课失败";
                                }
                            }
                        },
                        {
                            title: '操作', render: (value, row) => (
                                row.status === 2 ? <LoadingOutlined /> :
                                    <Button type={'link'} onClick={() => {
                                        const {dispatch} = this.props;
                                        dispatch({
                                            type: "scheme/schemeSchedule",
                                            payload: {schemeId: row.rowId},
                                            callback: (res) => {
                                                if (res.code === 200) {
                                                    dispatch({
                                                        type: 'scheme/schemeAllList'
                                                    });
                                                }
                                            }
                                        })
                                    }}>重排</Button>
                            )
                        }
                    ]}
                    dataSource={schemeAllList}
                />
            </div>
        );
    }

}

export default connect(({scheme}) => ({scheme}))(Schedule);
