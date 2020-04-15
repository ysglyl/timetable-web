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
        spaceAllList: [
            {rowId: '1', name: '物理实验室'},
            {rowId: '2', name: '化学实验室'},
            {rowId: '3', name: '生物实验室'},
            {rowId: '4', name: '音乐教室'},
            {rowId: '5', name: '计算机房'},
            {rowId: '6', name: '操场'}
        ],
        spaceSelected: null,
        fixedMap: {},
        flagFixedType: 1,
        refreshPage: false
    };

    render() {
        const {
            daysInWeek, sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening,
            spaceAllList, flagFixedType, refreshPage
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
                        {title: "场地", dataIndex: "name"},
                    ]}
                    dataSource={spaceAllList}
                    defaultExpandAllRows
                    rowSelection={{
                        type: 'radio',
                        onChange: (selectedRowKeys, selectedRows) => {
                            const {fixedMap} = this.state;
                            if (fixedMap.get(selectedRows[0].rowId) == null) {
                                fixedMap.set(selectedRows[0].rowId, new Array(4).fill(null).map(s => new Set()));
                            }
                            this.setState({
                                spaceSelected: selectedRows[0]
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
                            const {spaceSelected, flagFixedType, fixedMap} = this.state;
                            if (spaceSelected === null) {
                                return;
                            }
                            const fixedList = fixedMap.get(spaceSelected.rowId);
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
                            const {fixedMap, spaceSelected} = this.state;
                            if (spaceSelected == null) {
                                return null;
                            }
                            const fixedList = fixedMap.get(spaceSelected.rowId);
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
