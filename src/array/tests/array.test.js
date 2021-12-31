// modules
import { expect } from 'chai';
import * as R from 'ramda';

// local
import {
  clear,
  clone,
  toObjBy,
  toObj,
  sample,
  shuffle,
} from '..';

describe('array lib', () => {
  
  describe('clear', () => {
    
    it('should remove all items', () => {
      const arr = [1, 2, 3];
      clear(arr);
      expect(arr).to.eql([]);
    });
    
    it('should return the input', () => {
      const arr = [1, 2, 3];
      expect(clear(arr)).to.equal(arr);
    });
    
  });
  
  
  describe('clone', () => {
    
    let arr, cloned;
    beforeEach(() => {
      arr = R.range(0, 100);
      cloned = clone(arr);
    });
    
    it('should contain the same elements', () => {
      expect(arr).to.eql(cloned);
    });
    
    it('should copy into a new array', () => {
      expect(arr === cloned).to.eql(false);
    });
    
    it('should not clone items', () => {
      arr.forEach((item, i) => {
        expect(arr[i] === cloned[i]).to.eql(true);
      });
    });
    
  });
  
  describe('toObj', () => {
    
    it('should key obj by index', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const expected = {
        0: arr[0],
        1: arr[1],
        2: arr[2],
      };
      expect(toObj(arr)).to.eql(expected);
    });
    
  });
  
  describe('toObjBy', () => {
    
    it('should key obj by pred', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const pred = ({ id }) => id;
      const expected = {
        1: arr[0],
        2: arr[1],
        3: arr[2],
      };
      expect(toObjBy(pred, arr)).to.eql(expected);
    });
    
  });
  
  describe('sample', () => {
    
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
  
  describe('shuffle', () => {
    
    it('should shuffle the array values', () => {
      const arr = [...Array(100)].map((_, i) => i);
      const shuffled = shuffle(arr);
      
      const sorted = R.sortBy(R.identity, shuffled);
      const sameOrder = shuffled.every((val, i) => {
        return (val === arr[i]);
      });
      
      expect(sameOrder).to.eql(false);
      expect(sorted).to.eql(arr);
    });
    
    it('should not mutate the input array', () => {
      const arr = [1, 2, 3, 4, 5];
      const copy = [...arr];
      shuffle(arr);
      
      expect(arr).to.eql(copy);
    });
    
  });
    
});
