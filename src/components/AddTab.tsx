
import * as React from 'react';

interface IProps {
  clickAddTab: () => void;
}

const divStyle: React.CSSProperties = {
  padding: '10px',
  margin: '0 2px',
  display: 'flex',
  height: 25,
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: 'rgb(241, 196, 15)',
  fontWeight: 800,
  color: 'white',
  boxSizing: 'border-box',
  WebkitUserSelect: 'none'
};

export class AddTab extends React.Component<IProps, any> {
  public render() {
    return (
      <div style={divStyle} onClick={this.props.clickAddTab}>+</div>
    );
  }
}
