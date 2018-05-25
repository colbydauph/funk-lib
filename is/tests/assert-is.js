'use strict';

const { expect } = require('chai');

module.exports = ({
  name,
  func,
  pass,
  fail,
  spread = false,
}) => {
  describe(name, () => {
    it('should return true for all expected pass values', () => {
      pass.forEach((pass) => {
        pass = spread ? pass : [pass];
        expect(func(...pass)).to.eql(true, `expected ${ name }(${ pass }) to equal ${ true }`);
      });
    });
    
    it('should return false for all expected fail values', () => {
      fail.forEach((fail) => {
        fail = spread ? fail : [fail];
        expect(func(...fail)).to.eql(false, `expected ${ name }(${ fail }) to equal ${ false }`);
      });
    });
    
  });
};
