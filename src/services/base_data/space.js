import post from '@/utils/post'

/**
 *  全部列表
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpAllList(params) {
    return post('/timetable/space/allList', params);
}

/**
 * 保存
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSave(params) {
    return post('/timetable/space/save', params, true);
}

/**
 * 批量删除
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpDeleteBatch(params) {
    return post('/timetable/space/deleteBatch', params, true);
}

/**
 * 生成班级独占的教室
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSaveParticular(params) {
    return post('/timetable/space/saveParticular', params, true);
}
