
import * as React from 'react';

type Props = {
  tabName: string,
  tabClick: () => void,
  closeTab: () => void,
  isActive: boolean
}

const xStyle: React.CSSProperties = {
  padding: '0 10px',
  margin: '0 0 0 10px',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 400
}

const divStyle: React.CSSProperties = {
  padding: '0 0 0 10px',
  margin: '0 2px',
  display: 'flex',
  height: 25,
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  fontWeight: 800,
  color: 'white',
  transform: 'skew(-15deg)',
  boxSizing: 'border-box',
  WebkitUserSelect: 'none'
}

const divStyleActive: React.CSSProperties = {
  ...divStyle,
  backgroundColor: 'rgba(255, 255, 255, 0.3)'
}

export class Tab extends React.Component<Props, null> {
  render() {
    return (
      <div style={this.props.isActive ? divStyleActive : divStyle}>
        <div onClick={this.props.tabClick.bind(this, this.props.tabName)} style={ { transform: 'skew(15deg)' } }>{this.props.tabName}</div>
        <div onClick={this.props.closeTab.bind(this, this.props.tabName)} style={xStyle}>&times;</div>
      </div>
    )
  }
}