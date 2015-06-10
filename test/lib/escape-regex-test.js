var assert = require('assert'),
    escapeRegex = require('../../src/lib/escape-regex');
    
describe('escapeRegex', function() {
  it('escapes dots', function() {
    var escaped = escapeRegex('a.b.com');
    assert.equal(escaped, 'a\\.b\\.com');
  });
});
