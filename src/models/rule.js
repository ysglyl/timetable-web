import {
    httpAllList as httpSectionDisabledAllList,
    httpSaveBatch as httpSectionDisabledSaveBatch
} from "@/services/rule/section_disabled";
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

export default {
    namespace: 'rule',

    state: {},

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
        }
    },

    reducers: {}
}
