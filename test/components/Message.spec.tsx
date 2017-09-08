
import * as React from 'react';
import { Message } from '../../src/components/Message';
import * as enzyme from 'enzyme';
import * as moment from 'moment';
import { MessageType } from '../../src/models';

describe('Message', function() {

  let component: enzyme.ShallowWrapper<any, any>;
  let user;
  let message;
  const userClicked = jest.fn();

  beforeEach(function() {
    user = 'foo123';
    message = 'bar456';
    component = enzyme.shallow(
      <Message
        nick={user}
        text={message}
        date={moment.utc('2017-01-01T00:00:00.000Z')}
        type={MessageType.message}
        userClicked={userClicked}
      />
    );
  });

  it('should render as regular', function() {
    expect(component).toMatchSnapshot();
  });

  it('should render as self', function() {
    component.setProps({ type: MessageType.self });
    expect(component).toMatchSnapshot();
  });

  it('should render as system', function() {
    component.setProps({ type: MessageType.system });
    expect(component).toMatchSnapshot();
  });

  it('should call user clicked', function() {
    component.find('span').at(1).simulate('click');
    expect(userClicked).toHaveBeenCalledWith(user);
  });
});
