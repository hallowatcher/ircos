
import * as actions from '../../src/actions/client'
import { State } from '../../src/reducers'
import * as Immutable from 'immutable'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as MockDate from 'mockdate'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('Client actions', function () {

  let nick, pass, store, datenow
  beforeEach(() => {
    nick = 'foo123'
    pass = 'bar456'
    datenow = 1262304000000

    // Mock date
    MockDate.set(datenow)

    const initialState = Immutable.fromJS(<State>{
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
      }
    })
    store = mockStore(initialState)
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should connect, join default channels and fetch user info', function () {
    const expectedActions = [
      { type: 'CONNECTING_TO_SERVER' },
      { type: 'CONNECTED_TO_SERVER', payload: nick },
      { type: 'OPEN_CHANNEL', payload: '#osu' },
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Connecting to #osu...',
        to: '#osu',
        date: new Date(datenow)
      }},
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Connected to #osu!',
        to: '#osu',
        date: new Date(datenow)
      }},
      { type: 'OPEN_CHANNEL', payload: '#english' },
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Connecting to #english...',
        to: '#english',
        date: new Date(datenow)
      }},
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Connected to #english!',
        to: '#english',
        date: new Date(datenow)
      }},
      { type: 'MAKE_CURRENT_CHANNEL', payload: { messages: undefined, name: '#osu' } },
      { type: 'SELF_INFO_FETCHED', payload: { userInfo: { userName: nick } } }
    ]

    return store.dispatch(actions.createConnection(nick, pass)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should fetch someone\'s user info', function () {

    let user = 'someoneElse'
    const expectedActions = [
      { type: 'USER_INFO_FETCHED', payload: { userName: user, userInfo: { userName: user } } }
    ]

    return store.dispatch(actions.getUserInfo(user)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should open a private chat', function () {

    let user = 'someoneElse'
    const expectedActions = [
      { type: 'OPEN_CHANNEL', payload: user },
      { type: 'RECEIVED_MESSAGE', payload: {
        nick: 'System',
        text: 'Connected to someoneElse!',
        to: 'someoneElse',
        date: new Date(datenow)
      } }
    ]

    return store.dispatch(actions.join(user)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should call message and pm event listener', function () {
    return store.dispatch(actions.createConnection(nick, pass)).then((client) => {

      let to = 'someoneElse'
      let text = 'theText'
      const expectedActions = [
        { type: 'RECEIVED_MESSAGE', payload: { nick, to, text, date: new Date(datenow) } },
        { type: 'RECEIVED_PM', payload: { nick, text, date: new Date(datenow) } }
      ]

      client.emit('message#', nick, to, text)
      client.emit('pm', nick, text)

      let actions = store.getActions()
      expect(actions[actions.length - 2]).toEqual(expectedActions[0])
      expect(actions[actions.length - 1]).toEqual(expectedActions[1])
    })
  })

  it('should send a message', function () {

    const channel = '#osu'
    const message = 'theText'
    const expectedActions = [
      { type: 'SENT_MESSAGE', payload: { nick, channel, message, date: new Date(datenow) } }
    ]

    return store.dispatch(actions.sendMessage(channel, message)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should change to correct channel when leaving', function () {
    const channel = '#osu'
    const nextChannel = { name: '#english', messages: undefined }
    const expectedActions = [
      { type: 'LEFT_CHANNEL', payload: { channel, nextChannel } }
    ]

    return store.dispatch(actions.leaveChannel(channel)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should change to correct channel when leaving last one', function () {
    const initialState = Immutable.fromJS(<State>{
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
      }
    })
    store = mockStore(initialState)

    const channel = '#english'
    const nextChannel = { name: '#german', messages: undefined }
    const expectedActions = [
      { type: 'LEFT_CHANNEL', payload: { channel, nextChannel } }
    ]

    return store.dispatch(actions.leaveChannel(channel)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should change to nothing if last channel is closed', function () {

    const tempInitialState = Immutable.fromJS(<State>{
      userInfo: {
        userName: nick
      },
      channelDb: {
        '#osu': {}
      }
    })
    store = mockStore(tempInitialState)

    const channel = '#osu'
    const nextChannel = { name: null, messages: [] }
    const expectedActions = [
      { type: 'LEFT_CHANNEL', payload: { channel, nextChannel } }
    ]

    return store.dispatch(actions.leaveChannel(channel)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should leave private chat', function () {

    const tempInitialState = Immutable.fromJS(<State>{
      userInfo: {
        userName: nick
      },
      channelDb: {
        'player': {}
      }
    })
    store = mockStore(tempInitialState)

    const channel = 'player'
    const nextChannel = { name: null, messages: [] }
    const expectedActions = [
      { type: 'LEFT_CHANNEL', payload: { channel, nextChannel } }
    ]

    return store.dispatch(actions.leaveChannel(channel)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('should throw when the channel requested to close does not exist', function () {
    return store.dispatch(actions.leaveChannel('#german'))
      .then(() => {
        throw new Error('Shouldn\'t resolve!')
      }, (err) => {
        expect(err).toEqual('Channel not found!')
      })
  })
})