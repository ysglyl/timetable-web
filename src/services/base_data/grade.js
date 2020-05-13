import post from '@/utils/post'

/**
 *  全部列表
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpAllList(params) {
    return post('/timetable/grade/allList', params);
}

/**
 * 批量保存
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSaveBatch(params) {
    return post('/timetable/grade/saveBatch', params, true);
}

/**
 * 批量保存年级课务
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSubjectSaveBatch(params) {
    return post('/timetable/grade/subject/saveBatch', params, true);
}

/**
 * 批量删除
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpDeleteBatch(params) {
    return post('/timetable/grade/deleteBatch', params, true);
}
