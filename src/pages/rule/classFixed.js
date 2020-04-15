import React, {Fragment} from 'react';
import {Button, Modal, Table, Tag} from "antd";

import TimeTable from '@/components/timetable';
import {getSectionName, getWeekDayName} from "@/utils/tool";

import classNames from 'classnames';
import styles from './classFixed.less'


export default class ClassFixed extends React.PureComponent {

    state = {
        daysInWeek: 5,
        sectionsInMorning: 1,
        sectionsInForenoon: 4,
        sectionsInNoon: 0,
        sectionsInAfternoon: 3,
        sectionsInEvening: 2,
        subjectAllList: [
            {rowId: '1', subject: '语文', sectionCount: 5, alternative: 0, continuous: 0},
            {rowId: '11', subject: '语文', sectionCount: 1, alternative: 0, continuous: 1},
            {rowId: "2", subject: '数学', sectionCount: 5, alternative: 0, continuous: 0},
            {rowId: "3", subject: '外语', sectionCount: 5, alternative: 0, continuous: 0},
            {rowId: "4", subject: '物理', sectionCount: 2, alternative: 0, continuous: 0},
            {rowId: "5", subject: '化学', sectionCount: 2, alternative: 0, continuous: 0},
            {rowId: "6", subject: '生物', sectionCount: 2, alternative: 0, continuous: 0},
            {rowId: "7", subject: '历史', sectionCount: 2, alternative: 0, continuous: 0},
            {rowId: "8", subject: '政治', sectionCount: 2, alternative: 0, continuous: 0},
        ],
        subjectSelected: null,
        fixedList: [new Map(), new Map(), new Map(), new Map()],
        flagFixedType: 1,
        refreshPage: false
    }

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
                        {title: "科目", dataIndex: "subject"},
                        {title: "教师", dataIndex: "teacher"},
                        {title: "是否连堂", dataIndex: "continuous"},
                        {title: "单双周", dataIndex: "alternative"},
                        {title: "节数", dataIndex: "sectionCount"},
                        {title: "场地", dataIndex: "space"}
                    ]}
                    dataSource={subjectAllList}
                    rowSelection={{
                        type: 'radio',
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({
                                subjectSelected: selectedRows[0]
                            })
                        },
                    }}
                />
                <TimeTable
                    rows={sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon + sectionsInEvening + 1}
                    columns={daysInWeek + 1}
                    dividers={[sectionsInMorning, sectionsInMorning + sectionsInForenoon, sectionsInMorning + sectionsInForenoon + sectionsInNoon, sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon]}
                    hoverableTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex === 0 && columnIndex === 0) {
                            return true;
                        }
                        if (rowIndex > 0 && columnIndex > 0) {
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
                            const {subjectSelected, flagFixedType, fixedList} = this.state;
                            if (subjectSelected === null) {
                                return;
                            }
                            const fixedMap = fixedList[flagFixedType - 1];
                            let existList = fixedMap.get(`${rowIndex}_${columnIndex}`);
                            if (existList == null) {
                                existList = new Array();
                            }
                            if (existList.some(value => value.rowId === subjectSelected.rowId)) {
                                return;
                            }
                            existList.push({...subjectSelected});
                            fixedMap.set(`${rowIndex}_${columnIndex}`, existList);
                            fixedList[flagFixedType - 1] = fixedMap;
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
                            const {fixedList} = this.state;
                            const fixed = fixedList[flagFixedType - 1].get(`${rowIndex}_${columnIndex}`);
                            if (fixed != null && fixed.length > 0) {
                                if (fixed.length === 1) {
                                    const f = fixed[0];
                                    return (
                                        <Tag key={`tag_${rowIndex}_${columnIndex}_${f.rowId}`}
                                             color={["green", 'lime', 'gold', 'red'][flagFixedType - 1]} closable
                                             onClose={() => {
                                                 this.setState({
                                                     refreshPage: !refreshPage
                                                 });
                                             }}>{f.subject}</Tag>
                                    )
                                } else {
                                    return (
                                        <Tag key={`tag_${rowIndex}_${columnIndex}_0`}
                                             color={["green", 'lime', 'gold', 'red'][flagFixedType - 1]}
                                             onClick={() => {
                                                 const $this = this;
                                                 Modal.info({
                                                     title: `${getWeekDayName(columnIndex - 1)}${getSectionName(rowIndex - 1, sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening)}`,
                                                     content: (
                                                         <Fragment>
                                                             {
                                                                 fixed.map(f => (
                                                                     <Tag key={`modal_tag_${f.rowId}`}
                                                                          color={["green", 'lime', 'gold', 'red'][flagFixedType - 1]}
                                                                          closable
                                                                          onClose={() => {
                                                                              const {fixedList} = $this.state;
                                                                              const fixed = fixedList[flagFixedType - 1].get(`${rowIndex}_${columnIndex}`);
                                                                              if (fixed != null) {
                                                                                  fixedList[flagFixedType - 1].set(`${rowIndex}_${columnIndex}`, fixed.filter(ff => ff.rowId !== f.rowId));
                                                                              }
                                                                              $this.setState({
                                                                                  refreshPage: !$this.state.refreshPage,
                                                                              });
                                                                          }}>{f.subject}</Tag>
                                                                 ))
                                                             }
                                                         </Fragment>
                                                     )
                                                 })
                                             }}>{`共${fixed.length}科目`}</Tag>
                                    )
                                }
                            }
                        }
                    }}
                />
                <Button onClick={() => {
                    console.log(this.state.fixedList)
                }}>保存</Button>
            </div>
        );
    }

}
