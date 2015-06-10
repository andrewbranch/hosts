var assert = require('assert'),
    Entry = require('../../src/lib/entry');
    
describe('Entry', function() {
  describe('contructor', function() {
    
    var entry;
    beforeEach(function() {
      entry = new Entry('10.0.0.1', 'api.local', '10.0.0.1 api.local # comment')
    });
    
    it('should assign first parameter to ip property', function() {
      assert.equal(entry.ip, '10.0.0.1');
    });
    
    it('should assign second parameter to hostname property', function() {
      assert.equal(entry.hostname, 'api.local');
    });
    
    it('should store trailing string in tail property', function() {
      assert.equal(entry.tail, ' # comment');
    });
  });
  
  describe('toString', function() {
    
    it('should return the IP address and hostname separated by a space', function() {
      var entry = new Entry('10.0.0.1', 'api.local', '10.0.0.1 api.local');
      entry.ip = '127.0.0.1';
      entry.hostname = 'native.local';
      assert.equal(entry.toString(), '127.0.0.1 native.local');
    });
    
    it('should append a trailing comment if it was originally present', function() {
      var entry = entry = new Entry('10.0.0.1', 'api.local', '10.0.0.1 api.local # comment');
      entry.ip = '127.0.0.1';
      entry.hostname = 'native.local';
      assert.equal(entry.toString(), '127.0.0.1 native.local # comment');
    });
  });
});