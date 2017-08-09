
import * as React from 'react';
import { AddTab } from '../../src/components/AddTab';
import * as enzyme from 'enzyme';

describe('AddTab', function() {

  let component: enzyme.ShallowWrapper<any, any>;
  let clickAddTab: any;
  beforeEach(function() {
    clickAddTab = jest.fn();
    component = enzyme.shallow(<AddTab clickAddTab={clickAddTab} />);
  });

  it('should render', function() {
    expect(component).toMatchSnapshot();
  });

  it('should have an onClick prop', function() {
    expect(component.props().onClick).toBeDefined();
  });

  it('should call prop on click', function() {
    component.simulate('click');
    expect(clickAddTab).toHaveBeenCalled();
  });
});
