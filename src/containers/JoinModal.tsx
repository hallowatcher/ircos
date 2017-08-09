
import * as React from 'react';
import Modal from 'react-modal';

interface IState {
  isOpen: boolean;
  onClose: () => void;
  joinChannel: (event: any) => void;
}

const styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

export class JoinModal extends React.Component<IState, any> {
  constructor() {
    super();

    this.state = {
      channel: ''
    };

    this.joinChannel = this.joinChannel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        contentLabel='Join channel'
        style={styles}
      >
        <h1>Join channel modal</h1>
        <form onSubmit={this.joinChannel}>
          <input placeholder="#channel or user" onChange={this.handleChange} />
          <input type="submit" />
        </form>
      </Modal>
    );
  }

  private handleChange(event: any) {
    this.setState({ channel: event.target.value });
  }

  private joinChannel(event: any) {
    event.preventDefault();

    if (this.state.channel !== '') {
      this.props.joinChannel(this.state.channel);
      this.props.onClose();
    }
  }
}
