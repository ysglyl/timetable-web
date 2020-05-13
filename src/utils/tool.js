import React, {Fragment} from 'react';
import {Tag} from "antd";

export function getWeekDayName(dayIndex) {
    const weekNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    return weekNames[dayIndex]
}

export function getSectionName(sectionIndex, sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening) {
    let name = '';
    if (sectionIndex < sectionsInMorning) {
        name = `早读${sectionsInMorning === 1 ? "" : `第${sectionIndex + 1}节`}`;
    } else if (sectionIndex < sectionsInMorning + sectionsInForenoon) {
        name = `上午${sectionsInForenoon === 1 ? "" : `第${sectionIndex - sectionsInMorning + 1}节`}`;
    } else if (sectionIndex < sectionsInMorning + sectionsInForenoon + sectionsInNoon) {
        name = `中午${sectionsInNoon === 1 ? "" : `第${sectionIndex - (sectionsInMorning + sectionsInForenoon) + 1}节`}`;
    } else if (sectionIndex < sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon) {
        name = `下午${sectionsInAfternoon === 1 ? "" : `第${sectionIndex - (sectionsInMorning + sectionsInForenoon + sectionsInNoon) + 1}节`}`;
    } else if (sectionIndex < sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon + sectionsInEvening) {
        name = `晚自习${sectionsInEvening === 1 ? "" : `第${sectionIndex - (sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon) + 1}节`}`;
    } else {
        name = `第${sectionIndex}节`
    }
    return name;
}

export function getSectionNameList(sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening) {
    const total = sectionsInMorning + sectionsInForenoon + sectionsInNoon + sectionsInAfternoon + sectionsInEvening;
    const names = [];
    for (let i = 0; i < total; i++) {
        names.push({
            value: i,
            label: getSectionName(i, sectionsInMorning, sectionsInForenoon, sectionsInNoon, sectionsInAfternoon, sectionsInEvening)
        })
    }
    return names;
}

export function fixedList2Map(list) {
    const map = new Map();
    list.forEach(l => {
        if (map.has(`${l.sectionIndex + 1}_${l.dayIndex + 1}`)) {
            const arr = map.get(`${l.sectionIndex + 1}_${l.dayIndex + 1}`);
            arr.push(l);
            map.set(`${l.sectionIndex + 1}_${l.dayIndex + 1}`, arr);
        } else {
            const arr = new Array();
            arr.push(l);
            map.set(`${l.sectionIndex + 1}_${l.dayIndex + 1}`, arr);
        }
    })
    return map;
}

export function fixedList2MapList(list) {
    return [
        fixedList2Map(list.filter(d => d.fixedType === 1)),
        fixedList2Map(list.filter(d => d.fixedType === 2)),
        fixedList2Map(list.filter(d => d.fixedType === 3)),
        fixedList2Map(list.filter(d => d.fixedType === 4))
    ]
}

export function getTeacherSpecialDemand(type, demand) {
    switch (type) {
        case 1:
            return `每周最多上${demand}天`;
        case 2:
            return `每天最多上${demand}节`;
        case 3:
            return `每天上午最多上${demand}节`;
        case 4:
            return `每天下午最多上${demand}节`;
        case 5:
            const cs = demand.split("_");
            const sectionIndexes = cs[0].split(":");
            return `${sectionIndexes[0]}每周最多安排${cs[1]}次`
        case 6:
            return "不能同时上课";
    }
}

export function getSubjectSpecialDemand(type, demand) {
    switch (type) {
        case 1:
            return "不能同一天上课";
        case 2:
            return "不能同一天上午上课";
        case 3:
            return "不能同一天下午上课";
        case 4:
            return "不能相邻上课";
    }
}

export function initTimetableColumn(scheme) {
    const columns = [];
    for (let day = 0; day < scheme.daysInWeek; day++) {
        const sections = [];
        if (scheme.sectionsInMorning > 0) {
            const ms = [];
            for (let m = 0; m < scheme.sectionsInMorning; m++) {
                ms.push({
                    title: `第${m + 1}节`,
                    width: 100,
                    align: 'center',
                    dataIndex: `${day}_${m}`
                })
            }
            sections.push({
                title: '早读', children: ms
            })
        }
        if (scheme.sectionsInForenoon > 0) {
            const fs = [];
            for (let f = 0; f < scheme.sectionsInForenoon; f++) {
                fs.push({
                    title: `第${f + 1}节`,
                    width: 100,
                    align: 'center',
                    dataIndex: `${day}_${f + scheme.sectionsInMorning}`
                })
            }
            sections.push({
                title: '上午', children: fs
            })
        }
        if (scheme.sectionsInNoon > 0) {
            const ns = [];
            for (let n = 0; n < scheme.sectionsInNoon; n++) {
                ns.push({
                    title: `第${n + 1}节`,
                    width: 100,
                    align: 'center',
                    dataIndex: `${day}_${n + scheme.sectionsInMorning + scheme.sectionsInForenoon}`
                })
            }
            sections.push({
                title: '中午', children: ns
            })
        }
        if (scheme.sectionsInAfternoon > 0) {
            const as = [];
            for (let a = 0; a < scheme.sectionsInAfternoon; a++) {
                as.push({
                    title: `第${a + 1}节`,
                    width: 100,
                    align: 'center',
                    dataIndex: `${day}_${a + scheme.sectionsInMorning + scheme.sectionsInForenoon + scheme.sectionsInNoon}`
                })
            }
            sections.push({
                title: '下午', children: as
            })
        }
        if (scheme.sectionsInEvening > 0) {
            const es = [];
            for (let e = 0; e < scheme.sectionsInEvening; e++) {
                es.push({
                    title: `第${a + 1}节`,
                    width: 100,
                    align: 'center',
                    dataIndex: `${day}_${e + scheme.sectionsInMorning + scheme.sectionsInForenoon + scheme.sectionsInNoon + scheme.sectionsInAfternoon}`
                })
            }
            sections.push({
                title: '晚上', children: es
            })
        }
        columns.push({
            title: getWeekDayName(day),
            children: sections
        })
    }
    return columns;
}

export function initWeekColumn(scheme) {
    const columns = [];
    for (let day = 0; day < scheme.daysInWeek; day++) {
        columns.push({
            title: getWeekDayName(day),
            align: 'center',
            width: 200,
            dataIndex: `d_${day}`
        })
    }
    return columns;
}

export function formatClassTimetableData(list) {
    const classMap = {}
    list.forEach(item => {
        if(!item.empty) {
            let rows = classMap[item.classModel.name];
            if (rows == null) {
                rows = []
                classMap[item.classModel.name] = rows;
            }
            let data = rows.find(r => r.rowId === item.sectionIndex);
            if (data == null) {
                data = {
                    rowId: item.sectionIndex,
                    sectionName: `第${item.sectionIndex + 1}节`
                };
                rows.push(data);
            }
            data[`d_${item.dayIndex}`] = (<Fragment>
                <Tag color={"green"}>{item.subject.name}</Tag>
                {item.teacher && <Tag color={"blue"}>{item.teacher.name}</Tag>}
            </Fragment>)
        }
    });
    return classMap;
}

export function formatSchoolTimetableData(list) {
    const classMap = {}
    list.forEach(item => {
        if(!item.empty) {
            let data = classMap[item.classId];
            if (data == null) {
                data = {rowId: item.classId};
                classMap[item.classId] = data;
            }
            data.className = `${item.classModel.name}`;
            data[`${item.dayIndex}_${item.sectionIndex}`] = (<Fragment>
                <Tag color={"green"}>{item.subject.name}</Tag>
                {item.teacher && <Tag color={"blue"}>{item.teacher.name}</Tag>}
            </Fragment>)
        }
    });
    return Object.values(classMap);
}

export function formatTeacherTimetableData(list) {
    const teacherMap = {}
    list.forEach(item => {
        if(!item.empty) {
            if (item.teacherId) {
                let data = teacherMap[item.teacherId];
                if (data == null) {
                    data = {rowId: item.teacherId};
                    teacherMap[item.teacherId] = data;
                }
                data.teacherName = item.teacher.name;
                data[`${item.dayIndex}_${item.sectionIndex}`] =
                    <Tag color={"green"}>{item.classModel.name}</Tag>
            }
        }
    });
    return Object.values(teacherMap);
}

export function formatSpaceTimetableData(list) {
    const spaceMap = {}
    list.forEach(item => {
        if(!item.empty) {
            if (item.spaceId) {
                let data = spaceMap[item.spaceId];
                if (data == null) {
                    data = {rowId: item.spaceId};
                    spaceMap[item.spaceId] = data;
                }
                data.spaceName = item.space.name;
                data[`${item.dayIndex}_${item.sectionIndex}`] =
                    <Tag color={"green"}>{item.classModel.name}</Tag>
            }
        }
    });
    return Object.values(spaceMap);
}
