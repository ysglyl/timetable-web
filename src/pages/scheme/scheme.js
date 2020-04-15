import React from 'react';
import {Button, Modal, Table} from 'antd';

export default class Scheme extends React.PureComponent {

  state = {
    addModalVisible: false
  }

  clickAdd = () => {
    this.setState({
      addModalVisible: true
    });
  }

  handleAddOk = () => {
    this.setState({
      addModalVisible: false
    });
  }

  render() {
    return (
      <div>
        <Table
          size="small"
          rowKey={'rowId'}
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
              title: '操作', render: (value, row) => (
                <Button type={'link'}>修改</Button>
              )
            }
          ]}
          dataSource={[
            {
              rowId: 1,
              name: '2019-2020学年第二学期课表',
              daysInWeek: 5,
              sectionsInMorning: 0,
              sectionsInForenoon: 4,
              sectionsInNoon: 0,
              sectionsInAfternoon: 3,
              sectionsInEvening: 0
            },
            {
              rowId: 1,
              name: '2020-2021学年第一学期课表',
              daysInWeek: 5,
              sectionsInMorning: 0,
              sectionsInForenoon: 4,
              sectionsInNoon: 0,
              sectionsInAfternoon: 3,
              sectionsInEvening: 0
            },
            {
              rowId: 1,
              name: '2020-2021学年第二学期课表',
              daysInWeek: 5,
              sectionsInMorning: 0,
              sectionsInForenoon: 4,
              sectionsInNoon: 0,
              sectionsInAfternoon: 3,
              sectionsInEvening: 0
            }
          ]}
          bordered
          title={() => (
            <div>
              <Button onClick={this.clickAdd}>新增</Button>
            </div>
          )}
        />
        <Modal
          visible={this.state.addModalVisible}
          onCancel={() => {
            this.setState({
              addModalVisible: false
            });
          }}
          title="基本信息"
          footer={[
            <Button key="submit" type="primary" onClick={this.handleAddOk}>
              Submit
            </Button>,
          ]}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }

}
