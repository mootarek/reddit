import { combineReducers } from 'redux';
import threadList from './reducers/threadList';
import boardList from './reducers/boardList';
import board from './reducers/board';
import thread from './reducers/thread';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  boardList,
  threadList,
  board,
  thread,
  router: routerReducer
});
