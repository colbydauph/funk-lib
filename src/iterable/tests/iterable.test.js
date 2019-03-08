// modules
import { expect } from 'chai';

// local
import sync from '../sync';
import async from '../async';

describe('iterable', () => {
  
  xit('should have symetrical sync / async implementations', () => {
    expect(Object.keys(sync)).to.eql(Object.keys(async));
  });
  
});
