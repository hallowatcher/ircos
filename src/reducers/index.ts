
import { combineReducers } from 'redux-immutable';
import * as Immutable from 'immutable';

import serverInfo from './serverInfo';
import channelDb from './channelDb';
import channelCurrent from './channelCurrent';
import userInfo from './userInfo';
import settings from './settings';
import tabs from './tabs';

export interface IState {
  serverInfo;
  userInfo;
  settings;
  channelDb;
  channelCurrent;
  tabs;
}

const initialStateJS: IState = {
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
  tabs: [],
  channelDb: {},
  channelCurrent: {
    name: null,
    initialLength: 10,
    currentLength: 10,
    messages: []
  }
};

export const initialState: Immutable.Map<any, any> = Immutable.fromJS(initialStateJS);

/* istanbul ignore next */
export default combineReducers({
  serverInfo,
  userInfo,
  settings,
  channelDb,
  channelCurrent,
  tabs
});
