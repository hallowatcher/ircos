
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  DragSource,
  DropTarget,
  DropTargetSpec,
  DragSourceSpec,
  DragSourceCollector,
  DropTargetCollector
} from 'react-dnd';
import { flow } from 'lodash';

interface IProps {
  index: number;
  tabName: string;
  tabClick: (name: string) => void;
  tabMove: (from: number, to: number) => void;
  closeTab: (name: string) => void;
  isActive: boolean;

  // Drag
  connectDragSource?: any;
  connectDropTarget?: any;
  isDragging?: boolean;
  isOver?: boolean;
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
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  fontWeight: 800,
  color: 'white',
  boxSizing: 'border-box',
  WebkitUserSelect: 'none'
};

const divStyleActive: React.CSSProperties = {
  ...divStyle,
  backgroundColor: 'rgba(255, 255, 255, 0.3)'
};

const divStyleDragging: React.CSSProperties = {
  outline: 'white dashed 1px'
};

const tabSource: DragSourceSpec<IProps> = {
  beginDrag(props) {
    return {
      name: props.tabName,
      index: props.index
    };
  }
};

const tabTarget: DropTargetSpec<IProps> = {
  hover(props, monitor, component) {
    const dragIndex = (monitor.getItem() as any).index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

    // Get horizontal middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the left
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging left
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    // Dragging right
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }

    // Time to actually perform the action
    props.tabMove(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    (monitor.getItem() as any).index = hoverIndex;
  }
};

let collectDrag: DragSourceCollector;
collectDrag = function(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

let collectDrop: DropTargetCollector;
collectDrop = function(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
};

class Tab extends React.Component<IProps, null> {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleMiddleClick = this.handleMiddleClick.bind(this);
  }

  public render() {
    const { connectDragSource, connectDropTarget, isDragging, isActive } = this.props;
    return connectDragSource(connectDropTarget(
      <div
        onMouseDown={this.handleMiddleClick}
        style={{...(isDragging ? divStyleDragging : {}), ...(isActive ? divStyleActive : divStyle)}}
      >
        <div
          onClick={this.handleClick}
        >{this.props.tabName}
        </div>
        <div onClick={this.props.closeTab.bind(this, this.props.tabName)} style={xStyle}>&times;</div>
      </div>
    ));
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

export default flow(
  DragSource('tab', tabSource, collectDrag),
  DropTarget('tab', tabTarget, collectDrop)
)(Tab);
