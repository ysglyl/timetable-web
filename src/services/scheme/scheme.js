import post from '@/utils/post'

/**
 *  全部列表
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpAllList(params) {
    return post('/timetable/scheme/allList', params);
}

/**
 * 保存
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSave(params) {
    return post('/timetable/scheme/save', params, true);
}

/**
 * 批量删除
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpDeleteBatch(params) {
    return post('/timetable/scheme/deleteBatch', params, true);
}

/**
 * 开始排课
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSchedule(params) {
    return post('/timetable/scheme/schedule', params, true);
}

/**
 * 方案班级保存
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpClassSave(params) {
    return post('/timetable/scheme/class/save', params, true);
}
