import post from '../../utils/post'

/**
 *  全部列表
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpAllList(params) {
  return post('/timetable/subject/allList', params);
}

/**
 *  分页列表
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpPageList(params) {
  return post('/timetable/subject/pageList', params);
}

/**
 * 保存
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpSave(params) {
  return post('/timetable/subject/save', params);
}

/**
 * 删除
 * @param params
 * @returns {Promise<any|never>}
 */
export async function httpDeleteBatch(params) {
  return post('/timetable/subject/deleteBatch', params);
}
