import { Map, List, fromJS } from 'immutable';
import { IMessage, MessageType } from '../models';

export default function(state: Map<any, any>, action: any) {
  switch (action.type) {
    case 'OPEN_CHANNEL':
      return openChannel(state, action);
    case 'RECEIVED_MESSAGE':
      return receivedMessage(state, action);
    case 'RECEIVED_PM':
      return receivedPm(state, action);
    case 'SENT_MESSAGE':
      return sentMessage(state, action);
    case 'LEFT_CHANNEL':
      return leftChannel(state, action);
    case 'LOG_OUT':
      return logout();
  }

  return state;
}

function openChannel(state: Map<any, any>, action: any) {
  state = state.set(action.payload.toLowerCase(), Map({
    displayName: action.payload,
    messages: List()
  }));

  return state;
}

function receivedMessage(state: Map<any, any>, action: any) {

  const msg: IMessage = action.payload;

  state = state.updateIn(
    [msg.to.toLowerCase(), 'messages'],
    (messages: IMessage[]) => messages.push(msg)
  );

  return state;
}

function receivedPm(state: Map<any, any>, action: any) {

  const msg: IMessage = action.payload;

  // Check if the channel has been previously opened
  if (state.get(msg.nick.toLowerCase()) === undefined) {
    state = openChannel(state, { payload: msg.nick });
  }

  state = state.updateIn(
    [msg.nick.toLowerCase(), 'messages'],
    (messages: IMessage[]) => messages.push(msg)
  );

  return state;

}

function sentMessage(state: Map<any, any>, action: any) {

  const msg: IMessage = action.payload;

  state = state.updateIn(
    [msg.to.toLowerCase(), 'messages'],
    (messages) => messages.push(msg)
  );

  return state;
}

function leftChannel(state: Map<any, any>, action: any) {
  const { channel } = action.payload;

  // Filter is used here so the tab order is preserved
  return state.filter((val: any, key: any) => key.toLowerCase() !== channel.toLowerCase());
}

function logout() {
  return fromJS({});
}
