import * as Immutable from 'immutable';
import serverInfoReducer from '../../src/reducers/serverInfo';

describe('Server info reducer', () => {

  it('should return the default state', () => {
    let initialState = Immutable.fromJS({ connecting: false, connected: false, error: null });;
    let actualState = serverInfoReducer(initialState, {});

    expect(actualState).toEqual(initialState);
  });

  it('should set connecting to true', () => {
    let initialState = Immutable.fromJS({ connecting: false, connected: false, error: null });

    let expectedState = { connecting: true, connected: false, error: null };
    let actualState = serverInfoReducer(initialState, { type: 'CONNECTING_TO_SERVER' });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should set error to string and connecting to false', () => {
    let initialState = Immutable.fromJS({ connecting: true, connected: false, error: null });

    let expectedState = { connecting: false, connected: false, error: 'Error logging in!' };
    let actualState = serverInfoReducer(initialState, { type: 'LOGIN_ERROR' });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should set error to null and connecting to true', () => {
    let initialState = Immutable.fromJS({ connecting: false, connected: false, error: 'Error logging in!' });

    let expectedState = { connecting: true, connected: false, error: null };
    let actualState = serverInfoReducer(initialState, { type: 'CONNECTING_TO_SERVER' });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should set connected to true and connecting to false', () => {
    let initialState = Immutable.fromJS({ connecting: true, connected: false, error: null });

    let expectedState = { connecting: false, connected: true, error: null };
    let actualState = serverInfoReducer(initialState, { type: 'CONNECTED_TO_SERVER' });

    expect(actualState.toJS()).toEqual(expectedState);
  });

});
