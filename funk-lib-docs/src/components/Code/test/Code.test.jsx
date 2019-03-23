// modules
import React, { PureComponent } from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// import sinon from 'sinon';

// local
import Code from '..';

describe('<Code />', () => {
  
  let props, code;
  beforeEach('instantiate', () => {
    props = {
      children: 'const a = 1;',
      lang: 'javascript',
      className: 'some-test-class',
    };
    code = shallow(<Code { ...props } />);
  });
  
  it('should be a PureComponent', () => {
    expect(Code.prototype).to.be.an.instanceOf(PureComponent);
  });
  
  it('should default props', () => {
    expect(Code.defaultProps.children).to.eql('');
  });
  
  it('should render a <pre />', () => {
    expect(code.type()).to.eql('pre');
  });
  
  it('should render children inside of <pre />', () => {
    expect(code.contains(props.children)).to.eql(true);
  });

  it('should pass classNames', () => {
    const { className } = code.props();
    expect(className.includes(props.className)).to.eql(true);
  });
  
  it('should JSON serialize objects', () => {
    const obj = { a: 1 };
    code = shallow(<Code { ...props } children={ obj } inline={ false } />);
    expect(code.props().children).to.eql(JSON.stringify(obj, null, 2));
  });
    
});
