// modules
import { expect } from 'chai';

// local
import { now } from '..';

describe('datetime lib', () => {
  
  describe('now', () => {
    
    it('should return the current epoch in ms', () => {
      const delta = now() - Date.now();
      expect(delta).to.be.lessThan(5);
    });
    
  });
    
});
