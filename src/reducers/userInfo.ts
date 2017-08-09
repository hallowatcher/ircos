
import { Map } from 'immutable';

export default function(state: Map<any, any>, action: any) {
  switch (action.type) {
    case 'CONNECTED_TO_SERVER':
      return connectedToServer(state, action);
    case 'SELF_INFO_FETCHED':
      return selfInfoFetched(state, action);
  }

  return state;
}

function connectedToServer(state: Map<any, any>, action: any) {
  const userName = action.payload;
  return state.set('userName', userName);
}

function selfInfoFetched(state: Map<any, any>, action: any) {
  const { userInfo } = action.payload;

  return state.set('userId', parseInt(userInfo.user_id, 10));
}
