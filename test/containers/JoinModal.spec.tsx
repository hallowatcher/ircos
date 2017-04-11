import * as React from 'react'
import { JoinModal } from '../../src/containers/JoinModal'
import * as enzyme from 'enzyme';

describe('JoinModal', function () {

  let component: enzyme.ShallowWrapper<any, any>
  let isOpen: boolean
  let joinChannel: jest.Mock<any>
  let onClose: jest.Mock<any>
  beforeEach(function () {
    isOpen = false
    joinChannel = jest.fn()
    onClose = jest.fn()
    component = enzyme.shallow(
    <JoinModal isOpen={isOpen} joinChannel={joinChannel} onClose={onClose} />)
  })

  it('should render', function () {
    expect(component).toMatchSnapshot()
  })

  it('should join the right channel', function () {
    component.find('input').first().simulate('change', { target: { value: 'foo123' } })
    component.find('form').first().simulate('submit', { preventDefault() {} })
    expect(joinChannel).toHaveBeenCalledWith('foo123')
    expect(onClose).toHaveBeenCalled()
  })

  it('should not fire join channel', function () {
    component.find('form').first().simulate('submit', { preventDefault() {} })
    expect(joinChannel).toHaveBeenCalledTimes(0)
  })

})