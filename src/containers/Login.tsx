import * as React from 'react';
import { connect } from 'react-redux';
import { LoginForm } from '../components/LoginForm';
import { createConnection } from '../actions/client';

type Props = {
  createConnection: any
}

const divStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#acadaf',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center'
}
const divChild: React.CSSProperties = {
  backgroundColor: 'white',
  alignSelf: 'center',
  boxShadow: '0 0 4px rgba(0, 0, 0, 0.35)'
}

export class Login extends React.Component<Props, null> {
  render() {
    return (
      <div style={divStyle}>
        <div style={divChild}>
          <LoginForm submitLogin={this.props.createConnection.bind(this)} />
        </div>
      </div>
    )
  }
}

/* istanbul ignore next */
function dispatchToProps(dispatch: any) {
   return {
    createConnection: (user: string, pass: string) => { dispatch( createConnection(user, pass) ) }
  }
}

/* istanbul ignore next */
export default connect<any, any, any>(null, dispatchToProps)(Login);