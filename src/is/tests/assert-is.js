// modules
import { expect } from 'chai';
import * as R from 'ramda';


const safeToString = thing => ((typeof thing === 'symbol')
  ? thing.toString()
  : thing);

module.exports = (name, {
  func,
  pass: passes,
  fail: fails,
  spread = false,
}) => {
  
  describe(name, () => {
    
    R.defaultTo([], passes).forEach((pass) => {
      const safe = safeToString(pass);
      
      it(`should return true for: ${ safe }`, () => {
        pass = spread ? pass : [pass];
        expect(func(...pass)).to.eql(true, `expected ${ name }(${ safe }) to equal ${ true }`);
      });
    });
      
    R.defaultTo([], fails).forEach((fail) => {
      const safe = safeToString(fail);
      
      it(`should return false for: ${ safe }`, () => {
        fail = spread ? fail : [fail];
        expect(func(...fail)).to.eql(false, `expected ${ name }(${ safe }) to equal ${ false }`);
      });
    });
    
  });
  
};
