
import { Map } from 'immutable';

export default function (state: Map<any, any>, action: any) {

  switch (action.type) {
    case 'CONNECTING_TO_SERVER':
      return connectingToServer(state, action);
    case 'CONNECTED_TO_SERVER':
      return connectedToServer(state, action);
  }

  return state;
}

function connectingToServer(state: Map<any, any>, action: any) {
  return state.set('connecting', true);
}

function connectedToServer(state: Map<any, any>, action: any) {
  return state.set('connecting', false).set('connected', true);
}