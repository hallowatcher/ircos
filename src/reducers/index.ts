
import { combineReducers } from 'redux-immutable';
import * as Immutable from 'immutable';

import serverInfo from './serverInfo';
import channelDb from './channelDb';
import channelCurrent from './channelCurrent';
import userInfo from './userInfo';
import settings from './settings';

export interface State {
  serverInfo,
  userInfo,
  settings,
  channelDb,
  channelCurrent
}

export const initialState: Immutable.Map<any, any> = Immutable.fromJS(<State>{
  serverInfo: {
    connecting: false,
    connected: false,
    error: null
  },
  userInfo: {
    userName: null,
    userId: 0
  },
  settings: {
    channelLength: 10 
  },
  channelDb: {},
  channelCurrent: {
    name: null,
    initialLength: 10,
    currentLength: 10,
    messages: []
  }
});

/* istanbul ignore next */
export default combineReducers({
  serverInfo,
  userInfo,
  settings,
  channelDb,
  channelCurrent
});