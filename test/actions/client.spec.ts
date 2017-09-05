
import * as actions from '../../src/actions/client';
import { IState } from '../../src/reducers';
import * as Immutable from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as MockDate from 'mockdate';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Client actions', function() {

  let nick;
  let pass;
  let store;
  let datenow;

  beforeEach(() => {
    nick = 'foo123';
    pass = 'bar456';
    datenow = 1262304000000;

    // Mock date
    MockDate.set(datenow);

    const initialStateJS: IState = {
      userInfo: {
        userName: nick
      },
      channelCurrent: {
        name: '#osu',
        messages: []
      },
      channelDb: {
        '#osu': {},
        '#english': {}
      },
      tabs: ['#osu', '#english'],
      serverInfo: null,
      settings: null
    };

    const initialState = Immutable.fromJS(initialStateJS);
    store = mockStore(initialState);
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should connect, join default channels and fetch user info', function() {
    const expectedActions = [
      { type: 'CONNECTING_TO_SERVER' },
      { type: 'CONNECTED_TO_SERVER', payload: nick },
      { type: 'OPEN_CHANNEL', payload: '#osu' },
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Attempting to join #osu...',
        to: '#osu',
        date: new Date(datenow)
      }},
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Joined #osu!',
        to: '#osu',
        date: new Date(datenow)
      }},
      { type: 'OPEN_CHANNEL', payload: '#english' },
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Attempting to join #english...',
        to: '#english',
        date: new Date(datenow)
      }},
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Joined #english!',
        to: '#english',
        date: new Date(datenow)
      }},
      { type: 'MAKE_CURRENT_CHANNEL', payload: { messages: undefined, name: '#osu' } },
      { type: 'SELF_INFO_FETCHED', payload: { userInfo: { userName: nick } } }
    ];

    return store.dispatch(actions.createConnection(nick, pass)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should fail to connect with wrong credentials', function() {
    const expectedActions = [
      { type: 'CONNECTING_TO_SERVER' },
      { type: 'LOGIN_ERROR' }
    ];

    return store.dispatch(actions.createConnection('error', pass))
      .then(() => {
        throw new Error('Shouldn\'t resolve!');
      }, (err) => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should fetch someone\'s user info', function() {

    const user = 'someoneElse';
    const expectedActions = [
      { type: 'USER_INFO_FETCHED', payload: { userName: user, userInfo: { userName: user } } }
    ];

    return store.dispatch(actions.getUserInfo(user)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should move a tab', function() {
    const expectedActions = [
      { type: 'TAB_MOVE', payload: { from: 0, to: 1 } }
    ];

    store.dispatch(actions.tabMove(0, 1));
    expect(store.getActions()).toEqual(expectedActions);

  });

  it('should open a private chat', function() {

    const user = 'someoneElse';
    const expectedActions = [
      { type: 'OPEN_CHANNEL', payload: user },
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Joined someoneElse!',
        to: 'someoneElse',
        date: new Date(datenow)
      } }
    ];

    return store.dispatch(actions.join(user)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should fail to connect to channel', function() {

    const channel = '#error';
    const expectedActions = [
      { type: 'OPEN_CHANNEL', payload: channel },
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Attempting to join #error...',
        to: '#error',
        date: new Date(datenow)
      } },
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Failed to join #error!',
        to: '#error',
        date: new Date(datenow)
      } }
    ];

    return store.dispatch(actions.join(channel)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should call message and pm event listener', function() {
    return store.dispatch(actions.createConnection(nick, pass)).then((client) => {

      const to = 'someoneElse';
      const text = 'theText';
      const expectedActions = [
        { type: 'RECEIVED_MESSAGE', payload: { nick, to, text, date: new Date(datenow) } },
        { type: 'RECEIVED_PM', payload: { nick, text, date: new Date(datenow) } }
      ];

      client.emit('message#', nick, to, text);
      client.emit('pm', nick, text);

      const theActions = store.getActions();
      expect(theActions[theActions.length - 2]).toEqual(expectedActions[0]);
      expect(theActions[theActions.length - 1]).toEqual(expectedActions[1]);
    });
  });

  it('should send a message', function() {

    const channel = '#osu';
    const message = 'theText';
    const expectedActions = [
      { type: 'SENT_MESSAGE', payload: { nick, channel, message, date: new Date(datenow) } }
    ];

    return store.dispatch(actions.sendMessage(channel, message)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should change to correct channel when leaving', function() {
    const channel = '#osu';
    const nextChannel = { name: '#english', messages: undefined };
    const expectedActions = [
      { type: 'LEFT_CHANNEL', payload: { channel, nextChannel } }
    ];

    return store.dispatch(actions.leaveChannel(channel)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should change to correct channel when leaving last one', function() {

    const initialStateJS2: IState = {
      userInfo: {
        userName: nick
      },
      channelCurrent: {
        name: '#english',
        messages: []
      },
      channelDb: {
        '#osu': {},
        '#german': {},
        '#english': {}
      },
      tabs: ['#osu', '#german', '#english'],
      serverInfo: null,
      settings: null
    };

    const initialState = Immutable.fromJS(initialStateJS2);
    store = mockStore(initialState);

    const channel = '#english';
    const nextChannel = { name: '#german', messages: undefined };
    const expectedActions = [
      { type: 'LEFT_CHANNEL', payload: { channel, nextChannel } }
    ];

    return store.dispatch(actions.leaveChannel(channel)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should change to nothing if last channel is closed', function() {

    const tempInitialStateJS: IState = {
      userInfo: {
        userName: nick
      },
      channelDb: {
        '#osu': {}
      },
      tabs: ['#osu'],
      channelCurrent: null,
      serverInfo: null,
      settings: null
    };

    const tempInitialState = Immutable.fromJS(tempInitialStateJS);
    store = mockStore(tempInitialState);

    const channel = '#osu';
    const nextChannel = { name: null, messages: [] };
    const expectedActions = [
      { type: 'LEFT_CHANNEL', payload: { channel, nextChannel } }
    ];

    return store.dispatch(actions.leaveChannel(channel)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should leave private chat', function() {

    const tempInitialStateJS: IState = {
      userInfo: {
        userName: nick
      },
      channelDb: {
        player: {}
      },
      tabs: ['player'],
      channelCurrent: null,
      serverInfo: null,
      settings: null
    };

    const tempInitialState = Immutable.fromJS(tempInitialStateJS);
    store = mockStore(tempInitialState);

    const channel = 'player';
    const nextChannel = { name: null, messages: [] };
    const expectedActions = [
      { type: 'LEFT_CHANNEL', payload: { channel, nextChannel } }
    ];

    return store.dispatch(actions.leaveChannel(channel)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should throw when the channel requested to close does not exist', function() {
    return store.dispatch(actions.leaveChannel('#german'))
      .then(() => {
        throw new Error('Shouldn\'t resolve!');
      }, (err) => {
        expect(err).toEqual('Channel not found!');
      });
  });
});
