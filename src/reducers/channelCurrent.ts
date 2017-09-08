
import { Map, fromJS } from 'immutable';
import { IMessage, MessageType } from '../models';

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
  const msg: IMessage = action.payload;
  if (state.get('name') !== null && msg.to.toLowerCase() === state.get('name').toLowerCase()) {
    return state.updateIn(
      ['messages'],
      (messages: IMessage[]) => messages.push(msg)
    );
  }

  return state;
}

function receivedPm(state: Map<any, any>, action: any) {
  const msg: IMessage = action.payload;
  if (msg.nick.toLowerCase() === state.get('name').toLowerCase()) {
    return state.updateIn(
      ['messages'],
      (messages: IMessage[]) => messages.push(msg)
    );
  }

  return state;
}

function sentMessage(state: Map<any, any>, action: any) {
  const msg: IMessage = action.payload;
  if (msg.to.toLowerCase() === state.get('name').toLowerCase()) {
    return state.updateIn(
      ['messages'],
      (messages: IMessage[]) => messages.push(msg)
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
