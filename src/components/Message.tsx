import * as React from 'react';
import * as moment from 'moment';
import { IMessage, MessageType } from '../models';

interface IProps {
  nick: string;
  text: string;
  type: MessageType;
  date: moment.Moment;

  userClicked: (user: string) => void;
}

interface IStyles {
  [key: string]: {
    [key: string]: React.CSSProperties
  } | React.CSSProperties;
}

const styles: IStyles = {
  users: {
    regular: {
      color: '#ffc561',
      fontWeight: 800,
      cursor: 'pointer'
    },
    moderator: {
      color: '#BF3434',
      fontWeight: 800,
      cursor: 'pointer'
    },
    self: {
      color: '#CECECE',
      fontWeight: 800,
      cursor: 'pointer'
    }
  },
  message: {},
  systemMessage: {
    color: '#ADADAD'
  },
  time: {
    color: '#b2b2b2'
  }
};

export class Message extends React.Component<IProps, any> {

  public render() {

    let userStyle = styles.users.regular;
    const { nick, text, date, type } = this.props;
    switch (type) {
      case MessageType.self:
        userStyle = styles.users.self;
        break;
    }

    const momentDate = moment(date);

    // Build date
    const hours = ('0' + momentDate.hours()).slice(-2);
    const minutes = ('0' + momentDate.minutes()).slice(-2);

    let message = (
      <div>
        <span style={styles.time}>[{hours}:{minutes}] </span>
        <span style={userStyle} onClick={this.userClicked}>{nick}: </span>
        <span style={styles.message}>{text}</span>
      </div>
    );

    if (type === MessageType.system) {
      message = (
        <div>
          <span style={styles.systemMessage}>{text}</span>
        </div>
      );
    }

    if (type === MessageType.action) {
      message = (
        <div>
          <span style={styles.time}>[{hours}:{minutes}] </span>
          <span style={styles.message} onClick={this.userClicked}>* {nick} </span>
          <span style={styles.message}>{text}</span>
        </div>
      );
    }

    return message;
  }

  private userClicked = () => {
    this.props.userClicked(this.props.nick);
  }
}
