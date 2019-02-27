// modules
import { expect } from 'chai';

// local
import { uuid, isUuid } from '..';


describe('uuid lib', () => {
  
  describe('isUuid', () => {
    
    const VALID_UUIDS = [
      '9ffbde63-ac50-473b-8472-0653b7597286',
      'c43531df-27ba-4a83-b93f-3cf9349129fc',
      '3f43913d-0740-4035-be68-25ab8a670a78',
      'b3a08f17-0a8a-4bd0-b90f-6b59b21fa9f9',
      'a94e5bb0-1f72-4f06-8bba-4e136e8ddc7b',
      '50eb9377-f4ba-4d91-829e-ba105fe01c4c',
    ];
    const INVALID_UUIDS = [
      'qffbde63-ac50-473b-8472-0653b7597286',
      '-0eb9377-f4ba-4d91-829e-ba105fe01c4c',
      '50eb9377--f4ba-4d91-829e-ba105fe01c4',
      '50eb9377-f4ba-4d91-829e-ba105fe01c4cd',
      '50eb9377-f4ba-4d91-ba105fe01c4c',
      '',
    ];
    
    it('should return true for valid uuids', () => {
      VALID_UUIDS.forEach((uuid) => {
        expect(isUuid(uuid)).to.eql(true);
      });
    });
    
    it('should return false for invalid uuids', () => {
      INVALID_UUIDS.forEach((uuid) => {
        expect(isUuid(uuid)).to.eql(false);
      });
    });
    
  });
  
  describe('uuid', () => {
    
    it('should generate a random + valid uuid', () => {
      [...Array(1000)].reduce((uuids) => {
        const randomUuid = uuid();
        expect(isUuid(randomUuid)).to.eql(true);
        expect(uuids.includes(randomUuid)).to.eql(false);
        return [...uuids, randomUuid];
      }, []);
    });
    
  });
    
});
