
import * as Irc from 'irc';
import { Map, fromJS } from 'immutable';
import axios from 'axios';

import { IMessage, MessageType } from '../models';

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
        dispatch(receivedMessage({ nick, to, text, date: new Date(), type: MessageType.message }));
      });

      client.on('action', (nick: string, to: string, text: string) => {
        dispatch(receivedMessage({ nick, to, text, date: new Date(), type: MessageType.action }));
      });

      client.on('pm', (nick: string, text: string) => {
        dispatch(receivedPm({ nick, text, date: new Date(), type: MessageType.message }));
      });

      client.on('error', () => {
        client.removeAllListeners('error');
        client.disconnect(null, null);
        dispatch(loginError());
        reject('Login error');
      });

      client.connect(0, () => {
        client.removeAllListeners('error');
        dispatch(connectedToServer(user));
        dispatch(getUserInfo(user));

        // Default channels
        dispatch(join('#osu'));
        dispatch(join('#english'));
        dispatch(makeCurrentChannel('#osu'));

        resolve(client);
      });
    });
  };
}

export function logout() {
  return (dispatch: any, getState: () => Map<any, any>) => {
    return new Promise((resolve, reject) => {
      client.disconnect(null, () => {
        dispatch({ type: 'LOG_OUT' });
        resolve();
      });
    });
  };
}

export function getUserInfo(user: string) {
  return (dispatch: any, getState: () => Map<any, any>) => {
    return axios
      .get('https://marekkraus.sk/irc4osu/getUserBasic.php?username=' + user)
      .then((response: any) => {
        const userInfo = response.data[0];
        const selfNick = getState().getIn(['userInfo', 'userName']);

        if (user === selfNick) {
          dispatch({ type: 'SELF_INFO_FETCHED', payload: {userInfo} });
        } else {
          dispatch({ type: 'USER_INFO_FETCHED', payload: {userName: user, userInfo} });
        }
      });
  };
}

export function loginError() {
  return { type: 'LOGIN_ERROR' };
}

export function connectingToServer() {
  return { type: 'CONNECTING_TO_SERVER' };
}

export function connectedToServer(nick: string) {
  return { type: 'CONNECTED_TO_SERVER', payload: nick };
}

export function receivedMessage(message: IMessage) {
  const { nick, to, text, date, type } = message;
  return { type: 'RECEIVED_MESSAGE', payload: { nick, to, text, date, type } };
}

export function receivedAction(message: IMessage) {
  const { nick, to, text, date, type } = message;
  return { type: 'RECEIVED_ACTION', payload: { nick, to, text, date, type } };
}

export function receivedPm(message: IMessage) {
  const { nick, text, date, type } = message;
  return { type: 'RECEIVED_PM', payload: { nick, text, date, type } };
}

export function join(channel: string) {
  return (dispatch: any) => {
    return new Promise((resolve, reject) => {

      dispatch(openChannel(channel));

      if (channel.charAt(0) !== '#') {
        // If channel is a user
        dispatch(receivedMessage({
          nick: 'System',
          to: channel,
          text: `Joined ${channel}!`,
          date: new Date(),
          type: MessageType.system
        }));
      } else {
        // Else it's a channel
        dispatch(receivedMessage({
          nick: 'System',
          to: channel,
          text: `Attempting to join ${channel}...`,
          date: new Date(),
          type: MessageType.system
        }));
        client.on('error', () => {
          client.removeAllListeners('error');
          dispatch(receivedMessage({
            nick: 'System',
            to: channel,
            text: `Failed to join ${channel}!`,
            date: new Date(),
            type: MessageType.system
          }));
        });
        client.join(channel, () => {
          client.removeAllListeners('error');
          dispatch(receivedMessage({
            nick: 'System',
            to: channel,
            text: `Joined ${channel}!`,
            date: new Date(),
            type: MessageType.system
          }));
        });
      }

      resolve();
    });
  };
}

export function openChannel(channel: string) {
  return { type: 'OPEN_CHANNEL', payload: channel };
}

export function tabMove(from: number, to: number) {
  return { type: 'TAB_MOVE', payload: { from, to } };
}

export function makeCurrentChannel(channel: string) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      dispatch({
        type: 'MAKE_CURRENT_CHANNEL',
        payload: {
          name: channel.toLowerCase(),
          messages: getState().getIn(['channelDb', channel.toLowerCase(), 'messages']).toJS()
        }
      });

      resolve();
    });
  };
}

export function sendMessage(channel: string, message: string) {
  return (dispatch: any, getState: () => Map<any, any>) => {
    return new Promise((resolve, reject) => {
      const nick = getState().getIn(['userInfo', 'userName']);
      const date = new Date();
      const msgObject: IMessage = {
        nick,
        date,
        text: message,
        to: channel,
        type: MessageType.self
      };

      client.say(channel, message);
      dispatch({ type: 'SENT_MESSAGE', payload: msgObject });
      resolve();
    });
  };
}

export function sendCommand(channel: string, command: string, args: string[]) {
  return (dispatch: any, getState: () => Map<any, any>) => {
    return new Promise((resolve, reject) => {
      switch (command) {
        case '/join':
        case '/j':
          dispatch(join(args[0]));
          dispatch(makeCurrentChannel(args[0]));
          break;
        case '/part':
        case '/p':
          dispatch(leaveChannel(channel));
          break;
        default:
          reject();
      }
      resolve();
    });
  };
}

export function leaveChannel(channel: string) {
  return (dispatch: any, getState: () => Map<any, any>) => {
    return new Promise((resolve, reject) => {
      const channels = getState().get('tabs').toJS();
      const currentChannel = getState().getIn(['channelCurrent', 'name']);
      let nextChannel = currentChannel || '';

      if (channels.indexOf(channel) === -1) {
        return reject('Channel not found!');
      }

      // Handle changing to next/previous channel when closing tabs
      if (channels[channels.length - 1] === currentChannel && channel === currentChannel && channels.length > 1) {
        nextChannel = channels[channels.length - 2];
      } else if (channel === currentChannel && channels.length > 1) {
        nextChannel = channels[channels.indexOf(channel) + 1];
      } else if (channel === currentChannel && channels.length === 1) {
        nextChannel = '';
      }

      // Leave from IRC if it's a channel
      if (channel.charAt(0) === '#') {
        client.part(channel, null, null);
      }

      const nextChannelObj = { name: null, messages: [] };
      if (nextChannel !== '') {
        nextChannelObj.name = nextChannel;
        nextChannelObj.messages = getState().getIn(['channelDb', nextChannel, 'messages']).toJS();
      }

      dispatch({ type: 'LEFT_CHANNEL', payload: { channel, nextChannel: nextChannelObj } });
      resolve();
    });
  };
}
