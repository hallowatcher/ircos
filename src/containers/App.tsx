import * as React from 'react';
import { connect } from 'react-redux';

// Drag n Drop
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Login from './Login';
import Client from './Client';

interface IStateProps {
  connected: boolean;
}

export class App extends React.Component<IStateProps, any> {

  public render() {
    if (!this.props.connected) {
      return <Login />;
    }

    return <Client />;
  }
}

/* istanbul ignore next */
function stateToProps(state: any): IStateProps {
  return {
    connected: !!state.getIn(['serverInfo', 'connected'])
  };
}

/* istanbul ignore next */
export default connect<IStateProps, any, any>(stateToProps)(DragDropContext(HTML5Backend)(App));
