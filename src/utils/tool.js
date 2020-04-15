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
