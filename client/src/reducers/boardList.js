import {
    HOME_PAGE_LOADED,
    CHECK_IF_BOARD
} from '../constants/actiontypes'


const boardList = (state = {}, action) => {

    switch (action.type) {
        case HOME_PAGE_LOADED:
            return Object.assign({}, state, {
              boards: action.payload.boards,
              boardCount: action.payload.boardCount
            })
        case CHECK_IF_BOARD:
            return Object.assign({}, state, {
                exists: action.payload.exists 
              })
        default:
            return state
    }
}


export default boardList;