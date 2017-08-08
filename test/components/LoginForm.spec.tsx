
import * as React from 'react'
import { LoginForm } from '../../src/components/LoginForm'
import * as enzyme from 'enzyme';

describe('AddTab', function () {
  
  let component: enzyme.ShallowWrapper<any, any>
  let submitLogin: any
  beforeEach(function () {
    submitLogin = jest.fn()
    component = enzyme.shallow(<LoginForm submitLogin={submitLogin} error={null} />)
  })

  it('should render', function () {
    expect(component).toMatchSnapshot()
  })

  it('should render with error', function () {
    component = enzyme.shallow(<LoginForm submitLogin={submitLogin} error={'Error'} />)
    expect(component).toMatchSnapshot()
  })

  it('should have an onSubmit prop', function () {
    expect(component.props().onSubmit).toBeDefined()
  })

  it('should submit the right credentials', function () {
    component.find('input[name="user"]').simulate('change', { target: { name: 'user', value: 'foo123' } })
    component.find('input[name="pass"]').simulate('change', { target: { name: 'pass', value: 'bar456' } })
    component.simulate('submit', { preventDefault() {} })
    expect(submitLogin).toBeCalledWith('foo123', 'bar456')
  })

  it('should not submit because credentials aren\'t set', function () {
    component.simulate('submit', { preventDefault() {} })
    expect(submitLogin).toHaveBeenCalledTimes(0)
  })

  it('should not submit credentials because username isn\'t set', function () {
    component.find('input[name="pass"]').simulate('change', { target: { name: 'pass', value: 'bar456' } })
    component.simulate('submit', { preventDefault() {} })
    expect(submitLogin).toHaveBeenCalledTimes(0)
  })

  it('should not submit credentials because password isn\'t set', function () {
    component.find('input[name="user"]').simulate('change', { target: { name: 'user', value: 'foo123' } })
    component.simulate('submit', { preventDefault() {} })
    expect(submitLogin).toHaveBeenCalledTimes(0)
  })

})