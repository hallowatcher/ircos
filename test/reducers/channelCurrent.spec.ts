import * as Immutable from 'immutable';
import channelCurrentReducer from '../../src/reducers/channelCurrent';

describe('Current channel reducer', () => {

  it('should return the default state', () => {
    let initialState = Immutable.fromJS({
      name: null,
      initialLength: 10,
      currentLength: 10,
      messages: []
    });

    let actualState = channelCurrentReducer(initialState, {});

    expect(actualState).toEqual(initialState);
  });

  it('should change active channel', () => {
    let initialState = Immutable.fromJS({ name: null, messages: null });
    let expectedState = { name: 'someChannel', messages: [] };
    let actualState = channelCurrentReducer(initialState, { type: 'MAKE_CURRENT_CHANNEL', payload: { name: 'someChannel', messages: [] } });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should leave channel and join next', () => {
    let initialState = Immutable.fromJS({ name: null, messages: null });
    let expectedState = { name: 'someChannel', messages: [] };
    let actualState = channelCurrentReducer(initialState, { type: 'LEFT_CHANNEL', payload: { nextChannelObj: { name: 'someChannel', messages: [] } } });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should return default state if message is not for current channel', () => {
    let initialState = Immutable.fromJS({ name: '#osu', messages: [] });
    let actualState = channelCurrentReducer(initialState, { type: 'RECEIVED_MESSAGE', payload: { to: '#english' } });

    expect(actualState).toEqual(initialState);
  });

  it('should add message to message array', () => {
    let initialState = Immutable.fromJS({ name: '#osu', messages: [] });
    let expectedState = { name: '#osu', messages: [ { name: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) } ] };
    let action = { type: 'RECEIVED_MESSAGE', payload: { to: '#osu', nick: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) } }
    let actualState = channelCurrentReducer(initialState, action);

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should return default state if pm is not for current channel', () => {
    let initialState = Immutable.fromJS({ name: '#osu', messages: [] });
    let actualState = channelCurrentReducer(initialState, { type: 'RECEIVED_PM', payload: { nick: 'foobar' } });

    expect(actualState).toEqual(initialState);
  });

  it('should add pm to message array', () => {
    let initialState = Immutable.fromJS({ name: 'hallowatcher', messages: [] });
    let expectedState = { name: 'hallowatcher', messages: [ { name: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) } ] };
    let action = { type: 'RECEIVED_PM', payload: { nick: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) } }
    let actualState = channelCurrentReducer(initialState, action);

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should return default state if sent message is not for current channel', () => {
    let initialState = Immutable.fromJS({ name: '#osu', messages: [] });
    let actualState = channelCurrentReducer(initialState, { type: 'SENT_MESSAGE', payload: { channel: '#english' } });

    expect(actualState).toEqual(initialState);
  });

  it('should add sent message to message array', () => {
    let initialState = Immutable.fromJS({ name: '#osu', messages: [] });
    let expectedState = { name: '#osu', messages: [ { name: 'hallowatcher', text: 'yo', date: new Date(2017, 1, 1) } ] };
    let action = { type: 'SENT_MESSAGE', payload: { channel: '#osu', nick: 'hallowatcher', message: 'yo', date: new Date(2017, 1, 1) } }
    let actualState = channelCurrentReducer(initialState, action);

    expect(actualState.toJS()).toEqual(expectedState);
  });

});
