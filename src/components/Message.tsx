import * as React from 'react';
import * as moment from 'moment';

export enum UserType {
  regular,
  moderator,
  self,
  system
}

interface IProps {
  user: string;
  message: string;
  sentDate: moment.Moment;
  userType?: UserType;
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
      fontWeight: 800
    },
    moderator: {
      color: '#BF3434',
      fontWeight: 800
    },
    self: {
      color: '#CECECE',
      fontWeight: 800
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
    switch (this.props.userType) {
      case UserType.moderator:
        userStyle = styles.users.moderator;
        break;
      case UserType.self:
        userStyle = styles.users.self;
        break;
    }

    const momentDate = moment(this.props.sentDate);

    // Build date
    const hours = ('0' + momentDate.hours()).slice(-2);
    const minutes = ('0' + momentDate.minutes()).slice(-2);

    let message = (
      <div>
        <span style={styles.time}>[{hours}:{minutes}] </span>
        <span style={userStyle}>{this.props.user}: </span>
        <span style={styles.message}>{this.props.message}</span>
      </div>
    );

    if (this.props.userType === UserType.system) {
      message = (
        <div>
          <span style={styles.systemMessage}>{this.props.message}</span>
        </div>
      );
    }

    return message;
  }
}
