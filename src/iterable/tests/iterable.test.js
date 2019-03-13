// modules
import { expect } from 'chai';
import { chain, uniq } from 'ramda';

// local
import * as sync from '../sync';
import * as async from '../async';

const { keys } = Object;

describe('iterable', () => {
  
  it('should have symetrical sync / async implementations', () => {
    
    uniq(chain(keys, [sync, async])).forEach(key => {
      expect(typeof sync[key]).to.eql(
        typeof async[key],
        `Expected sync/${ key } to eql async/${ key }`
      );
      
    });
    
  });
  
});
