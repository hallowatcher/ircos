import * as React from 'react'
import { Client } from '../../src/containers/Client'
import * as enzyme from 'enzyme'
import * as MockDate from 'mockdate'

describe('Client', function () {

  let component: enzyme.ShallowWrapper<any, any>
  let datenow
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
        sendMessage={jest.fn()}
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

    mountedComponent.instance()['messagesEnd'] = {
      scrollIntoView: jest.fn()
    }

    mountedComponent.update()
  })

})