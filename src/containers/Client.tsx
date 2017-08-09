import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import {
  makeCurrentChannel,
  sendMessage,
  leaveChannel,
  join
} from '../actions/client';

import { Tab } from '../components/Tab';
import { AddTab } from '../components/AddTab';
import { ChatView } from '../components/ChatView';
import { JoinModal } from './JoinModal';

interface IStateProps {
  channels: any;
  messages: any[];
  currentChannel: string;
  nick: string;
  userId: number;
  channelLength: number;
}

interface IDispatchProps {
  makeCurrentChannel: (channel: string) => void;
  sendMessage: (channel: string, message: string) => void;
  closeChannel: (channel: string) => void;
  joinChannel: (channel: string) => void;
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
    backgroundColor: '#FE4590',
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
    wordBreak: 'break-word'
  },
  dummyDiv: {
    float: 'left',
    clear: 'both'
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
  }

  public render() {

    // Tabs
    const channels = Object.keys(this.props.channels);
    const channelMap = channels.map((channel, index) =>
    (
      <Tab
        key={index}
        tabName={channel}
        tabClick={this.props.makeCurrentChannel}
        closeTab={this.props.closeChannel}
        isActive={this.props.currentChannel === channel}
      />
    )
    );

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
          <div style={styles.tabs}>
            {channelMap}
            <AddTab clickAddTab={this.showJoinModal} />
          </div>

          {/*Current user*/}
          <div style={styles.currentUser}>
            <div style={styles.currentUserImageContainer}>{userImage}</div>
            <div style={styles.currentUserNick}>{this.props.nick}</div>
          </div>

        </div>

        {/*Chat container*/}
        <ChatView
          style={styles.chat}
          messages={this.props.messages}
          selfNick={this.props.nick}
        />

        {/*Send message*/}
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Enter a message..."
            value={this.state.msg}
            onChange={this.handleChangeMsg}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

  private handleChangeMsg(event: any) {
    this.setState({ msg: event.target.value });
  }

  private handleSubmit(event: any) {
    event.preventDefault();

    this.props.sendMessage(this.props.currentChannel, this.state.msg);
    this.setState({ msg: '' });
  }

  private hideJoinModal() {
    this.setState({ showJoinModal: false });
  }

  private showJoinModal() {
    this.setState({ showJoinModal: true });
  }
}

/* istanbul ignore next */
function stateToProps(state: any) {
  return {
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
    sendMessage: (channel: string, message: string) => { dispatch(sendMessage(channel, message)); },
    closeChannel: (channel: string) => { dispatch(leaveChannel(channel)); },
    joinChannel: (channel: string) => { dispatch(join(channel)); }
  };
}

/* istanbul ignore next */
export default connect(stateToProps, dispatchToProps)(Client);
