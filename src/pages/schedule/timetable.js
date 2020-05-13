import React, {Fragment} from 'react';
import {Card, Collapse, Select, Table, Tabs} from "antd"
import {connect} from "dva";
import {
    formatClassTimetableData,
    formatSchoolTimetableData,
    formatSpaceTimetableData,
    formatTeacherTimetableData,
    initTimetableColumn,
    initWeekColumn
} from "@/utils/tool";

const {TabPane} = Tabs;

class Timetable extends React.PureComponent {

    state = {
        selectedScheme: null,
        columns: [],
        weekColumns: [],
        dataSource: []
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'scheme/schemeAllList'
        });
    }


    render() {
        const {scheme: {schemeAllList}, schedule: {timetableUnitAllList}} = this.props;
        return (
            <Card size={"small"} title={
                <Fragment>
                    <Select
                        style={{minWidth: 200}}
                        placeholder={"请选择排课方案"}
                        onChange={(value) => {
                            const scheme = schemeAllList.find(d => d.rowId === value);
                            this.setState({
                                selectedScheme: scheme,
                                columns: initTimetableColumn(scheme),
                                weekColumns: initWeekColumn(scheme)
                            });

                            const {dispatch} = this.props;
                            dispatch({
                                type: 'schedule/timetableUnitAllList',
                                payload: {schemeId: value}
                            });
                        }}
                        options={schemeAllList.map(s => ({
                            value: s.rowId,
                            label: s.name
                        }))} />
                </Fragment>}>
                <Tabs defaultActiveKey="0">
                    <TabPane tab="班级课表" key="0">
                        <Collapse>
                            {Object.entries(formatClassTimetableData(timetableUnitAllList)).map(([k, v]) => (
                                <Collapse.Panel header={k} key={k}>
                                    <Table
                                        bordered
                                        size="small"
                                        rowKey={'rowId'}
                                        scroll={{x: 'max-content'}}
                                        pagination={false}
                                        columns={[{
                                            title: '-',
                                            fixed: true,
                                            width: 120,
                                            dataIndex: "sectionName"
                                        }, ...this.state.weekColumns]}
                                        dataSource={this.state.selectedScheme ? v.sort((a, b) => a.rowId - b.rowId) : []}
                                    />
                                </Collapse.Panel>
                            ))}
                        </Collapse>
                    </TabPane>
                    <TabPane tab="全校课表" key="1">
                        <Table
                            bordered
                            size="small"
                            rowKey={'rowId'}
                            scroll={{x: 'max-content'}}
                            pagination={false}
                            columns={[{
                                title: '班级',
                                fixed: true,
                                width: 120,
                                dataIndex: "className"
                            }, ...this.state.columns]}
                            dataSource={this.state.selectedScheme ? formatSchoolTimetableData(timetableUnitAllList) : []}
                        />
                    </TabPane>
                    <TabPane tab="教师课表" key="2">
                        <Table
                            bordered
                            size="small"
                            rowKey={'rowId'}
                            scroll={{x: 'max-content'}}
                            pagination={false}
                            columns={[{
                                title: '教师',
                                fixed: true,
                                width: 120,
                                dataIndex: "teacherName"
                            }, ...this.state.columns]}
                            dataSource={this.state.selectedScheme ? formatTeacherTimetableData(timetableUnitAllList) : []}
                        />
                    </TabPane>
                    <TabPane tab="场地课表" key="3">
                        <Table
                            bordered
                            size="small"
                            rowKey={'rowId'}
                            scroll={{x: 'max-content'}}
                            pagination={false}
                            columns={[{
                                title: '场地',
                                fixed: true,
                                width: 120,
                                dataIndex: "spaceName"
                            }, ...this.state.columns]}
                            dataSource={this.state.selectedScheme ? formatSpaceTimetableData(timetableUnitAllList) : []}
                        />
                    </TabPane>
                </Tabs>
            </Card>
        );
    }

}

export default connect(({scheme, schedule}) => ({scheme, schedule}))(Timetable);
