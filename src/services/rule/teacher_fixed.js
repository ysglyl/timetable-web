import post from '@/utils/post'

/**
 *  全部列表
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpAllList(params) {
    return post('/timetable/teacher/fixed/allList', params);
}

/**
 * 批量保存
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSaveBatch(params) {
    return post('/timetable/teacher/fixed/saveBatch', params, true);
}

