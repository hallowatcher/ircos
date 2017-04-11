
import * as React from 'react'
import { Tab } from '../../src/components/Tab'
import * as enzyme from 'enzyme';

describe('AddTab', function () {

  let component: enzyme.ShallowWrapper<any, any>
  let tabName, tabClick, closeTab, isActive, preventDefault
  beforeEach(function () {

    // Setup
    tabName = 'foo123'
    tabClick = jest.fn()
    closeTab = jest.fn()
    preventDefault = jest.fn()
    isActive = true

    component = enzyme.shallow(
      <Tab tabName={tabName} tabClick={tabClick} closeTab={closeTab} isActive={isActive} />
    )
  })

  it('should render', function () {
    expect(component).toMatchSnapshot()
  })

  it('should have clickable name div', function () {
    let name = component.find('div > div').first()
    expect(name.text()).toEqual(tabName)
    expect(name.props().onClick).toBeDefined()
  })

  it('should have clickable x to close', function () {
    let x = component.find('div > div').last()
    expect(x.text()).toEqual('×')
    expect(x.props().onClick).toBeDefined()
  })

  it('should render with inactive class', function () {
    component.setProps({ isActive: false })
    expect(component).toMatchSnapshot()
  })

  it('should call close handler', function () {
    component.find('div > div').last().simulate('click', { preventDefault })
    expect(closeTab).toHaveBeenCalledWith(tabName, { preventDefault })
  })

  it('should call click handler', function () {
    component.find('div > div').first().simulate('click', { preventDefault })
    expect(tabClick).toHaveBeenCalled()
  })

})