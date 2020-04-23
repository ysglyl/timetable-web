import React from 'react';
import {Button, Table} from "antd"
import {connect} from "dva";

class Schedule extends React.PureComponent {


    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'scheme/schemeAllList'
        });
    }

    render() {
        const {scheme: {schemeAllList}} = this.props;
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
                                }
                            }
                        },
                        {
                            title: '操作', render: (value, row) => (
                                <Button disabled={row.status !== 1} type={'link'} onClick={() => {
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
                                }}>开始排课</Button>
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
