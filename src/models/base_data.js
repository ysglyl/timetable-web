import {
    httpAllList as httpSubjectAllList,
    httpDeleteBatch as httpSubjectDeleteBatch,
    httpSave as httpSubjectSave
} from "../services/base_data/subject";


export default {
    namespace: 'baseData',

    state: {
        subjectAllList: []
    },

    effects: {
        * subjectAllList({payload}, {put,call}) {
            const res = yield call(httpSubjectAllList, payload)
            yield put({
                type: 'subjectAllListSuccess',
                payload: res.data
            })
        },
        * subjectSave({payload, callback}, {call}) {
            const res = yield call(httpSubjectSave, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * subjectDeleteBatch({payload, callback}, {call}) {
            const rest = yield call(httpSubjectDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
    },

    reducers: {
        subjectAllListSuccess(state, {payload}) {
            return {
                ...state,
                subjectAllList: payload
            }
        }
    }
}
