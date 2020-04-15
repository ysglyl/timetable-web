import React, {Fragment} from 'react';
import {Button} from "antd";
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import TimeTable from "@/components/timetable";
import {getSectionName} from "@/utils/tool";


export default class Continuous extends React.PureComponent {

    state = {
        daysInWeek: 5,
        sectionsInMorning: 1,
        sectionsInForenoon: 4,
        sectionsInNoon: 0,
        sectionsInAfternoon: 3,
        sectionsInEvening: 2,
        sectionsContinuous: [],
        refreshPage: false
    }

    render() {
        const {daysInWeek, sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening, sectionsContinuous, refreshPage} = this.state;
        return (
            <div>
                <TimeTable
                    rows={sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon + sectionsInEvening + 1}
                    columns={daysInWeek + 1}
                    dividers={[sectionsInMorning, sectionsInMorning + sectionsInForenoon, sectionsInMorning + sectionsInForenoon + sectionsInNoon, sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon]}
                    hoverableTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex > 0 && columnIndex === 0) {
                            return true;
                        }
                        return false;
                    }}
                    clickTableItem={(rowIndex, columnIndex) => {
                        if (rowIndex > 0 && columnIndex === 0) {
                            if (sectionsContinuous.includes(`${rowIndex}`)) {
                                this.setState({
                                    sectionsContinuous: sectionsContinuous.filter(i => i !== `${rowIndex}`),
                                    refreshPage: !refreshPage
                                })
                            } else {
                                sectionsContinuous.push(`${rowIndex}`);
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
                                    {sectionsContinuous.includes(`${rowIndex}`) ? (
                                        <CloseOutlined key={`item_${rowIndex}_${columnIndex}_close`}
                                                       style={{color: 'red'}} />
                                    ) : (
                                        <CheckOutlined key={`item_${rowIndex}_${columnIndex}_check`}
                                                       style={{color: 'green'}} />
                                    )}
                                </Fragment>
                            );
                        } else if (rowIndex > 0 && columnIndex > 0) {
                            return sectionsContinuous.includes(`${rowIndex}`) ? (
                                <CheckOutlined key={`item_${rowIndex}_${columnIndex}_check`}
                                               style={{color: 'green'}} />
                            ) : (
                                <CloseOutlined key={`item_${rowIndex}_${columnIndex}_close`}
                                               style={{color: "red"}} />
                            )
                        }
                    }}
                />
                <Button onClick={() => {
                    console.log(sectionsContinuous)
                }}>保存</Button>
            </div>
        );
    }

}
