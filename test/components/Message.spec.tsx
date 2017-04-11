
import * as React from 'react'
import { Message, UserType } from '../../src/components/Message'
import * as enzyme from 'enzyme';
import * as moment from 'moment';

describe('Message', function () {

  let component: enzyme.ShallowWrapper<any, any>
  let user, message
  beforeEach(function () {
    user = 'foo123'
    message = 'bar456'
    component = enzyme.shallow(
      <Message user={user} message={message} sentDate={moment.utc('2017-01-01T00:00:00.000Z')} />
    )
  })

  it('should render as regular', function () {
    expect(component).toMatchSnapshot()
  })

  it('should render as moderator', function () {
    component.setProps({ userType: UserType.moderator })
    expect(component).toMatchSnapshot()
  })

  it('should render as self', function () {
    component.setProps({ userType: UserType.self })
    expect(component).toMatchSnapshot()
  })

})