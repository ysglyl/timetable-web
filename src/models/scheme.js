import {
    httpAllList as httpSchemeAllList,
    httpDeleteBatch as httpSchemeDeleteBatch,
    httpSave as httpSchemeSave,
    httpSchedule as httpSchemeSchedule
} from "@/services/scheme/scheme";
import {
    httpAllList as httpSettingAllList,
    httpDeleteBatch as httpSettingDeleteBatch,
    httpSave as httpSettingSave,
    httpSaveBatch as httpSettingSaveBatch
} from "@/services/scheme/setting";


export default {
    namespace: 'scheme',

    state: {
        schemeAllList: [],
        settingAllList: []
    },

    effects: {
        * schemeAllList({payload}, {put, call}) {
            const res = yield call(httpSchemeAllList, payload)
            yield put({
                type: 'schemeAllListSuccess',
                payload: res.data
            })
        },
        * schemeSave({payload, callback}, {call}) {
            const res = yield call(httpSchemeSave, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * schemeDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpSchemeDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * schemeSchedule({payload, callback}, {call}) {
            const res = yield call(httpSchemeSchedule, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * settingAllList({payload}, {put, call}) {
            const res = yield call(httpSettingAllList, payload)
            yield put({
                type: 'settingAllListSuccess',
                payload: res.data
            })
        },
        * settingSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpSettingSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * settingSave({payload, callback}, {call}) {
            const res = yield call(httpSettingSave, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * settingDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpSettingDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        }
    },

    reducers: {
        schemeAllListSuccess(state, {payload}) {
            return {
                ...state,
                schemeAllList: payload
            }
        },
        settingAllListSuccess(state, {payload}) {
            return {
                ...state,
                settingAllList: payload
            }
        }
    }
}
