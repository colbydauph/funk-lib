'use strict';

const { expect } = require('chai');

const safeToString = (thing) => ((typeof thing === 'symbol')
  ? thing.toString()
  : thing);

/* istanbul ignore next */
module.exports = ({
  name,
  func,
  pass = [],
  fail = [],
  spread = false,
}) => {
  describe(name, () => {
    it('should return true for all expected pass values', () => {
      pass.forEach((pass) => {
        const safe = safeToString(pass);
        pass = spread ? pass : [pass];
        expect(func(...pass)).to.eql(true, `expected ${ name }(${ safe }) to equal ${ true }`);
      });
    });
    
    it('should return false for all expected fail values', () => {
      fail.forEach((fail) => {
        const safe = safeToString(fail);
        fail = spread ? fail : [fail];
        expect(func(...fail)).to.eql(false, `expected ${ name }(${ safe }) to equal ${ false }`);
      });
    });
    
  });
};
