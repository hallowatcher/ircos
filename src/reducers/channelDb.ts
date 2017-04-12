import { Map, List } from 'immutable';

export default function (state: Map<any, any>, action: any) {
  switch (action.type) {
    case 'JOINED_CHANNEL':
      return joinedChannel(state, action);
    case 'RECEIVED_MESSAGE':
      return receivedMessage(state, action);
    case 'RECEIVED_PM':
      return receivedPm(state, action);
    case 'SENT_MESSAGE':
      return sentMessage(state, action);
    case 'LEFT_CHANNEL':
      return leftChannel(state, action);
  }

  return state;
}

function joinedChannel(state: Map<any, any>, action: any) {
  state = state.set(action.payload, Map({
    messages: List()
  }));

  return state;
}

function receivedMessage(state: Map<any, any>, action: any) {

  let { nick, to, text, date } = action.payload;

  state = state.updateIn(
    [to, 'messages'],
    messages => messages.push({name: nick, text: text, date: date})
  )

  return state;
}

function receivedPm(state: Map<any, any>, action: any) {

  let { nick, text, date } = action.payload;

  // Check if the channel has been previously opened
  if (state.get(nick) === undefined)
    state = joinedChannel(state, { payload: nick })

  state = state.updateIn(
    [nick, 'messages'],
    messages => messages.push({name: nick, text: text, date: date})
  )

  return state;

}

function sentMessage(state: Map<any, any>, action: any) {

  let {nick, channel, message, date} = action.payload;

  state = state.updateIn(
    [channel, 'messages'],
    messages => messages.push({name: nick, text: message, date})
  )
  return state;
}

function leftChannel(state: Map<any, any>, action: any) {
  let { channel } = action.payload

  // Filter is used here so the tab order is preserved
  return state.filter((val: any, key: any) => key !== channel);
}