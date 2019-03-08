// modules
import sinon from 'sinon';
import { expect } from 'chai';

// local
import { onSigInt } from '..';


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
