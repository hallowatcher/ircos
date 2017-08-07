
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Message, UserType } from './Message';
import * as moment from 'moment';

interface Props {
  messages: any[]
  selfNick: string
  style?: React.CSSProperties
}

export class ChatView extends React.Component<Props, any> {

  mapMessages() {
    return this.props.messages.map((msg: any, index: number) => {

        // User type check
        let userType = UserType.regular;
        if (msg.name === this.props.selfNick)
          userType = UserType.self;

        return <Message
                  key={index}
                  message={msg.text}
                  user={msg.name}
                  userType={userType}
                  sentDate={moment(msg.date)}
                />;
      })
  }

  scrollAtBottom: boolean = true;
  scrollAtTop: boolean = false;
  topMessage: any = null;
  historyChanged: boolean = false;
  multiplier: number = 1;

  componentWillUpdate(nextProps: Props) {
    this.historyChanged = nextProps.messages.length !== this.props.messages.length;
    if (!this.historyChanged || !this.refs.container) return;

    const container = this.refs.container as HTMLDivElement;
    const scrollPos = container.scrollTop;
    const scrollBottom = container.scrollHeight - container.clientHeight;
    this.scrollAtBottom = (scrollBottom <= 0) || (scrollPos === scrollBottom)
  }

  componentDidUpdate() {
    if (this.scrollAtBottom)
      this.scrollToBottom(); 
  }

  /* istanbul ignore next */
  scrollToBottom() {
    const container = this.refs.container as HTMLDivElement;
    const scrollHeight = container.scrollHeight;
    const height = container.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(container).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    return (
      <div style={this.props.style} ref="container">
        {this.mapMessages()}
      </div>
    )
  }
}