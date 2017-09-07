
import * as React from 'react';
import Tab from '../../src/components/Tab';
import * as enzyme from 'enzyme';
import toJson from 'enzyme-to-json';

// Drag n Drop
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

describe('AddTab', function() {

  let component: enzyme.ReactWrapper<any, any>;
  let tabName;
  let tabClick;
  let tabMove;
  let closeTab: jest.Mock<{}>;
  let isActive;
  let preventDefault;
  let isDragging;

  const DnDTab = DragDropContext(HTML5Backend)(Tab);

  beforeEach(function() {

    // Setup
    tabName = 'foo123';
    tabClick = jest.fn();
    tabMove = jest.fn();
    closeTab = jest.fn();
    preventDefault = jest.fn();
    isActive = true;
    isDragging = false;

    component = enzyme.mount(
      <DnDTab
        tabMove={tabMove}
        index={1}
        tabName={tabName}
        tabClick={tabClick}
        closeTab={closeTab}
        isActive={isActive}
        isDragging={isDragging}
      />
    );
  });

  it('should render', function() {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should have clickable name div', function() {
    const name = component.find('div > div').first();
    expect(name.text()).toEqual(tabName);
    expect(name.props().onClick).toBeDefined();
  });

  it('should have clickable x to close', function() {
    const x = component.find('div > div').last();
    expect(x.text()).toEqual('×');
    expect(x.props().onClick).toBeDefined();
  });

  it('should render with inactive class', function() {
    component.setProps({ isActive: false });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should call close handler', function() {
    component.find('div > div').last().simulate('click', { preventDefault });
    expect(closeTab.mock.calls[0][0]).toBe(tabName);
  });

  it('should call click handler', function() {
    component.find('div > div').first().simulate('click', { preventDefault });
    expect(tabClick).toHaveBeenCalled();
  });

  it('should close tab on middle click handler', function() {
    component.find('div').first().simulate('mousedown', { preventDefault, nativeEvent: { which: 2 } });
    expect(closeTab).toHaveBeenCalled();
  });

  it('should not close tab', function() {
    component.find('div').first().simulate('mousedown', { preventDefault, nativeEvent: { which: 1 } });
    expect(closeTab).toHaveBeenCalledTimes(0);
  });
});
