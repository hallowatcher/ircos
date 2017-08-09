import * as React from 'react';

interface IProps {
  error: string;
  submitLogin: (user: string, pass: string) => void;
}

interface IState {
  user: string;
  pass: string;
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px'
};

const inputStyle: React.CSSProperties = {
  border: 0,
  outline: 'none',
  padding: '4px',
  borderLeft: '3px solid rgba(0, 0, 0, 0.5)'
};

const buttonStyle: React.CSSProperties = {
  border: 0,
  padding: '4px'
};

const errorStyle: React.CSSProperties = {
  color: 'rgba(255, 0, 0, 0.65)',
  fontSize: 14
};

export class LoginForm extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      user: '',
      pass: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
  }

  public render() {
    let error = null;
    if (this.props.error) {
      error = <div style={errorStyle}>{this.props.error}</div>;
    }

    return (
      <form onSubmit={this.handleSubmit} style={formStyle}>
        <h1>ircos</h1>
        {error}
        <input
          type="text"
          name="user"
          placeholder="Username"
          style={inputStyle}
          value={this.state.user}
          onChange={this.inputChanged}
        />
        <input
          type="password"
          name="pass"
          placeholder="Password"
          style={inputStyle}
          value={this.state.pass}
          onChange={this.inputChanged}
        />
        <input type="submit" style={buttonStyle} value="Login!" />
      </form>
    );
  }

  private inputChanged(event: any) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  private handleSubmit(event: any) {
    event.preventDefault();

    if (this.state.user !== '' && this.state.pass !== '') {
      this.props.submitLogin(this.state.user, this.state.pass);
    }
  }
}
