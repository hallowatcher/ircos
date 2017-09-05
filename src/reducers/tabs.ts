import { List, fromJS } from 'immutable';

export default function(state: List<any>, action: any) {
  switch (action.type) {
    case 'OPEN_CHANNEL':
      return addTab(state, action);
    case 'LEFT_CHANNEL':
      return removeTab(state, action);
    case 'TAB_MOVE':
      return moveTab(state, action);
  }

  return state;
}

function addTab(state: List<any>, action: any) {
  return state.push(action.payload);
}

function removeTab(state: List<any>, action: any) {
  return state.delete(state.indexOf(action.payload.channel));
}

function moveTab(state: List<any>, action: any) {
  const { to, from } = action.payload;

  const oldArray = state.toJS();
  const newArray = state.toJS();
  newArray[to] = oldArray[from];
  newArray[from] = oldArray[to];

  return fromJS(newArray);
}
