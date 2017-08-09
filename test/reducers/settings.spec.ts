import * as Immutable from 'immutable';
import settingsReducer from '../../src/reducers/settings';

describe('Settings reducer', () => {
  it('should return the default state', () => {
    const initialState = Immutable.fromJS({ channelLength: 10 });
    const actualState = settingsReducer(initialState, {});

    expect(actualState).toEqual(initialState);
  });
});
