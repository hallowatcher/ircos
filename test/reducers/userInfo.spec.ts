import * as Immutable from 'immutable';
import userInfoReducer from '../../src/reducers/userInfo';

describe('User info reducer', () => {

  it('should return the default state', () => {
    const initialState = Immutable.fromJS({ userName: null, userId: 0 });
    const actualState = userInfoReducer(initialState, {});

    expect(actualState).toEqual(initialState);
  });

  it('should set the correct username', () => {
    const initialState = Immutable.fromJS({ userName: null, userId: 0 });

    const expectedState = { userName: 'hallowatcher', userId: 0 };
    const actualState = userInfoReducer(initialState, { type: 'CONNECTED_TO_SERVER', payload: 'hallowatcher' });

    expect(actualState.toJS()).toEqual(expectedState);
  });

  it('should set the correct user id', () => {
    const initialState = Immutable.fromJS({ userName: 'hallowatcher', userId: 0 });

    const expectedState = { userName: 'hallowatcher', userId: 9999 };
    const actualState = userInfoReducer(initialState, {
      type: 'SELF_INFO_FETCHED',
      payload: {
        userInfo: {
          user_id: 9999
        }
      }
    });

    expect(actualState.toJS()).toEqual(expectedState);
  });

});
