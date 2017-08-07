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

type StateProps = {
  channels: any,
  messages: any[],
  currentChannel: string,
  nick: string,
  userId: number,
  channelLength: number
}

type DispatchProps = {
  makeCurrentChannel: (channel: string) => void,
  sendMessage: (channel: string, message: string) => void,
  closeChannel: (channel: string) => void ,
  joinChannel: (channel: string) => void
}

let styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  } as React.CSSProperties,
  topBar: {
    backgroundColor: '#FE4590',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row'
  } as React.CSSProperties,
  tabs: {
    flexGrow: 1,
    padding: '0 5px',
    display: 'flex',
    overflowY: 'hidden',
    overflowX: 'auto',
    alignItems: 'flex-end'
  } as React.CSSProperties,
  currentUser: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    display: 'flex',
    color: 'white'
  } as React.CSSProperties,
  currentUserImageContainer: {
    height: '35px',
    width: '35px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  } as React.CSSProperties,
  currentUserImage: {
    maxHeight: '100%'
  } as React.CSSProperties,
  currentUserNick: {
    padding: 5,
    display: 'flex',
    alignItems: 'center'
  } as React.CSSProperties,
  chat: {
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    wordBreak: 'break-word'
  } as React.CSSProperties,
  dummyDiv: {
    float: 'left',
    clear: 'both'
  } as React.CSSProperties
}

export class Client extends React.Component<StateProps & DispatchProps, any> {

  constructor(props: any) {
    super(props);

    this.state = {
      msg: '',
      showJoinModal: false
    }
  }

  displayMessages = [];
  displayMessagesAmount: number = 50

  handleChangeMsg(event: any) {
    this.setState({ msg: event.target.value });
  }

  handleSubmit(event: any) {
    event.preventDefault();

    this.props.sendMessage(this.props.currentChannel, this.state.msg);
    this.setState({ msg: '' });
  }

  render() {

    // Tabs
    let channels = Object.keys(this.props.channels);
    let channelMap = channels.map((channel, index) => 
      <Tab
        key={index}
        tabName={channel}
        tabClick={this.props.makeCurrentChannel.bind(this)}
        closeTab={this.props.closeChannel.bind(this)}
        isActive={this.props.currentChannel === channel}
      />
    );

    let userImage = (() => {
      if (this.props.userId !== 0)
        return <img style={styles.currentUserImage} src={`https://a.ppy.sh/${this.props.userId}_${Date.now()}.jpg`} />;
    })();

    return (
      <div style={styles.container}>

        {/*Modals*/}
        <JoinModal
          isOpen={this.state.showJoinModal}
          onClose={() => { this.setState({ showJoinModal: false }) }}
          joinChannel={ this.props.joinChannel.bind(this) }
        />

        {/*Top bar*/}
        <div style={styles.topBar}>

          {/*Tabs*/}
          <div style={styles.tabs}>
            {channelMap}
            <AddTab clickAddTab={() => this.setState({ showJoinModal: true })} />
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
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" placeholder="Enter a message..." value={this.state.msg} onChange={this.handleChangeMsg.bind(this)} />
          <input type="submit" value="Submit" />
        </form>
        
      </div>
    )
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
  }
}

/* istanbul ignore next */
function dispatchToProps(dispatch: any) {
  return {
    makeCurrentChannel: (channel: string) => { dispatch( makeCurrentChannel(channel) ) },
    sendMessage: (channel: string, message: string) => { dispatch( sendMessage(channel, message) ) },
    closeChannel: (channel: string) => { dispatch( leaveChannel(channel) ) },
    joinChannel: (channel: string) => { dispatch( join(channel) ) }
  }
}

/* istanbul ignore next */
export default connect(stateToProps, dispatchToProps)(Client);