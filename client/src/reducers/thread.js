import {
    DELETE_REPLY,
    REPORT_REPLY,
    THREAD_SUBMITTED,
    GET_FOR_PREVIEW,
    ADD_REPLY
} from '../constants/actiontypes'


const thread = (state = {}, action) => {

    switch (action.type) {
        case THREAD_SUBMITTED:
            return {
                ...action.payload.thread
            }

        case GET_FOR_PREVIEW:
            return {
                ...action.payload.thread
            }
        case ADD_REPLY:
            let replies = [].concat(state.replies, action.payload.reply);
            return {
                ...state,
                replies
            };

        case DELETE_REPLY:
            return state.replies.map(reply =>
                reply._id === action.payload ? reply.text = '{deleted}' : reply
            )
        case REPORT_REPLY:
             state.replies.map(reply =>
                reply._id === action.payload ? { ...reply, reported: true } : reply
            )
            return {
                ...state,
                replies: state.replies.map(reply =>
                    reply._id === action.payload ? { ...reply, reported: true } : reply)
            }
        default:
            return state
    }
}


export default thread;