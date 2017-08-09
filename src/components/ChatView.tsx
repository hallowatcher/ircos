
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Message, UserType } from './Message';
import * as moment from 'moment';

interface IProps {
  messages: any[];
  selfNick: string;
  userClicked: (user: string) => void;
  style?: React.CSSProperties;
}

export class ChatView extends React.Component<IProps, any> {

  private scrollAtBottom: boolean = true;
  private scrollAtTop: boolean = false;
  private topMessage: any = null;
  private historyChanged: boolean = false;
  private multiplier: number = 1;

  public componentWillUpdate(nextProps: IProps) {
    this.historyChanged = nextProps.messages.length !== this.props.messages.length;
    if (!this.historyChanged || !this.refs.container) { return; }

    const container = this.refs.container as HTMLDivElement;
    const scrollPos = container.scrollTop;
    const scrollBottom = container.scrollHeight - container.clientHeight;
    this.scrollAtBottom = (scrollBottom <= 0) || (scrollPos === scrollBottom);
  }

  public componentDidUpdate() {
    if (this.scrollAtBottom) {
      this.scrollToBottom();
    }
  }

  public render() {
    return (
      <div style={this.props.style} ref="container">
        {this.mapMessages()}
      </div>
    );
  }

  /* istanbul ignore next */
  private scrollToBottom() {
    const container = this.refs.container as HTMLDivElement;
    const scrollHeight = container.scrollHeight;
    const height = container.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(container).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  private mapMessages() {
    return this.props.messages.map((msg: any, index: number) => {

        // User type check
        let userType = UserType.regular;
        if (msg.name === this.props.selfNick) {
          userType = UserType.self;
        }
        if (msg.name === 'System') {
          userType = UserType.system;
        }

        return (
          <Message
            key={index}
            message={msg.text}
            user={msg.name}
            userType={userType}
            sentDate={moment(msg.date)}
            userClicked={this.props.userClicked}
          />
        );
      });
  }
}
