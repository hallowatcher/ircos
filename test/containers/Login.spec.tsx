import * as React from 'react'
import { Login } from '../../src/containers/Login'
import * as enzyme from 'enzyme';

describe('Login', function () {

  let component: enzyme.ShallowWrapper<any, any>
  let createConnection: jest.Mock<any>
  beforeEach(function () {
    createConnection = jest.fn()
    component = enzyme.shallow(
    <Login createConnection={createConnection} error={null} />)
  })

  it('should render', function () {
    expect(component).toMatchSnapshot()
  })

})