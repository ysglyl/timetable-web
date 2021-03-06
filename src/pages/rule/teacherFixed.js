import React, {Fragment} from 'react';
import {Button, message, Modal, Select, Table, Tag} from "antd";

import TimeTable from '@/components/timetable';
import {fixedList2MapList, getSectionName, getWeekDayName} from "@/utils/tool";

import classNames from 'classnames';
import styles from './teacherFixed.less'
import {connect} from "dva";


class TeacherFixed extends React.PureComponent {

    state = {
        selectedScheme: null,
        teachersSelected: [],
        fixedList: [new Map(), new Map(), new Map(), new Map()],
        flagFixedType: 2,
        refreshPage: false
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'scheme/schemeAllList'
        });
        dispatch({
            type: 'baseData/teacherGroupAllList'
        });
        dispatch({
            type: 'baseData/teacherAllList'
        });
    }

    render() {
        const {scheme: {schemeAllList}, baseData: {teacherGroupAllList, teacherAllList}} = this.props;
        const {
            selectedScheme, flagFixedType, refreshPage
        } = this.state;
        return (
            <div>
                <Table
                    rowKey={'rowId'}
                    bordered
                    size={'small'}
                    pagination={false}
                    scroll={{y: 240}}
                    title={() => (
                        <Fragment>
                            <Select
                                style={{minWidth: 200}}
                                placeholder={"请选择排课方案"}
                                onChange={(value) => {
                                    const {dispatch} = this.props;
                                    dispatch({
                                        type: "rule/teacherFixedAllList",
                                        payload: {schemeId: value},
                                        callback: res => {
                                            if (res.code === 200) {
                                                const list = fixedList2MapList(res.data.map(d => ({
                                                    ...d,
                                                    rowId: d.teacher.rowId,
                                                    name: d.teacher.name
                                                })));
                                                this.setState({
                                                    fixedList: list,
                                                    selectedScheme: schemeAllList.find(d => d.rowId === value),
                                                    refreshPage: !refreshPage
                                                })
                                            }
                                        }
                                    })
                                }}
                                options={schemeAllList.map(s => ({
                                    value: s.rowId,
                                    label: s.name
                                }))} />
                            <Button style={{marginLeft: 8}} disabled={!selectedScheme} onClick={() => {
                                const {fixedList} = this.state;
                                const saveList = new Array();
                                fixedList.forEach((fixed, index) => {
                                    fixed.forEach((v, k) => {
                                        const indexes = k.split('_');
                                        v.forEach(teacher => {
                                            saveList.push({
                                                schemeId: selectedScheme.rowId,
                                                dayIndex: indexes[1] - 1,
                                                sectionIndex: indexes[0] - 1,
                                                teacherId: teacher.rowId,
                                                fixedType: index + 1
                                            })
                                        })
                                    })
                                });
                                const {dispatch} = this.props;
                                dispatch({
                                    type: 'rule/teacherFixedSaveBatch',
                                    payload: {
                                        schemeId: selectedScheme.rowId,
                                        list: saveList
                                    },
                                    callback: (res) => {
                                        if (res.code === 200) {
                                            message.success("保存成功");
                                        } else {
                                            message.error("保存失败");
                                        }
                                    }
                                });
                            }}>保存</Button>
                        </Fragment>
                    )}
                    childrenColumnName={'teachers'}
                    indentSize={25}
                    columns={[
                        {title: '教师/教师组名称', dataIndex: 'name'},
                        {title: '教师简称', dataIndex: 'shortName'}
                    ]}
                    dataSource={teacherGroupAllList.concat(teacherAllList.map(t => ({
                        ...t,
                        rowId: `${t.rowId}_`,
                        canSelect: true
                    })))}
                    rowSelection={{
                        type: 'radio',
                        onChange: (selectedRowKeys, selectedRows) => {
                            const rowId = selectedRowKeys[0];
                            if (rowId.endsWith("_")) {
                                this.setState({
                                    teachersSelected: selectedRows.map(r => ({...r, rowId: r.rowId.replace("_", "")}))
                                })
                            } else {
                                this.setState({
                                    teachersSelected: selectedRows[0].teachers
                                })
                            }
                        },
                        getCheckboxProps: record => ({
                            disabled: !(record.teachers || record.canSelect)
                        }),
                    }}
                />
                {selectedScheme &&
                <TimeTable
                    rows={selectedScheme.sectionsInMorning + selectedScheme.sectionsInForenoon + selectedScheme.sectionsInNoon + selectedScheme.sectionsInAfternoon + selectedScheme.sectionsInEvening + 1}
                    columns={selectedScheme.daysInWeek + 1}
                    dividers={[selectedScheme.sectionsInMorning, selectedScheme.sectionsInMorning + selectedScheme.sectionsInForenoon, selectedScheme.sectionsInMorning + selectedScheme.sectionsInForenoon + selectedScheme.sectionsInNoon, selectedScheme.sectionsInMorning + selectedScheme.sectionsInForenoon + selectedScheme.sectionsInNoon + selectedScheme.sectionsInAfternoon]}
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
                        if (rowIndex > 0 && columnIndex > 0) {
                            const {teachersSelected, flagFixedType, fixedList} = this.state;
                            if (teachersSelected.length === 0) {
                                return;
                            }
                            const fixedMap = fixedList[flagFixedType - 1];
                            let existList = fixedMap.get(`${rowIndex}_${columnIndex}`);
                            if (existList == null) {
                                existList = new Array();
                            }
                            existList.push(...teachersSelected.filter(teacher => {
                                if (existList.some(value => value.rowId === teacher.rowId)) {
                                    return false;
                                }
                                return true;
                            }));
                            fixedMap.set(`${rowIndex}_${columnIndex}`, existList);
                            fixedList[flagFixedType - 1] = fixedMap;
                            this.setState({
                                refreshPage: !refreshPage,
                            });
                        }
                    }}
                    renderTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex === 0 && columnIndex === 0) {
                            return <div className={classNames(styles.fixedTypeContainer, styles.ban)}>禁止</div>;
                        } else if (rowIndex > 0 && columnIndex === 0) {
                            return getSectionName(rowIndex - 1, selectedScheme.sectionsInMorning, selectedScheme.sectionsInForenoon, selectedScheme.sectionsInNoon, selectedScheme.sectionsInAfternoon, selectedScheme.sectionsInEvening);
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
                                                 const fixed = fixedList[flagFixedType - 1].get(`${rowIndex}_${columnIndex}`);
                                                 if (fixed != null) {
                                                     fixedList[flagFixedType - 1].set(`${rowIndex}_${columnIndex}`, fixed.filter(ff => ff.rowId !== f.rowId));
                                                 }
                                                 this.setState({
                                                     refreshPage: !refreshPage
                                                 });
                                             }}>{f.name}</Tag>
                                    )
                                } else {
                                    return (
                                        <Tag key={`tag_${rowIndex}_${columnIndex}_0`}
                                             color={["green", 'lime', 'gold', 'red'][flagFixedType - 1]}
                                             onClick={() => {
                                                 const $this = this;
                                                 Modal.info({
                                                     title: `${getWeekDayName(columnIndex - 1)}${getSectionName(rowIndex - 1, selectedScheme.sectionsInMorning, selectedScheme.sectionsInForenoon, selectedScheme.sectionsInNoon, selectedScheme.sectionsInAfternoon, selectedScheme.sectionsInEvening)}`,
                                                     okText: "确定",
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
                                                                          }}>{f.name}</Tag>
                                                                 ))
                                                             }
                                                         </Fragment>
                                                     )
                                                 })
                                             }}>{`共${fixed.length}位教师`}</Tag>
                                    )
                                }
                            }
                        }
                    }}
                />}
            </div>
        );
    }

}

export default connect(({scheme, rule, baseData}) => ({scheme, rule, baseData}))(TeacherFixed)
