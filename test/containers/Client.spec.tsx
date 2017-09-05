import * as React from 'react';
import { Client } from '../../src/containers/Client';
import * as enzyme from 'enzyme';
import * as MockDate from 'mockdate';
import toJson from 'enzyme-to-json';

// Drag n Drop
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

describe('Client', function() {

  let component: enzyme.ShallowWrapper<any, any>;
  let datenow;
  const sendMessage = jest.fn();
  const userClicked = jest.fn();
  const DnDClient = DragDropContext(HTML5Backend)(Client);

  beforeEach(function() {
    datenow = 1262304000000;

    // Mock date
    MockDate.set(datenow);

    component = enzyme.shallow(
      <Client
        nick={''}
        channelLength={5}
        channels={[]}
        tabs={[]}
        closeChannel={jest.fn()}
        tabMove={jest.fn()}
        currentChannel={''}
        joinChannel={jest.fn()}
        makeCurrentChannel={jest.fn()}
        sendMessage={sendMessage}
        userId={1}
        messages={[]}
        openExternal={userClicked}
      />
    );
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should render', function() {
    expect(component).toMatchSnapshot();
  });

  it('should mount', function() {
    enzyme.mount(
      <DnDClient
        nick={''}
        channelLength={5}
        tabs={[]}
        closeChannel={jest.fn()}
        currentChannel={''}
        joinChannel={jest.fn()}
        makeCurrentChannel={jest.fn()}
        sendMessage={jest.fn()}
        userId={1}
        messages={[]}
        openExternal={jest.fn()}
      />
    );
  });

  it('should mount with userid = 0', function() {
    enzyme.mount(
      <DnDClient
        nick={''}
        channelLength={5}
        tabs={[]}
        closeChannel={jest.fn()}
        currentChannel={''}
        joinChannel={jest.fn()}
        makeCurrentChannel={jest.fn()}
        sendMessage={jest.fn()}
        userId={0}
        messages={[]}
        openExternal={jest.fn()}
      />
    );
  });

  it('should mount with channel tabs', function() {
    const mountedComponent = enzyme.mount(
      <DnDClient
        nick={''}
        tabs={['one', 'two']}
        channelLength={5}
        closeChannel={jest.fn()}
        currentChannel={''}
        joinChannel={jest.fn()}
        makeCurrentChannel={jest.fn()}
        sendMessage={jest.fn()}
        userId={1}
        messages={[]}
        openExternal={jest.fn()}
      />
    );

    expect(toJson(mountedComponent)).toMatchSnapshot();
  });

  it('should open join modal', function() {
    const props = component.find('AddTab').first().props() as any;
    props.clickAddTab();
    expect(component.state('showJoinModal')).toEqual(true);
  });

  it('should close join modal', function() {
    const props = component.find('JoinModal').first().props() as any;
    props.onClose();
    expect(component.state('showJoinModal')).toEqual(false);
  });

  it('should change message', function() {
    component.find('input[type="text"]').first()
      .simulate('change', { target: { value: 'changed' } });
    expect(component.state('msg')).toEqual('changed');
  });

  it('should send message', function() {
    component.find('input[type="text"]').first()
      .simulate('change', { target: { value: 'changed' } });
    component.find('form').first()
      .simulate('submit', { preventDefault() { /**/ } });
    expect(sendMessage).toHaveBeenCalledWith('', 'changed');
    expect(component.state('msg')).toEqual('');
  });

  it('should call user clicked with osu URL', function() {
    const props = component.find('ChatView').first().props() as any;
    props.userClicked('user');

    expect(userClicked).toHaveBeenCalledWith('http://osu.ppy.sh/u/user');
  });
});
