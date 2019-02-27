'use strict';

// modules
const { expect } = require('chai');

// local
const {
  capitalize,
  parseBase64,
  template,
  toBase64,
  slugify,
} = require('..');

describe('string lib', () => {

  describe('capitalize', () => {
    
    it('should capitalize first character', () => {
      expect(capitalize('test')).to.eql('Test');
    });
    
  });
  
  describe('toBase64', () => {
    
    it('should encode a string in base64', () => {
      expect(toBase64('test')).to.eql('dGVzdA==');
    });
    
  });
  
  describe('parseBase64', () => {
    
    it('should encode a string in base64', () => {
      expect(parseBase64('dGVzdA==')).to.eql('test');
    });
    
  });

  describe('template', () => {
    
    it('should interpolate variables', () => {
      const tmpl = 'The ${ animal } says ${ sound }${ other }!';
      const vars = {
        animal: 'cat',
        sound: 'meow',
      };
      expect(template(tmpl, vars)).to.eql('The cat says meow!');
    });
    
    it('should be curried', () => {
      expect(template('Hello, ${ name }')({ name: 'Sally' })).to.eql('Hello, Sally');
    });
    
  });
  
  describe('slugify', () => {
    
    it('should slugify a string', () => {
      expect(slugify('! SOME 0reall1y W-ei...rd string  999*    '))
        .to.eql('some-0reall1y-w-ei-rd-string-999');
    });
    
  });

});
