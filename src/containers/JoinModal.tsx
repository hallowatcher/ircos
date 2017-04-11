
import * as React from 'react';
import * as Modal from 'react-modal';

type State = {
  isOpen: boolean,
  onClose: () => void
  joinChannel: (channel: string) => void
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

export class JoinModal extends React.Component<State, any> {
  constructor() {
    super();

    this.state = {
      channel: ''
    }
  }

  handleChange(event: any) {
    this.setState({ channel: event.target.value });
  }

  joinChannel(event: any) {
    event.preventDefault();

    if (this.state.channel !== '') {
      this.props.joinChannel(this.state.channel);
      this.props.onClose();
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        contentLabel='Join channel'
        style={styles}
      >
        <h1>Join channel modal</h1>
        <form onSubmit={this.joinChannel.bind(this)}>
          <input placeholder="#channel or user" onChange={this.handleChange.bind(this)} />
          <input type="submit" />
        </form>
      </Modal>
    )
  }
}