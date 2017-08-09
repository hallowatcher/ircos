
import * as React from 'react';
import { ChatView } from '../../src/components/ChatView';
import * as enzyme from 'enzyme';
import * as moment from 'moment';
import toJson from 'enzyme-to-json';

describe('ChatView', function() {
  let component: enzyme.ReactWrapper<any, any>;

  beforeEach(function() {
    component = enzyme.mount(
      <ChatView
        messages={[]}
        selfNick='nick'
      />
    );
  });

  it('should render', function() {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render messages', function() {
    component.setProps({ messages: [{ name: 'name', text: 'text', date: moment.utc('2017-01-01T00:00:00.000Z') }] });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render message as self', function() {
    component.setProps({ messages: [{ name: 'nick', text: 'text', date: moment.utc('2017-01-01T00:00:00.000Z') }] });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render message as system', function() {
    component.setProps({ messages: [{ name: 'System', text: 'text', date: moment.utc('2017-01-01T00:00:00.000Z') }] });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should not scroll to bottom', function() {
    const instance = component.instance() as any;
    instance.refs.container = { scrollTop: 0, scrollHeight: 100, clientHeight: 0 };
    component.setProps({ messages: [{ name: 'nick', text: 'text', date: moment.utc('2017-01-01T00:00:00.000Z') }] });
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should return when no container', function() {
    const instance = component.instance() as any;
    instance.refs.container = undefined;
    instance.scrollAtBottom = false;
    component.setProps({ messages: [{ name: 'nick', text: 'text', date: moment.utc('2017-01-01T00:00:00.000Z') }] });
  });
});
