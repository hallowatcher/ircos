import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

// Middleware
import thunk from 'redux-thunk';
import * as logger from 'redux-logger';

import App from './containers/App';
import Reducers, { initialState } from './reducers';

import { Iterable } from 'immutable';

const stateTransformer = (state: any) => {
  if (Iterable.isIterable(state)) return state.toJS();
  else return state;
};

const predicate = (getState: any, action: any) => {
  if (action.type === 'RECEIVED_MESSAGE')
    return false;
  return true;
}

const store = createStore( Reducers, initialState, applyMiddleware( thunk, logger({ stateTransformer, predicate }) ) );

export function render() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
}

render()
