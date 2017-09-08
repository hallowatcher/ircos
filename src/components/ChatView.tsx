
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Message } from './Message';
import * as moment from 'moment';
import { IMessage } from '../models';

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
    const scrollPos = Math.ceil(container.scrollTop);
    const scrollBottom = Math.ceil(container.scrollHeight - container.clientHeight);
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
    return this.props.messages.map((msg: IMessage, index: number) => {
        return (
          <Message
            key={index}
            nick={msg.nick}
            text={msg.text}
            type={msg.type}
            date={msg.date}
            userClicked={this.props.userClicked}
          />
        );
      });
  }
}
