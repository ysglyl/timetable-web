import post from '@/utils/post'

/**
 *  全部列表
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpAllList(params) {
    return post('/timetable/subject/group/allList', params);
}

/**
 * 保存
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSave(params) {
    return post('/timetable/subject/group/save', params, true);
}

/**
 * 批量删除
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpDeleteBatch(params) {
    return post('/timetable/subject/group/deleteBatch', params, true);
}
