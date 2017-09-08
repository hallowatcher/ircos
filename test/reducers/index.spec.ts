import * as Immutable from 'immutable';
import { initialState } from '../../src/reducers/index';

describe('Initial state', () => {
  it('should be exporting the right values', () => {

    const expectedState = {
      serverInfo: {
        connecting: false,
        connected: false,
        error: null
      },
      userInfo: {
        userName: null,
        userId: 0
      },
      settings: {
        channelLength: 10
      },
      channelDb: {},
      tabs: [],
      channelCurrent: {
        name: null,
        initialLength: 10,
        currentLength: 10,
        messages: []
      }
    };

    expect(initialState.toJS()).toEqual(expectedState);
  });
});
