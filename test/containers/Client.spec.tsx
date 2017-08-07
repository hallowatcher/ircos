import * as React from 'react'
import { Client } from '../../src/containers/Client'
import * as enzyme from 'enzyme'
import * as MockDate from 'mockdate'
import toJson from 'enzyme-to-json'

describe('Client', function () {

  let component: enzyme.ShallowWrapper<any, any>
  let datenow
  let sendMessage = jest.fn()
  beforeEach(function () {
    datenow = 1262304000000;

    // Mock date
    MockDate.set(datenow)

    component = enzyme.shallow(
      <Client 
        nick={''}
        channelLength={5}
        channels={[]}
        closeChannel={jest.fn()}
        currentChannel={''}
        joinChannel={jest.fn()}
        makeCurrentChannel={jest.fn()}
        sendMessage={sendMessage}
        userId={1}
        messages={[]}
      />
    )
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should render', function () {
    expect(component).toMatchSnapshot()
  })

  it('should mount', function () {
    let mountedComponent = enzyme.mount(
      <Client 
        nick={''}
        channelLength={5}
        channels={[]}
        closeChannel={jest.fn()}
        currentChannel={''}
        joinChannel={jest.fn()}
        makeCurrentChannel={jest.fn()}
        sendMessage={jest.fn()}
        userId={1}
        messages={[]}
      />
    )
  })

  it('should mount with userid = 0', function () {
    let mountedComponent = enzyme.mount(
      <Client 
        nick={''}
        channelLength={5}
        channels={[]}
        closeChannel={jest.fn()}
        currentChannel={''}
        joinChannel={jest.fn()}
        makeCurrentChannel={jest.fn()}
        sendMessage={jest.fn()}
        userId={0}
        messages={[]}
      />
    )
  })

  it('should mount with channel tabs', function () {
    let mountedComponent = enzyme.mount(
      <Client 
        nick={''}
        channelLength={5}
        channels={['one', 'two']}
        closeChannel={jest.fn()}
        currentChannel={''}
        joinChannel={jest.fn()}
        makeCurrentChannel={jest.fn()}
        sendMessage={jest.fn()}
        userId={1}
        messages={[]}
      />
    )

    expect(toJson(mountedComponent)).toMatchSnapshot();
  })

  it('should open join modal', function () {
    component.find('AddTab').first().props()['clickAddTab']();
    expect(component.state('showJoinModal')).toEqual(true);
  })

  it('should close join modal', function () {
    component.find('JoinModal').first().props()['onClose']();
    expect(component.state('showJoinModal')).toEqual(false);
  })

  it('should change message', function () {
    component.find('input[type="text"]').first()
      .simulate('change', { target: { value: 'changed' } })
    expect(component.state('msg')).toEqual('changed')
  })

  it('should send message', function () {
    component.find('input[type="text"]').first()
      .simulate('change', { target: { value: 'changed' } })
    component.find('form').first()
      .simulate('submit', { preventDefault() {} })
    expect(sendMessage).toHaveBeenCalledWith('', 'changed')
    expect(component.state('msg')).toEqual('')
  })

})