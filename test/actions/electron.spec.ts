
import * as actions from '../../src/actions/electron';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Electron actions', function() {

  let store;

  beforeEach(() => {
    store = mockStore();
  });

  it('should open external url', function(done) {
    store.dispatch(actions.openExternal('123')).then(() => {
      done();
    });
  });
});
