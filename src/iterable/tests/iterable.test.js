'use strict';

const { expect } = require('chai');

const sync = require('../sync');
const async = require('../async');

describe('iterable', () => {
  
  xit('should have symetrical sync / async implementations', () => {
    expect(Object.keys(sync)).to.eql(Object.keys(async));
  });
  
});
