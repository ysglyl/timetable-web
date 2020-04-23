import post from '@/utils/post'

/**
 *  全部列表
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpAllList(params) {
    return post('/timetable/teacher/allList', params);
}

/**
 * 批量保存
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSaveBatch(params) {
    return post('/timetable/teacher/saveBatch', params, true);
}

/**
 * 批量删除
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpDeleteBatch(params) {
    return post('/timetable/teacher/deleteBatch', params, true);
}
