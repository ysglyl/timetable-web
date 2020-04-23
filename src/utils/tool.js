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
        if (map.has(`${l.sectionIndex}_${l.dayIndex}`)) {
            const arr = map.get(`${l.sectionIndex}_${l.dayIndex}`);
            arr.push(l);
            map.set(`${l.sectionIndex}_${l.dayIndex}`, arr);
        } else {
            const arr = new Array();
            arr.push(l);
            map.set(`${l.sectionIndex}_${l.dayIndex}`, arr);
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

export function getTeacherSpecialCondition(type, condition) {
    switch (type) {
        case 1:
            return `每周最多上${condition}天`;
        case 2:
            return `每天最多上${condition}节`;
        case 3:
            return `每天上午最多上${condition}节`;
        case 4:
            return `每天下午最多上${condition}节`;
        case 5:
            const cs = condition.split("_");
            const sectionIndexes = cs[0].split(":");
            return `${sectionIndexes[0]}每周最多安排${cs[1]}次`
        case 6:
            return "不能同时上课";
    }
}

export function getSubjectSpecialCondition(type, condition) {
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
