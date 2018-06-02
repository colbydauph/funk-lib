'use strict';

// modules
const { expect } = require('chai');

// local
const { toObjWith, sample } = require('..');

describe('array lib', () => {
  
  describe('toObjWith()', () => {
    
    it('should key obj by pred', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const pred = ({ id }) => id;
      const expected = {
        1: arr[0],
        2: arr[1],
        3: arr[2],
      };
      expect(toObjWith(pred, arr)).to.eql(expected);
    });
    
  });
  
  describe('sample()', () => {
    
    it('should select items from the array', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      const choices = [...Array(1000)].map(() => sample(arr));
      choices.forEach((choice) => {
        expect(arr).to.include(choice);
      });
      arr.forEach((item) => {
        expect(choices).to.include(item);
      });
    });
    
  });
    
});