import React from 'react';
import {Button, Table} from "antd";

import TimeTable from '@/components/timetable';
import {getSectionName} from "@/utils/tool";

import classNames from 'classnames';
import styles from './teacherFixed.less'


export default class TeacherFixed extends React.PureComponent {

    state = {
        daysInWeek: 5,
        sectionsInMorning: 1,
        sectionsInForenoon: 4,
        sectionsInNoon: 0,
        sectionsInAfternoon: 3,
        sectionsInEvening: 2,
        subjectAllList: [
            {
                rowId: '1', name: '主课', children: [
                    {rowId: '11', name: '语文'},
                    {rowId: '12', name: '数学'},
                    {rowId: '13', name: '外语'}
                ]
            },
            {
                rowId: '2', name: '理科', children: [
                    {rowId: '21', name: '物理'},
                    {rowId: '22', name: '化学'},
                    {rowId: '23', name: '生物'}
                ]
            },
            {
                rowId: '3', name: '文科', children: [
                    {rowId: '31', name: '政治'},
                    {rowId: '32', name: '历史'},
                    {rowId: '33', name: '地理'}
                ]
            }
        ],
        subjectSelected: null,
        fixedMap: {},
        flagFixedType: 1,
        refreshPage: false
    };

    render() {
        const {
            daysInWeek, sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening,
            subjectAllList, flagFixedType, refreshPage
        } = this.state;
        return (
            <div>
                <Table
                    rowKey={'rowId'}
                    bordered
                    size={'small'}
                    pagination={false}
                    scroll={{y: 240}}
                    columns={[
                        {title: "科目/科目组", dataIndex: "name"},
                    ]}
                    dataSource={subjectAllList}
                    defaultExpandAllRows
                    rowSelection={{
                        type: 'radio',
                        onChange: (selectedRowKeys, selectedRows) => {
                            const {fixedMap} = this.state;
                            if (fixedMap.get(selectedRows[0].rowId) == null) {
                                fixedMap.set(selectedRows[0].rowId, new Array(4).fill(null).map(s => new Set()));
                            }
                            this.setState({
                                subjectSelected: selectedRows[0]
                            })
                        }
                    }}
                />
                <TimeTable
                    rows={sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon + sectionsInEvening + 1}
                    columns={daysInWeek + 1}
                    dividers={[sectionsInMorning, sectionsInMorning + sectionsInForenoon, sectionsInMorning + sectionsInForenoon + sectionsInNoon, sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon]}
                    hoverableTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex === 0 && columnIndex === 0) {
                            return true;
                        } else if (rowIndex > 0 && columnIndex > 0) {
                            return true;
                        }
                        return false;
                    }}
                    clickTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex === 0 && columnIndex === 0) {
                            this.setState({
                                flagFixedType: flagFixedType % 4 + 1
                            });
                        }
                        if (rowIndex > 0 && columnIndex > 0) {
                            const {subjectSelected, flagFixedType, fixedMap} = this.state;
                            if (subjectSelected === null) {
                                return;
                            }
                            const fixedList = fixedMap.get(subjectSelected.rowId);
                            if (fixedList == null) {
                                return;
                            }
                            if (fixedList[flagFixedType - 1].has(`${rowIndex}_${columnIndex}`)) {
                                fixedList[flagFixedType - 1].delete(`${rowIndex}_${columnIndex}`);
                            } else {
                                fixedList[flagFixedType - 1].add(`${rowIndex}_${columnIndex}`);
                            }
                            this.setState({
                                refreshPage: !refreshPage,
                            });
                        }
                    }}
                    renderTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex === 0 && columnIndex === 0) {
                            switch (flagFixedType) {
                                case 1:
                                    return <div
                                        className={classNames(styles.fixedTypeContainer, styles.fixed)}>固排</div>;
                                case 2:
                                    return <div
                                        className={classNames(styles.fixedTypeContainer, styles.suggest)}>建议</div>;
                                case 3:
                                    return <div
                                        className={classNames(styles.fixedTypeContainer, styles.oppose)}>反对</div>;
                                case 4:
                                    return <div className={classNames(styles.fixedTypeContainer, styles.ban)}>禁止</div>;
                                default:
                                    break;
                            }
                        } else if (rowIndex > 0 && columnIndex === 0) {
                            return getSectionName(rowIndex - 1, sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening);
                        } else if (rowIndex > 0 && columnIndex > 0) {
                            const {fixedMap, subjectSelected} = this.state;
                            if (subjectSelected == null) {
                                return null;
                            }
                            const fixedList = fixedMap.get(subjectSelected.rowId);
                            if (fixedList != null) {
                                if (fixedList[flagFixedType - 1].has(`${rowIndex}_${columnIndex}`)) {
                                    switch (flagFixedType) {
                                        case 1:
                                            return <div
                                                className={classNames(styles.fixedTypeContainer, styles.fixed)}>固排</div>;
                                        case 2:
                                            return <div
                                                className={classNames(styles.fixedTypeContainer, styles.suggest)}>建议</div>;
                                        case 3:
                                            return <div
                                                className={classNames(styles.fixedTypeContainer, styles.oppose)}>反对</div>;
                                        case 4:
                                            return <div
                                                className={classNames(styles.fixedTypeContainer, styles.ban)}>禁止</div>;
                                        default:
                                            break;
                                    }
                                }
                            }
                        }
                    }}
                />
                <Button onClick={() => {
                    console.log(this.state.fixedMap)
                }}>保存</Button>
            </div>
        );
    }

}
