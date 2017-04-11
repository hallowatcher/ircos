import * as Immutable from 'immutable';
import settingsReducer from '../../src/reducers/settings';

describe('Settings reducer', () => {

  it('should return the default state', () => {
    let initialState = Immutable.fromJS({ channelLength: 10 });;
    let actualState = settingsReducer(initialState, {});

    expect(actualState).toEqual(initialState);
  });

});
