import * as Immutable from 'immutable';
import channelDbReducer from '../../src/reducers/channelDb';
import { MessageType, IMessage } from '../../src/models';

describe('Channel DB reducer', () => {

  it('should return the default state', () => {
    const initialState = Immutable.fromJS({});
    const actualState = channelDbReducer(initialState, {});
    expect(actualState).toEqual(initialState);
  });

  it('should join a channel', () => {
    const initialState = Immutable.fromJS({});
    const actualState = channelDbReducer(initialState, { type: 'OPEN_CHANNEL', payload: '#osu' });
    const expectedState = { '#osu': { displayName: '#osu', messages: [] } };
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should leave a channel', () => {
    const initialState = Immutable.fromJS({ '#osu': { messages: [] } });
    const actualState = channelDbReducer(initialState, { type: 'LEFT_CHANNEL', payload: {channel: '#osu'} });
    const expectedState = {};
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should receive a message', () => {
    const initialState = Immutable.fromJS({ '#osu': { messages: [] } });
    const message: IMessage = {
      nick: 'hallowatcher',
      to: '#osu',
      text: 'yo',
      date: new Date(2017, 1, 1),
      type: MessageType.self
    };
    const actualState = channelDbReducer(initialState, { type: 'RECEIVED_MESSAGE', payload: message });
    const expectedState = {
      '#osu': {
        messages: [{
          nick: 'hallowatcher',
          text: 'yo',
          to: '#osu',
          date: new Date(2017, 1, 1),
          type: MessageType.self
        }]
      }
    };
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should receive a pm', () => {
    const initialState = Immutable.fromJS({ hallowatcher: { displayName: 'hallowatcher', messages: [] } });
    const message: IMessage = {
      nick: 'hallowatcher',
      text: 'yo',
      date: new Date(2017, 1, 1)
    };
    const actualState = channelDbReducer(initialState, { type: 'RECEIVED_PM', payload: message });
    const expectedState = {
      hallowatcher: {
        displayName: 'hallowatcher',
        messages: [
          { nick: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) }
        ]
      }
    };
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should receive a pm even though the channel is not open', () => {
    const initialState = Immutable.fromJS({});
    const message: IMessage = {
      nick: 'hallowatcher',
      text: 'yo',
      date: new Date(2017, 1, 1)
    };
    const actualState = channelDbReducer(initialState, { type: 'RECEIVED_PM', payload: message });
    const expectedState = {
      hallowatcher: {
        displayName: 'hallowatcher',
        messages: [
          { nick: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) }
        ]
      }
    };
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should send a message', () => {
    const initialState = Immutable.fromJS({ '#osu': { messages: [] } });
    const message: IMessage = {
      nick: 'hallowatcher',
      to: '#osu',
      text: 'yo',
      date: new Date(2017, 1, 1),
      type: MessageType.self
    };
    const actualState = channelDbReducer(initialState, { type: 'SENT_MESSAGE', payload: message });
    const expectedState = {
      '#osu': {
        messages: [{
          nick: 'hallowatcher',
          to: '#osu',
          text: 'yo',
          date: new Date(2017, 1, 1),
          type: MessageType.self
        }]
      }
    };
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should reset on logout', () => {
    const initialState = Immutable.fromJS({ '#osu': { messages: [] } });
    const actualState = channelDbReducer(initialState, { type: 'LOG_OUT' });
    const expectedState = {};
    expect(actualState.toJS()).toEqual(expectedState);
  });
});
