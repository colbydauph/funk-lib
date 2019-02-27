// core
import stream from 'stream';

// modules
import { expect } from 'chai';

// local
import { fromString, toString } from '..';


const { Readable: ReadableStream } = stream;

describe('stream lib', () => {
  
  const text = 'test-string';
  let stream;
  beforeEach(() => {
    stream = fromString(text);
  });
  
  describe('toString', () => {
    
    it('should return a promise', async () => {
      expect(toString(stream)).to.be.a('promise');
    });
    
    it('should resolve the correct text', async () => {
      const outputText = await toString(stream);
      expect(outputText).to.equal(text);
    });
    
  });
  
  describe('fromString', () => {
    
    it('should return a stream', async () => {
      expect(fromString(text)).to.be.an.instanceOf(ReadableStream);
    });
    
    it('should push the text into the stream', async () => {
      const outputText = await toString(await fromString(text));
      expect(outputText).to.equal(text);
    });
    
  });
      
});
