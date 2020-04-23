import React from 'react';
import {Card, Select, Tabs,Table} from "antd"
import {connect} from "dva";

const {TabPane} = Tabs;

class Timetable extends React.PureComponent {

    state = {
        selectedScheme: null,
        refreshPage: false
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'scheme/schemeAllList'
        });
    }


    render() {
        const {scheme: {schemeAllList}} = this.props;
        return (
            <Card size={"small"} title={
                <Select
                    style={{minWidth: 200}}
                    placeholder={"请选择排课方案"}
                    onChange={(value) => {
                    }}
                    options={schemeAllList.map(s => ({
                        value: s.rowId,
                        label: s.name
                    }))} />}>
                <Tabs defaultActiveKey="1" onChange={(key) => {

                }}>
                    <TabPane tab="班级课表" key="1">
                        <Table />
                    </TabPane>
                    <TabPane tab="教师课表" key="2">
                        <Table />
                    </TabPane>
                    <TabPane tab="场地课表" key="3">
                        <Table />
                    </TabPane>
                </Tabs>
            </Card>
        );
    }

}

export default connect(({scheme}) => ({scheme}))(Timetable);
