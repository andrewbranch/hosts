var assert = require('assert'),
    parseLine = require('../../src/lib/parse-line'),
    Entry = require('../../src/lib/entry');
    
describe('parseLine', function() {
  it('should return the input string for a comment line', function() {
    assert.equal(parseLine('# comment'), '# comment');
    assert.equal(parseLine(' # comment'), ' # comment');
    assert.equal(parseLine('\t#comment'), '\t#comment');
    assert.equal(parseLine('# 127.0.0.1 commented.out'), '# 127.0.0.1 commented.out');
  });
  
  it('should return the input string for whitespace', function() {
    assert.equal(parseLine(' '), ' ');
    assert.equal(parseLine('   '), '   ');
    assert.equal(parseLine('\t \t'), '\t \t');
  });
  
  it('should return the input string for empty line', function() {
    assert.equal(parseLine(''), '');
  });
  
  it('should return an Entry for valid entry line', function() {
    assert.ok(parseLine('127.0.0.1 api.local') instanceof Entry);
  });
  
  it('should create the Entry with the parsed IP and hostname', function() {
    var entry = parseLine('127.0.0.1 api.local');
    assert.equal(entry.ip, '127.0.0.1');
    assert.equal(entry.hostname, 'api.local');
  });
  
  it('should be whitespace agnostic', function() {
    var entry = parseLine(' \t127.0.0.1\tapi.local\t\t  ');
    assert.equal(entry.ip, '127.0.0.1');
    assert.equal(entry.hostname, 'api.local');
  });
});