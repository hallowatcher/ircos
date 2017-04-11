import * as Immutable from 'immutable';
import channelDbReducer from '../../src/reducers/channelDb';

describe('Channel DB reducer', () => {

  it('should return the default state', () => {
    let initialState = Immutable.fromJS({});
    let actualState = channelDbReducer(initialState, {});
    expect(actualState).toEqual(initialState);
  });

});
