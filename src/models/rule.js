import {
    httpAllList as httpSectionDisabledAllList,
    httpSaveBatch as httpSectionDisabledSaveBatch
} from "@/services/rule/section_disabled";
import {
    httpAllList as httpSectionContinuousAllList,
    httpSaveBatch as httpSectionContinuousSaveBatch
} from "@/services/rule/section_continuous";
import {
    httpAllList as httpClassFixedAllList,
    httpSaveBatch as httpClassFixedSaveBatch
} from "@/services/rule/class_fixed";
import {
    httpAllList as httpTeacherFixedAllList,
    httpSaveBatch as httpTeacherFixedSaveBatch
} from "@/services/rule/teacher_fixed";
import {
    httpAllList as httpSubjectFixedAllList,
    httpSaveBatch as httpSubjectFixedSaveBatch
} from "@/services/rule/subject_fixed";
import {
    httpAllList as httpSpaceFixedAllList,
    httpSaveBatch as httpSpaceFixedSaveBatch
} from "@/services/rule/space_fixed";
import {
    httpAllList as httpTeacherSpecialAllList,
    httpDeleteBatch as httpTeacherSpecialDeleteBatch,
    httpSaveBatch as httpTeacherSpecialSaveBatch
} from "@/services/rule/teacher_special";
import {
    httpAllList as httpSubjectSpecialAllList,
    httpDeleteBatch as httpSubjectSpecialDeleteBatch,
    httpSaveBatch as httpSubjectSpecialSaveBatch
} from "@/services/rule/subject_special";

export default {
    namespace: 'rule',

    state: {
        sectionDisabledAllList: [],
        sectionContinuousAllList: [],
        classFixedAllList: [],
        teacherFixedAllList: [],
        subjectFixedAllList: [],
        teacherSpecialAllList:[],
        subjectSpecialAllList:[]
    },

    effects: {
        * sectionDisabledAllList({payload, callback}, {call}) {
            const res = yield call(httpSectionDisabledAllList, payload)
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * sectionDisabledSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpSectionDisabledSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * sectionContinuousAllList({payload, callback}, {call}) {
            const res = yield call(httpSectionContinuousAllList, payload)
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * sectionContinuousSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpSectionContinuousSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * classFixedAllList({payload, callback}, {call}) {
            const res = yield call(httpClassFixedAllList, payload)
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * classFixedSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpClassFixedSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * teacherFixedAllList({payload, callback}, {call}) {
            const res = yield call(httpTeacherFixedAllList, payload)
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * teacherFixedSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpTeacherFixedSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * subjectFixedAllList({payload, callback}, {call}) {
            const res = yield call(httpSubjectFixedAllList, payload)
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * subjectFixedSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpSubjectFixedSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * spaceFixedAllList({payload, callback}, {call}) {
            const res = yield call(httpSpaceFixedAllList, payload)
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * spaceFixedSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpSpaceFixedSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * teacherSpecialAllList({payload}, {put, call}) {
            const res = yield call(httpTeacherSpecialAllList, payload)
            yield put({
                type: 'teacherSpecialAllListSuccess',
                payload: res.data
            })
        },
        * teacherSpecialSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpTeacherSpecialSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * teacherSpecialDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpTeacherSpecialDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * subjectSpecialAllList({payload}, {put, call}) {
            const res = yield call(httpSubjectSpecialAllList, payload)
            yield put({
                type: 'subjectSpecialAllListSuccess',
                payload: res.data
            })
        },
        * subjectSpecialSaveBatch({payload, callback}, {call}) {
            const res = yield call(httpSubjectSpecialSaveBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
        * subjectSpecialDeleteBatch({payload, callback}, {call}) {
            const res = yield call(httpSubjectSpecialDeleteBatch, payload);
            if (callback && typeof callback === 'function') {
                callback(res)
            }
        },
    },

    reducers: {
        teacherSpecialAllListSuccess(state, {payload}) {
            return {
                ...state,
                teacherSpecialAllList: payload
            }
        },
        subjectSpecialAllListSuccess(state, {payload}) {
            return {
                ...state,
                subjectSpecialAllList: payload
            }
        },
    }
}
