import * as React from 'react';

type Props = {
  submitLogin: (user: string, pass: string) => void
}

type State = {
  user: string,
  pass: string
}

export class LoginForm extends React.Component<Props, State> {

  constructor(props: any) {
    super(props);

    this.state = {
      user: '',
      pass: ''
    }
  }

  inputChanged(event: any) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event: any) {
    event.preventDefault();

    if (this.state.user !== '' && this.state.pass !== '')
      this.props.submitLogin(this.state.user, this.state.pass);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" name="user" value={this.state.user} onChange={this.inputChanged.bind(this)} />
        <input type="password" name="pass" value={this.state.pass} onChange={this.inputChanged.bind(this)} />
        <input type="submit" />
      </form>
    )
  }
}