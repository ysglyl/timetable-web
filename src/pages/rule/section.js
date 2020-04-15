import React, {Fragment} from 'react';
import {Button} from "antd";
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import TimeTable from "@/components/timetable";
import {getSectionName} from "@/utils/tool";

export default class Section extends React.PureComponent {

    state = {
        daysInWeek: 5,
        sectionsInMorning: 3,
        sectionsInForenoon: 4,
        sectionsInNoon: 0,
        sectionsInAfternoon: 3,
        sectionsInEvening: 2,
        sectionsDisabled: [],
        refreshPage: false
    }

    render() {
        const {daysInWeek, sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening, sectionsDisabled, refreshPage} = this.state;
        return (
            <div>
                <TimeTable
                    rows={sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon + sectionsInEvening + 1}
                    columns={daysInWeek + 1}
                    dividers={[sectionsInMorning, sectionsInMorning + sectionsInForenoon, sectionsInMorning + sectionsInForenoon + sectionsInNoon, sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon]}
                    hoverableTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex > 0) {
                            return true;
                        }
                        return false;
                    }}
                    clickTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex > 0 && columnIndex === 0) {
                            for (let i = 0; i < daysInWeek; i++) {
                                sectionsDisabled.push(`${rowIndex}_${i + 1}`);
                            }
                            this.setState({
                                refreshPage: !refreshPage
                            })
                        } else if (rowIndex > 0 && columnIndex > 0) {
                            if (sectionsDisabled.includes(`${rowIndex}_${columnIndex}`)) {
                                this.setState({
                                    sectionsDisabled: sectionsDisabled.filter(i => i !== `${rowIndex}_${columnIndex}`),
                                    refreshPage: !refreshPage
                                })
                            } else {
                                sectionsDisabled.push(`${rowIndex}_${columnIndex}`);
                                this.setState({
                                    refreshPage: !refreshPage
                                })
                            }
                        }
                    }}
                    renderTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex > 0 && columnIndex === 0) {
                            return (
                                <Fragment>
                                    {getSectionName(rowIndex - 1, sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening)}
                                    <CloseOutlined key={`item_${rowIndex}_${columnIndex}_close`}
                                                   style={{color: 'red'}} />
                                </Fragment>
                            );
                        } else if (rowIndex > 0 && columnIndex > 0) {
                            return sectionsDisabled.includes(`${rowIndex}_${columnIndex}`) ? (
                                <CloseOutlined key={`item_${rowIndex}_${columnIndex}_close`} style={{color: "red"}} />
                            ) : (
                                <CheckOutlined key={`item_${rowIndex}_${columnIndex}_check`} style={{color: 'green'}} />
                            )
                        }
                    }}
                />
                <Button onClick={() => {
                    console.log(sectionsDisabled)
                }}>保存</Button>
            </div>
        );
    }

}
