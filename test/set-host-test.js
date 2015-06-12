var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    resetHosts = require('./helpers/reset-hosts'),
    setHost = require('../src/set-host');
    
describe('setHost', function() {
  
  afterEach(function() {
    resetHosts(2);
  });
  
  it('should update an existing hostname entry', function() {
    var filePath = path.resolve(__dirname, 'data/hosts_2');
    setHost('::2', 'file', filePath);
    assert.equal(fs.readFileSync(filePath).toString(), '# short\n::2 file\n');
  });
  
  it('should add a new host', function() {
    var filePath = path.resolve(__dirname, 'data/hosts_2');
    setHost('::1', 'is-the-loneliest-number', filePath);
    assert.equal(fs.readFileSync(filePath).toString(), '# short\n::1 file\n\n::1 is-the-loneliest-number');
  });
});
