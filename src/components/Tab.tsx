
import * as React from 'react';

interface IProps {
  tabName: string;
  tabClick: (name: string) => void;
  closeTab: (name: string) => void;
  isActive: boolean;
}

const xStyle: React.CSSProperties = {
  padding: '0 10px',
  margin: '0 0 0 10px',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 400
};

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
};

const divStyleActive: React.CSSProperties = {
  ...divStyle,
  backgroundColor: 'rgba(255, 255, 255, 0.3)'
};

export class Tab extends React.Component<IProps, null> {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleMiddleClick = this.handleMiddleClick.bind(this);
  }

  public render() {
    return (
      <div onMouseDown={this.handleMiddleClick} style={this.props.isActive ? divStyleActive : divStyle}>
        <div
          onClick={this.handleClick}
          style={{ transform: 'skew(15deg)' }}
        >{this.props.tabName}
        </div>
        <div onClick={this.props.closeTab.bind(this, this.props.tabName)} style={xStyle}>&times;</div>
      </div>
    );
  }
  private handleMiddleClick(event) {
    const type = event.nativeEvent.which;
    if (type !== 2) { return; }
    this.props.closeTab(this.props.tabName);
  }

  private handleClick(event) {
    this.props.tabClick(this.props.tabName);
  }
}
