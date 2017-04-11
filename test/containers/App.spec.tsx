import * as React from 'react'
import { App } from '../../src/containers/App'
import * as enzyme from 'enzyme'

describe('Client', function () {

  let component: enzyme.ShallowWrapper<any, any>
  let connected: boolean
  beforeEach(function () {

    component = enzyme.shallow(
      <App connected={connected} />
    )
  })

  it('should render with login screen', function () {
    expect(component).toMatchSnapshot()
  })

  it('should render with client screen', function () {
    component.setProps({ connected: true })
    expect(component).toMatchSnapshot()
  })

})