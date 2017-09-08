
import { Map, fromJS } from 'immutable';

export default function(state: Map<any, any>, action: any) {
  switch (action.type) {
    case 'MAKE_CURRENT_CHANNEL':
      return makeCurrentChannel(state, action);
    case 'LEFT_CHANNEL':
      return leftChannel(state, action);
    case 'RECEIVED_MESSAGE':
      return receivedMessage(state, action);
    case 'RECEIVED_PM':
      return receivedPm(state, action);
    case 'SENT_MESSAGE':
      return sentMessage(state, action);
    case 'LOG_OUT':
      return logout();
  }

  return state;
}

function makeCurrentChannel(state: Map<any, any>, action: any) {
  return state.set('name', action.payload.name.toLowerCase()).set('messages', fromJS(action.payload.messages));
}

function leftChannel(state: Map<any, any>, action: any) {
  return state
    .set('name', action.payload.nextChannel.name.toLowerCase())
    .set('messages', fromJS(action.payload.nextChannel.messages));
}

function receivedMessage(state: Map<any, any>, action: any) {
  if (state.get('name') !== null && action.payload.to.toLowerCase() === state.get('name').toLowerCase()) {
    return state.updateIn(
      ['messages'],
      (messages) => messages.push({name: action.payload.nick, text: action.payload.text, date: action.payload.date})
    );
  }

  return state;
}

function receivedPm(state: Map<any, any>, action: any) {
  if (action.payload.nick.toLowerCase() === state.get('name').toLowerCase()) {
    return state.updateIn(
      ['messages'],
      (messages) => messages.push({name: action.payload.nick, text: action.payload.text, date: action.payload.date})
    );
  }

  return state;
}

function sentMessage(state: Map<any, any>, action: any) {
  if (action.payload.channel.toLowerCase() === state.get('name').toLowerCase()) {
    return state.updateIn(
      ['messages'],
      (messages) => messages.push({name: action.payload.nick, text: action.payload.message, date: action.payload.date})
    );
  }

  return state;
}

function logout() {
  return fromJS({
    name: null,
    initialLength: 10,
    currentLength: 10,
    messages: []
  });
}
