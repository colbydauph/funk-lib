'use strict';

const { expect } = require('chai');

const sync = require('../sync');
const async = require('../async');

describe('iterable', () => {
  
  xit('should have symetrical sync / async implementations', () => {
    expect(
      Object.keys(sync).length,
    ).to.eql(
      Object.keys(async).length,
    );
  });
  
});
