import React, {Fragment} from 'react';
import {connect} from 'umi';
import {Button, Input, Modal, Table} from "antd"

const {TextArea} = Input;

class Subject extends React.PureComponent {

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'baseData/subjectAllList'
        })
    }

    render() {
        const {
            baseData: {
                subjectAllList
            }
        } = this.props;
        return (
            <div>
                <Table
                    size="small"
                    rowKey={'rowId'}
                    columns={[
                        {title: '科目名称', dataIndex: 'name'},
                        {title: '科目简称', dataIndex: 'shortName'},
                        {
                            title: '操作', render: (value, row) => (
                                <Button type={'link'}>修改</Button>
                            )
                        }
                    ]}
                    dataSource={subjectAllList}
                    bordered
                    title={() => (
                        <div>
                            <Button onClick={() => {
                                Modal.info({
                                    title: '批量新增科目',
                                    content: (
                                        <Fragment>
                                            <TextArea></TextArea>
                                        </Fragment>
                                    )
                                })
                            }}>批量新增</Button>
                        </div>
                    )}
                />
            </div>
        );
    }

}

export default connect(({baseData}) => ({baseData}))(Subject);
