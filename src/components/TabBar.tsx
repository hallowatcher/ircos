
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tab from './Tab';
import { AddTab } from './AddTab';
import * as FlipMove from 'react-flip-move';

interface IProps {
  tabs: string[];
  currentChannel: string;

  tabClick: (name: string) => void;
  tabMove: (from: number, to: number) => void;
  tabClose: (name: string) => void;
  tabAdd: () => void;
}

const style: React.CSSProperties = {
  flexGrow: 1,
  padding: '0 5px',
  display: 'flex',
  overflowY: 'hidden',
  overflowX: 'auto',
  alignItems: 'flex-end'
};

export class TabBar extends React.Component<IProps, any> {

  public render() {
    const channelMap = this.props.tabs.map((channel, index) =>
    (
      <Tab
        key={channel}
        ref={channel}
        index={index}
        tabName={channel}
        tabClick={this.props.tabClick}
        tabMove={this.props.tabMove}
        closeTab={this.props.tabClose}
        isActive={this.props.currentChannel === channel}
      />
    )
    );

    return (
      <FlipMove style={style} duration={125} easing="ease-out">
        {channelMap}
        <AddTab clickAddTab={this.props.tabAdd} key="add" ref="add" />
      </FlipMove>
    );
  }
}
