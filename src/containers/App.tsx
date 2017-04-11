import * as React from 'react';
import { connect } from 'react-redux';

import Login from './Login';
import Client from './Client';

type StateProps = {
  connected: boolean
}

export class App extends React.Component<StateProps, any> {

  render() {
    if (!this.props.connected) {
      return <Login />
    }

    return <Client />
  }
}

/* istanbul ignore next */
function stateToProps(state: any): StateProps {
  return {
    connected: !!state.getIn(['serverInfo', 'connected'])
  }
}

/* istanbul ignore next */
export default connect<StateProps, any, any>(stateToProps)(App);