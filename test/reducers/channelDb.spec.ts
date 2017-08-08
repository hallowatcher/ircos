import * as Immutable from 'immutable';
import channelDbReducer from '../../src/reducers/channelDb';

describe('Channel DB reducer', () => {

  it('should return the default state', () => {
    let initialState = Immutable.fromJS({});
    let actualState = channelDbReducer(initialState, {});
    expect(actualState).toEqual(initialState);
  });

  it('should join a channel', () => {
    let initialState = Immutable.fromJS({});
    let actualState = channelDbReducer(initialState, { type: 'OPEN_CHANNEL', payload: '#osu' });
    let expectedState = { '#osu': { displayName: '#osu', messages: [] } };
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should leave a channel', () => {
    let initialState = Immutable.fromJS({ '#osu': { messages: [] } });
    let actualState = channelDbReducer(initialState, { type: 'LEFT_CHANNEL', payload: {channel: '#osu'} });
    let expectedState = {};
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should receive a message', () => {
    let initialState = Immutable.fromJS({ '#osu': { messages: [] } });
    let message = { nick: 'hallowatcher', to: '#osu', text: 'yo', date: new Date(2017, 1, 1) }
    let actualState = channelDbReducer(initialState, { type: 'RECEIVED_MESSAGE', payload: message });
    let expectedState = { '#osu': { messages: [{ name: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) }] } };
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should receive a pm', () => {
    let initialState = Immutable.fromJS({ 'hallowatcher': { displayName: 'hallowatcher', messages: [] } });
    let message = { nick: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) }
    let actualState = channelDbReducer(initialState, { type: 'RECEIVED_PM', payload: message });
    let expectedState = { 'hallowatcher': { displayName: 'hallowatcher', messages: [{ name: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) }] } };
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should receive a pm even though the channel is not open', () => {
    let initialState = Immutable.fromJS({});
    let message = { nick: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) }
    let actualState = channelDbReducer(initialState, { type: 'RECEIVED_PM', payload: message });
    let expectedState = { 'hallowatcher': { displayName: 'hallowatcher', messages: [{ name: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) }] } };
    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should send a message', () => {
    let initialState = Immutable.fromJS({ '#osu': { messages: [] } });
    let message = { nick: 'hallowatcher', channel: '#osu', message: 'yo', date: new Date(2017, 1, 1) }
    let actualState = channelDbReducer(initialState, { type: 'SENT_MESSAGE', payload: message });
    let expectedState = { '#osu': { messages: [{ name: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) }] } };
    expect(actualState.toJS()).toEqual(expectedState);
  });

});
