import {
    httpAllList as httpTimetableUnitAllList
} from "@/services/schedule/timetable_unit";


export default {
    namespace: 'schedule',

    state: {
        timetableUnitAllList: []
    },

    effects: {
        * timetableUnitAllList({payload}, {put, call}) {
            const res = yield call(httpTimetableUnitAllList, payload)
            yield put({
                type: 'timetableUnitAllListSuccess',
                payload: res.data
            })
        }
    },

    reducers: {
        timetableUnitAllListSuccess(state, {payload}) {
            return {
                ...state,
                timetableUnitAllList: payload
            }
        }
    }
}
