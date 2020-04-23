import {
    httpAllList as httpSubjectAllList,
    httpDeleteBatch as httpSubjectDeleteBatch,
    httpSaveBatch as httpSubjectSaveBatch
} from "@/services/base_data/subject";
import {
    httpAllList as httpTeacherAllList,
    httpDeleteBatch as httpTeacherDeleteBatch,
    httpSaveBatch as httpTeacherSaveBatch
} from "@/services/base_data/teacher";
import {
    httpAllList as httpClassAllList,
    httpDeleteBatch as httpClassDeleteBatch,
    httpSaveBatch as httpClassSaveBatch
} from "@/services/base_data/class";
import {
    httpAllList as httpGradeAllList,
    httpDeleteBatch as httpGradeDeleteBatch,
    httpSaveBatch as httpGradeSaveBatch
} from "@/services/base_data/grade";
import {
    httpAllList as httpSpaceAllList,
    httpDeleteBatch as httpSpaceDeleteBatch,
    httpSave as httpSpaceSave
} from "@/services/base_data/space";
import {
    httpAllList as httpTeacherGroupAllList,
    httpDeleteBatch as httpTeacherGroupDeleteBatch,
    httpSave as httpTeacherGroupSave
} from "@/services/base_data/teacher_group";
import {
    httpAllList as httpSubjectGroupAllList,
    httpDeleteBatch as httpSubjectGroupDeleteBatch,
    httpSave as httpSubjectGroupSave
} from "@/services/base_data/subject_group";

export default {
    namespace: 'baseData',

    state: {
        subjectGroupAllList: [],
        subjectAllList: [],
        teacherGroupAllList: [],
        teacherAllList: [],
        gradeAllList: [],
        classAllList: [],
        spaceAllList: []
    },

    effects: {
        * subjectAllList({payload}, {put, call}) {
            const res = yield call(httpSubjectAllList, payload)
            yield put({
                type: 'subjectAllListSuccess',
                payload: res.data
            })
        },
        * subjectSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpSubjectSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * subjectDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpSubjectDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * subjectGroupAllList({payload}, {put, call}) {
            const res = yield call(httpSubjectGroupAllList, payload)
            yield put({
                type: 'subjectGroupAllListSuccess',
                payload: res.data
            })
        },
        * subjectGroupSave({payload, callback}, {call}) {
            const res = yield call(httpSubjectGroupSave, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * subjectGroupDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpSubjectGroupDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * teacherAllList({payload}, {put, call}) {
            const res = yield call(httpTeacherAllList, payload)
            yield put({
                type: 'teacherAllListSuccess',
                payload: res.data
            })
        },
        * teacherSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpTeacherSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * teacherDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpTeacherDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * teacherGroupAllList({payload}, {put, call}) {
            const res = yield call(httpTeacherGroupAllList, payload)
            yield put({
                type: 'teacherGroupAllListSuccess',
                payload: res.data
            })
        },
        * teacherGroupSave({payload, callback}, {call}) {
            const res = yield call(httpTeacherGroupSave, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * teacherGroupDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpTeacherGroupDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * gradeAllList({payload}, {put, call}) {
            const res = yield call(httpGradeAllList, payload)
            yield put({
                type: 'gradeAllListSuccess',
                payload: res.data
            })
        },
        * gradeSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpGradeSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * gradeDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpGradeDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * classAllList({payload}, {put, call}) {
            const res = yield call(httpClassAllList, payload)
            yield put({
                type: 'classAllListSuccess',
                payload: res.data
            })
        },
        * classSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpClassSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * classDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpClassDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * spaceAllList({payload}, {put, call}) {
            const res = yield call(httpSpaceAllList, payload)
            yield put({
                type: 'spaceAllListSuccess',
                payload: res.data
            })
        },
        * spaceSave({payload, callback}, {call}) {
            const res = yield call(httpSpaceSave, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * spaceDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpSpaceDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
    },

    reducers: {
        subjectGroupAllListSuccess(state, {payload}) {
            return {
                ...state,
                subjectGroupAllList: payload
            }
        },
        subjectAllListSuccess(state, {payload}) {
            return {
                ...state,
                subjectAllList: payload
            }
        },
        teacherGroupAllListSuccess(state, {payload}) {
            return {
                ...state,
                teacherGroupAllList: payload
            }
        },
        teacherAllListSuccess(state, {payload}) {
            return {
                ...state,
                teacherAllList: payload
            }
        },
        gradeAllListSuccess(state, {payload}) {
            return {
                ...state,
                gradeAllList: payload
            }
        },
        classAllListSuccess(state, {payload}) {
            return {
                ...state,
                classAllList: payload
            }
        },
        spaceAllListSuccess(state, {payload}) {
            return {
                ...state,
                spaceAllList: payload
            }
        }
    }
}
