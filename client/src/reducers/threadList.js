import {
    BOARD_PAGE_LOADED,
    THREAD_SUBMITTED,
    REPORT_THREAD,
    DELETE_THREAD
} from '../constants/actiontypes'


const threadList = (state = {}, action) => {

    switch (action.type) {
        case BOARD_PAGE_LOADED:
            return {
                ...state,
                threads: action.payload[0].threads
            };
        case THREAD_SUBMITTED:
            const threads = [].concat(state.threads, action.payload.thread);
            return {
                ...state,
                threads
            };
        case DELETE_THREAD:
            return state.threads.filter(thread =>
                thread._id === action.payload
              )
        case REPORT_THREAD:
            return state.threads.map(thread =>
                thread._id === action.payload ? { ...thread, reported: true } : thread
              )
        default:
            return state
    }
}


export default threadList;