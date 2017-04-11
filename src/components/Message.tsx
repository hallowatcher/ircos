import * as React from 'react';
import * as moment from 'moment';

export enum UserType {
  regular,
  moderator,
  self
}

type Props = {
  user: string,
  message: string,
  sentDate: moment.Moment,
  userType?: UserType
}

const styles = {
  users: {
    regular: {
      color: '#ffc561',
      fontWeight: 800
    } as React.CSSProperties,
    moderator: {
      color: '#BF3434',
      fontWeight: 800
    } as React.CSSProperties,
    self: {
      color: '#CECECE',
      fontWeight: 800
    } as React.CSSProperties
  },
  message: {

  } as React.CSSProperties,
  time: {
    color: '#b2b2b2'
  } as React.CSSProperties
}

export class Message extends React.Component<Props, any> {
  render() {

    let userStyle = styles.users.regular;
    switch (this.props.userType) {
      case UserType.moderator:
        userStyle = styles.users.moderator
        break;
      case UserType.self:
        userStyle = styles.users.self
        break;
    }

    let momentDate = moment(this.props.sentDate);

    // Build date
    const hours = ('0' + momentDate.hours()).slice(-2);
    const minutes = ('0' + momentDate.minutes()).slice(-2);

    return (
      <div>
        <span style={styles.time}>[{hours}:{minutes}]</span> <span style={userStyle}>{this.props.user}:</span> <span style={styles.message}>{this.props.message}</span>
      </div>
    )
  }
}