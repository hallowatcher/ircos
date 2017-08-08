import * as React from 'react';

type Props = {
  error: string
  submitLogin: (user: string, pass: string) => void
}

type State = {
  user: string,
  pass: string
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px'
}

const inputStyle: React.CSSProperties = {
  border: 0,
  outline: 'none',
  padding: '4px',
  borderLeft: '3px solid rgba(0, 0, 0, 0.5)'
}

const buttonStyle: React.CSSProperties = {
  border: 0,
  padding: '4px'
}

const errorStyle: React.CSSProperties = {
  color: 'rgba(255, 0, 0, 0.65)',
  fontSize: 14
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
    let error = null;
    if (this.props.error)
      error = <div style={errorStyle}>{this.props.error}</div>;

    return (
      <form onSubmit={this.handleSubmit.bind(this)} style={formStyle}>
        <h1>ircos</h1>
        {error}
        <input type="text" name="user" placeholder="Username" style={inputStyle} value={this.state.user} onChange={this.inputChanged.bind(this)} />
        <input type="password" name="pass" placeholder="Password" style={inputStyle} value={this.state.pass} onChange={this.inputChanged.bind(this)} />
        <input type="submit" style={buttonStyle} value="Login!" />
      </form>
    )
  }
}