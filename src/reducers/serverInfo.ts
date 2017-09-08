
import { Map } from 'immutable';

export default function(state: Map<any, any>, action: any) {

  switch (action.type) {
    case 'LOGIN_ERROR':
      return loginError(state, action);
    case 'CONNECTING_TO_SERVER':
      return connectingToServer(state, action);
    case 'CONNECTED_TO_SERVER':
      return connectedToServer(state, action);
    case 'LOG_OUT':
      return logout(state, action);
  }

  return state;
}

function loginError(state: Map<any, any>, action: any) {
  return state.set('error', 'Error logging in!').set('connecting', false);
}

function connectingToServer(state: Map<any, any>, action: any) {
  return state.set('connecting', true).set('error', null);
}

function connectedToServer(state: Map<any, any>, action: any) {
  return state.set('connecting', false).set('connected', true);
}

function logout(state: Map<any, any>, action: any) {
  return state.set('connected', false);
}
