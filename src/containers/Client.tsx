import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import {
  makeCurrentChannel,
  sendMessage,
  sendCommand,
  leaveChannel,
  join,
  tabMove,
  logout
} from '../actions/client';

import { openExternal } from '../actions/electron';

import Tab from '../components/Tab';
import { AddTab } from '../components/AddTab';
import { TabBar } from '../components/TabBar';
import { ChatView } from '../components/ChatView';
import { JoinModal } from './JoinModal';
import { MessageType, IMessage } from '../models';

interface IStateProps {
  channels: any;
  tabs: string[];
  messages: IMessage[];
  currentChannel: string;
  nick: string;
  userId: number;
  channelLength: number;
}

interface IDispatchProps {
  makeCurrentChannel: (channel: string) => void;
  tabMove: (from: number, to: number) => void;
  sendMessage: (channel: string, message: string) => void;
  sendCommand: (channel: string, command: string, args: string[]) => void;
  closeChannel: (channel: string) => void;
  joinChannel: (channel: string) => void;
  openExternal: (url: string) => void;
  logout: () => void;
}

interface IStyles {
  [key: string]: React.CSSProperties;
}

const styles: IStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  topBar: {
    backgroundImage: 'url(../src/assets/images/bg-light.png)',
    backgroundColor: 'rgba(198, 18, 125, 1)',
    backgroundBlendMode: 'multiply',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row'
  },
  tabs: {
    flexGrow: 1,
    padding: '0 5px',
    display: 'flex',
    overflowY: 'hidden',
    overflowX: 'auto',
    alignItems: 'flex-end'
  },
  currentUser: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    display: 'flex',
    color: 'white'
  },
  currentUserImageContainer: {
    height: '35px',
    width: '35px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  logout: {
    height: '35px',
    width: '35px',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    cursor: 'pointer'
  },
  currentUserImage: {
    maxHeight: '100%'
  },
  currentUserNick: {
    padding: 5,
    display: 'flex',
    alignItems: 'center'
  },
  chat: {
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    wordBreak: 'break-word',
    marginBottom: 10
  },
  dummyDiv: {
    float: 'left',
    clear: 'both'
  },
  sendMessage: {
    display: 'flex',
    flexShrink: 0,
    height: 40
  },
  sendMessageButton: {
    width: 200
  }
};

export class Client extends React.Component<IStateProps & IDispatchProps, any> {

  private displayMessages = [];
  private displayMessagesAmount: number = 50;

  constructor(props: any) {
    super(props);

    this.state = {
      msg: '',
      showJoinModal: false
    };

    this.hideJoinModal = this.hideJoinModal.bind(this);
    this.showJoinModal = this.showJoinModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeMsg = this.handleChangeMsg.bind(this);
    this.userClicked = this.userClicked.bind(this);
  }

  public render() {
    const userImage = (() => {
      if (this.props.userId !== 0) {
        return <img style={styles.currentUserImage} src={`https://a.ppy.sh/${this.props.userId}_${Date.now()}.jpg`} />;
      }
    })();

    return (
      <div style={styles.container}>

        {/*Modals*/}
        <JoinModal
          isOpen={this.state.showJoinModal}
          onClose={this.hideJoinModal}
          joinChannel={this.props.joinChannel}
        />

        {/*Top bar*/}
        <div style={styles.topBar}>

          {/*Tabs*/}
          <TabBar
            tabAdd={this.showJoinModal}
            tabClick={this.props.makeCurrentChannel}
            tabClose={this.props.closeChannel}
            tabMove={this.props.tabMove}
            tabs={this.props.tabs}
            currentChannel={this.props.currentChannel}
          />

          {/*Current user*/}
          <div style={styles.currentUser}>
            <div style={styles.currentUserImageContainer}>{userImage}</div>
            <div style={styles.currentUserNick}>{this.props.nick}</div>
            <div onClick={this.props.logout} style={styles.logout}><i className="fa fa-sign-out" /></div>
          </div>

        </div>

        {/*Chat container*/}
        <ChatView
          style={styles.chat}
          messages={this.props.messages}
          selfNick={this.props.nick}
          userClicked={this.userClicked}
        />

        {/*Send message*/}
        <form style={styles.sendMessage} onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Enter a message..."
            value={this.state.msg}
            onChange={this.handleChangeMsg}
            style={{ padding: 10 }}
          />
          <input type="submit" value="Send" style={styles.sendMessageButton} />
        </form>
      </div>
    );
  }

  private handleChangeMsg(event: any) {
    this.setState({ msg: event.target.value });
  }

  private handleSubmit(event: any) {
    event.preventDefault();

    const msg = this.state.msg.trim() as string;
    const channel = this.props.currentChannel;

    if (msg.charAt(0) === '/') {
      const args = msg.split(' ');
      this.props.sendCommand(channel, args[0], args.slice(1));
    } else {
      this.props.sendMessage(channel, msg);
    }

    this.setState({ msg: '' });
  }

  private hideJoinModal() {
    this.setState({ showJoinModal: false });
  }

  private showJoinModal() {
    this.setState({ showJoinModal: true });
  }

  private userClicked(user: string) {
    this.props.openExternal(`http://osu.ppy.sh/u/${user}`);
  }
}

/* istanbul ignore next */
function stateToProps(state: any) {
  return {
    tabs: state.get('tabs').toJS(),
    channels: state.get('channelDb').toJS(),
    messages: state.getIn(['channelCurrent', 'messages']).toJS(),
    currentChannel: state.getIn(['channelCurrent', 'name']),
    nick: state.getIn(['userInfo', 'userName']),
    userId: state.getIn(['userInfo', 'userId']),
    channelLength: state.getIn(['settings', 'channelLength'])
  };
}

/* istanbul ignore next */
function dispatchToProps(dispatch: any) {
  return {
    makeCurrentChannel: (channel: string) => { dispatch(makeCurrentChannel(channel)); },
    tabMove: (from: number, to: number) => { dispatch(tabMove(from , to)); },
    sendMessage: (channel: string, message: string) => { dispatch(sendMessage(channel, message)); },
    sendCommand: (channel: string, command: string, args: string[]) => {
      dispatch(sendCommand(channel, command, args));
    },
    closeChannel: (channel: string) => { dispatch(leaveChannel(channel)); },
    joinChannel: (channel: string) => { dispatch(join(channel)); dispatch(makeCurrentChannel(channel)); },
    openExternal: (url: string) => { dispatch(openExternal(url)); },
    logout: () => { dispatch(logout()); }
  };
}

/* istanbul ignore next */
export default connect(stateToProps, dispatchToProps)(Client);
