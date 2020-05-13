import React, {Fragment} from 'react';
import {connect} from "dva";
import {Button, Card, message, Select} from "antd";
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import TimeTable from "@/components/timetable";
import {getSectionName} from "@/utils/tool";

class Section extends React.PureComponent {

    state = {
        selectedScheme: null,
        sectionsDisabled: [],
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
        const {selectedScheme, sectionsDisabled, refreshPage} = this.state;
        return (
            <div>
                <Card size={"small"} title={<Fragment>
                    <Select
                        style={{minWidth: 200}}
                        placeholder={"请选择排课方案"}
                        onChange={(value) => {
                            const {dispatch} = this.props;
                            dispatch({
                                type: "rule/sectionDisabledAllList",
                                payload: {schemeId: value},
                                callback: res => {
                                    if (res.code === 200) {
                                        this.setState({
                                            sectionsDisabled: res.data.map(d => `${d.sectionIndex + 1}_${d.dayIndex + 1}`),
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
                    <Button style={{marginLeft: 8}}
                            disabled={!this.state.selectedScheme || this.state.sectionsDisabled.length === 0}
                            onClick={() => {
                                const {dispatch} = this.props;
                                dispatch({
                                    type: "rule/sectionDisabledSaveBatch",
                                    payload: {
                                        schemeId: selectedScheme.rowId,
                                        list: sectionsDisabled.map(d => {
                                            const dd = d.split("_")
                                            return ({
                                                dayIndex: dd[1] - 1,
                                                sectionIndex: dd[0] - 1
                                            })
                                        })
                                    },
                                    callback: res => {
                                        if (res.code === 200) {
                                            message.success("保存成功");
                                        } else {
                                            message.error("保存失败");
                                        }
                                    }
                                })
                            }}>保存</Button>
                </Fragment>}>
                    {selectedScheme &&
                    <TimeTable
                        rows={selectedScheme.sectionsInMorning + selectedScheme.sectionsInForenoon + selectedScheme.sectionsInNoon + selectedScheme.sectionsInAfternoon + selectedScheme.sectionsInEvening + 1}
                        columns={selectedScheme.daysInWeek + 1}
                        dividers={[selectedScheme.sectionsInMorning, selectedScheme.sectionsInMorning + selectedScheme.sectionsInForenoon, selectedScheme.sectionsInMorning + selectedScheme.sectionsInForenoon + selectedScheme.sectionsInNoon, selectedScheme.sectionsInMorning + selectedScheme.sectionsInForenoon + selectedScheme.sectionsInNoon + selectedScheme.sectionsInAfternoon]}
                        hoverableTableItem={(rowIndex, columnIndex) => {
                            if (rowIndex > 0) {
                                return true;
                            }
                            return false;
                        }}
                        clickTableItem={(rowIndex, columnIndex) => {
                            if (rowIndex > 0 && columnIndex === 0) {
                                if (sectionsDisabled.filter(d => d.startsWith(`${rowIndex}_`)).length === selectedScheme.daysInWeek) {
                                    this.setState({
                                        sectionsDisabled: sectionsDisabled.filter(d => !d.startsWith(`${rowIndex}_`)),
                                        refreshPage: !refreshPage
                                    })
                                } else {
                                    const sectionsDisabledSet = sectionsDisabled.filter(d => !d.startsWith(`${rowIndex}_`));
                                    for (let i = 0; i < selectedScheme.daysInWeek; i++) {
                                        sectionsDisabledSet.push(`${rowIndex}_${i + 1}`);
                                    }
                                    this.setState({
                                        sectionsDisabled: sectionsDisabledSet,
                                        refreshPage: !refreshPage
                                    })
                                }
                            } else if (rowIndex > 0 && columnIndex > 0) {
                                if (sectionsDisabled.includes(`${rowIndex}_${columnIndex}`)) {
                                    this.setState({
                                        sectionsDisabled: sectionsDisabled.filter(i => i !== `${rowIndex}_${columnIndex}`),
                                        refreshPage: !refreshPage
                                    })
                                } else {
                                    const sectionsDisabledSet = sectionsDisabled.filter(d => d !== `${rowIndex}_${columnIndex}`);
                                    sectionsDisabledSet.push(`${rowIndex}_${columnIndex}`);
                                    this.setState({
                                        sectionsDisabled: sectionsDisabledSet,
                                        refreshPage: !refreshPage
                                    })
                                }
                            }
                        }}
                        renderTableItem={(rowIndex, columnIndex) => {
                            if (rowIndex > 0 && columnIndex === 0) {
                                return (
                                    <Fragment>
                                        {getSectionName(rowIndex - 1, selectedScheme.sectionsInMorning, selectedScheme.sectionsInForenoon, selectedScheme.sectionsInNoon, selectedScheme.sectionsInAfternoon, selectedScheme.sectionsInEvening)}
                                        {sectionsDisabled.filter(d => d.startsWith(`${rowIndex}_`)).length === selectedScheme.daysInWeek ? (
                                            <CheckOutlined key={`item_${rowIndex}_${columnIndex}_check`}
                                                           style={{color: 'green'}} />) : (
                                            <CloseOutlined key={`item_${rowIndex}_${columnIndex}_close`}
                                                           style={{color: 'red'}} />)
                                        }
                                    </Fragment>
                                );
                            } else if (rowIndex > 0 && columnIndex > 0) {
                                return sectionsDisabled.includes(`${rowIndex}_${columnIndex}`) ? (
                                    <CloseOutlined key={`item_${rowIndex}_${columnIndex}_close`}
                                                   style={{color: "red"}} />
                                ) : (
                                    <CheckOutlined key={`item_${rowIndex}_${columnIndex}_check`}
                                                   style={{color: 'green'}} />
                                )
                            }
                        }}
                    />}
                </Card>
            </div>
        );
    }

}

export default connect(({scheme, rule}) => ({scheme, rule}))(Section)
