import {
    THREAD_SUBMITTED,
    BOARD_PAGE_LOADED,
    BOARD_PAGE_UNLOADED,

} from '../constants/actiontypes'


const board = (state = {}, action) => {

    switch (action.type) {
        case BOARD_PAGE_LOADED:
            return {
              board: action.payload[1].board
            }
        case BOARD_PAGE_UNLOADED:
            return {}
        default:
            return state
    }
}

export default board;