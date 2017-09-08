import { Map, List, fromJS } from 'immutable';

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

  const { nick, to, text, date } = action.payload;

  state = state.updateIn(
    [to.toLowerCase(), 'messages'],
    (messages) => messages.push({ name: nick, text, date })
  );

  return state;
}

function receivedPm(state: Map<any, any>, action: any) {

  const { nick, text, date } = action.payload;

  // Check if the channel has been previously opened
  if (state.get(nick.toLowerCase()) === undefined) {
    state = openChannel(state, { payload: nick });
  }

  state = state.updateIn(
    [nick.toLowerCase(), 'messages'],
    (messages) => messages.push({name: nick, text, date})
  );

  return state;

}

function sentMessage(state: Map<any, any>, action: any) {

  const {nick, channel, message, date} = action.payload;

  state = state.updateIn(
    [channel.toLowerCase(), 'messages'],
    (messages) => messages.push({name: nick, text: message, date})
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
