
import * as Irc from 'irc';
import { Map } from 'immutable';
import axios from 'axios';

let client: Irc.Client = null;

export function createConnection(user: string, pass: string) {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      dispatch(connectingToServer());

      client = new Irc.Client('irc.ppy.sh', user, {
        userName: user,
        password: pass,
        autoConnect: false
      });

      client.on('message#', (nick: string, to: string, text: string) => {
        dispatch(receivedMessage(nick, to, text, new Date()))
      });

      client.on('pm', (nick: string, text: string) => {
        dispatch(receivedPm(nick, text, new Date()))
      });
      
      client.connect(0, () => {
        dispatch(connectedToServer(user));
        dispatch(getUserInfo(user))

        // Default channels
        dispatch(join('#osu'));
        dispatch(join('#english'));
        dispatch(makeCurrentChannel('#osu'));

        resolve(client)
      });
    })
  }
}

export function getUserInfo(user: string) {
  return (dispatch: any, getState: () => Map<any, any>) => {
    return axios
      .get('https://marekkraus.sk/irc4osu/getUserBasic.php?username=' + user)
      .then((response: any) => {
        let userInfo = response.data[0];
        let selfNick = getState().getIn(['userInfo', 'userName']);

        if (user === selfNick)
          dispatch({ type: 'SELF_INFO_FETCHED', payload: {userInfo} })
        else
          dispatch({ type: 'USER_INFO_FETCHED', payload: {userName: user, userInfo} })
      })
  }
}

export function connectingToServer() {
  return { type: 'CONNECTING_TO_SERVER' }
}

export function connectedToServer(nick: string) {
  return { type: 'CONNECTED_TO_SERVER', payload: nick }
}

export function receivedMessage(nick: string, to: string, text: string, date: Date) {
  return { type: 'RECEIVED_MESSAGE', payload: { nick, to, text, date } }
}

export function receivedPm(nick: string, text: string, date: Date) {
  return { type: 'RECEIVED_PM', payload: { nick, text, date } }
}

export function join(channel: string) {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {
      
      if (channel.charAt(0) !== '#') {
        // If channel is a user
        dispatch(joined(channel));
      } else {
        // Else it's a channel
        client.join(channel);
        dispatch(joined(channel));
      }

      resolve();
    })
  }
}

export function joined(channel: string) {
  return { type: 'JOINED_CHANNEL', payload: channel }
}

export function makeCurrentChannel(channel: string) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      dispatch({ type: 'MAKE_CURRENT_CHANNEL', payload: { name: channel, messages: getState().getIn(['channelDb', channel, 'messages']) } })
      resolve();
    })
  }
}

export function sendMessage(channel: string, message: string) {
  return (dispatch: any, getState: () => Map<any, any>) => {
    return new Promise((resolve, reject) => {
      let nick = getState().getIn(['userInfo', 'userName']);
      let date = new Date();

      client.say(channel, message);
      dispatch( { type: 'SENT_MESSAGE', payload: { nick, channel, message, date } } );
      resolve()
    })
  }
}

export function leaveChannel(channel: string) {
  return (dispatch: any, getState: () => Map<any, any>) => {
    return new Promise((resolve, reject) => {
      let channels = Object.keys(getState().get('channelDb').toJS());
      let nextChannel = '';

      if (channels.indexOf(channel) === -1)
        return reject('Channel not found!')

      // Handle changing to next/previous channel when closing tabs
      if (channels[channels.length - 1] === channel && channels.length > 1)
        nextChannel = channels[channels.length - 2];
      else if (channels.length > 1)
        nextChannel = channels[channels.indexOf(channel) + 1];

      // Leave from IRC if it's a channel
      if (channel.charAt(0) === '#')
        client.part(channel, null, null);

      let nextChannelObj = {name: null, messages: []}
      if (nextChannel !== '') {
        nextChannelObj.name = nextChannel;
        nextChannelObj.messages = getState().getIn(['channelDb', channel, 'messages']);
      }

      dispatch({ type: 'LEFT_CHANNEL', payload: { channel, nextChannel: nextChannelObj } });
      resolve()
    })
    
  }
}