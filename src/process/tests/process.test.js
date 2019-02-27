'use strict';

// modules
const sinon = require('sinon');
const { expect } = require('chai');

// local
const { onSigInt } = require('..');

describe('process lib', () => {
  
  describe('onSigInt', () => {
    
    let handler;
    beforeEach('', () => {
      handler = sinon.stub();
      sinon.stub(process, 'on');
      sinon.stub(process, 'removeListener');
    });
    
    afterEach('', () => {
      process.on.restore();
      process.removeListener.restore();
    });
    
    it('should register the handler with SIGINT', () => {
      onSigInt(handler);
      expect(process.on.args[0][0]).to.equal('SIGINT');
      expect(process.on.args[0][1]).to.equal(handler);
    });
    
    it('should return a de-register function', () => {
      const offSigInt = onSigInt(handler);
      expect(process.removeListener.callCount).to.equal(0);
      offSigInt();
      expect(process.removeListener.args[0][0]).to.equal('SIGINT');
      expect(process.removeListener.args[0][1]).to.equal(handler);
    });
    
  });
    
});
