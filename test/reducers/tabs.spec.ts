import * as Immutable from 'immutable';
import tabsReducer from '../../src/reducers/tabs';

describe('Tabs reducer', () => {
  it('should return the default state', () => {
    const initialState = Immutable.fromJS([]);
    const actualState = tabsReducer(initialState, {});

    expect(actualState).toEqual(initialState);
  });

  it('should add a tab', () => {
    const initialState = Immutable.fromJS([]);

    const expectedState = ['#osu'];
    const actualState = tabsReducer(initialState, { type: 'OPEN_CHANNEL', payload: '#osu' });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should make a tab lowercase', () => {
    const initialState = Immutable.fromJS([]);

    const expectedState = ['#osu'];
    const actualState = tabsReducer(initialState, { type: 'OPEN_CHANNEL', payload: '#OSU' });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should close a tab', () => {
    const initialState = Immutable.fromJS(['#osu']);

    const expectedState = [];
    const actualState = tabsReducer(initialState, { type: 'LEFT_CHANNEL', payload: { channel: '#osu' } });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should move a tab', () => {
    const initialState = Immutable.fromJS(['#osu', '#english']);

    const expectedState = ['#english', '#osu'];
    const actualState = tabsReducer(initialState, { type: 'TAB_MOVE', payload: { from: 0, to: 1 } });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should add tab on pm', () => {
    const initialState = Immutable.fromJS([]);

    const expectedState = ['hallowatcher'];
    const actualState = tabsReducer(initialState, { type: 'RECEIVED_PM', payload: { nick: 'hallowatcher' } });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should not add tab on pm', () => {
    const initialState = Immutable.fromJS(['hallowatcher']);

    const expectedState = ['hallowatcher'];
    const actualState = tabsReducer(initialState, { type: 'RECEIVED_PM', payload: { nick: 'hallowatcher' } });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should make tab lowercase on pm', () => {
    const initialState = Immutable.fromJS([]);

    const expectedState = ['hallowatcher'];
    const actualState = tabsReducer(initialState, { type: 'RECEIVED_PM', payload: { nick: 'HALLOWATCHER' } });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should remove all tabs on logout', () => {
    const initialState = Immutable.fromJS(['#osu', '#english']);

    const expectedState = [];
    const actualState = tabsReducer(initialState, { type: 'LOG_OUT' });

    expect(actualState.toJS()).toEqual(expectedState);
  });
});
