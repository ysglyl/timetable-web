import React, {Fragment} from 'react';
import {Card} from "antd";
import {getWeekDayName} from "@/utils/tool";

export default class TimeTable extends React.PureComponent {

    clickTableItem = (rowIndex, columnIndex) => {
        const {clickTableItem} = this.props;
        if (clickTableItem) {
            clickTableItem(rowIndex, columnIndex);
        }
    };

    hoverableTableItem = (rowIndex, columnIndex) => {
        const {hoverableTableItem} = this.props;
        if (hoverableTableItem) {
            return hoverableTableItem(rowIndex, columnIndex);
        }
        return false;
    };

    renderTableItem = (rowIndex, columnIndex) => {
        const {renderTableItem} = this.props;
        if (renderTableItem) {
            const node = renderTableItem(rowIndex, columnIndex);
            if (node) {
                return node;
            }
        }
        if (rowIndex === 0) {
            if (columnIndex > 0) {
                return getWeekDayName(columnIndex - 1);
            }
            return '';
        }
        if (columnIndex === 0 && rowIndex > 0) {
            return `第${rowIndex}节`;
        }
        return '-';
    };

    render() {
        const {rows, columns, dividers} = this.props;
        const gridStyle = {width: `${100 / columns}%`, height: 40, lineHeight: '36px', padding: 2, cursor: 'pointer'};
        const gridDividerStyle = {width: '100%', height: 20, padding: 0};
        return (
            <div style={{marginTop: 8}}>
                <Card className={'ant-card-contain-grid'}>
                    {new Array(rows).fill(0).map((_, row) => (
                        <Fragment key={`fragment_${row}`}>
                            {
                                new Array(columns).fill(0).map((_, column) => (
                                        <Card.Grid key={`item_${row}_${column}`}
                                                   hoverable={this.hoverableTableItem(row, column)}
                                                   style={{...gridStyle, textAlign: 'center'}}>
                                            <div style={{width: '100%', height: '100%'}}
                                                 onClick={() => this.clickTableItem(row, column)}>
                                                {this.renderTableItem(row, column)}
                                            </div>
                                        </Card.Grid>
                                    )
                                )
                            }
                            {dividers.includes(row) && (row !== 0) && (row !== rows - 1) &&
                            <Card.Grid key={`divider_${row}`} hoverable={false}
                                       style={gridDividerStyle} />}
                        </Fragment>)
                    )}
                </Card>
            </div>
        );
    }

}
