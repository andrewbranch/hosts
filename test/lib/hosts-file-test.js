var assert = require('assert'),
    path = require('path'),
    fs = require('fs'),
    resetHosts = require('../helpers/reset-hosts'),
    Entry = require('../../src/lib/entry'),
    HostsFile = require('../../src/lib/hosts-file'),
    parseLine = require('../../src/lib/parse-line');
    
describe('HostsFile', function() {
  
  describe('constructor', function() {
    it('should assign first parameter to path property', function() {
      var filePath = path.resolve(__dirname, '../data/hosts_1'),
          hostsFile = new HostsFile(filePath);
      assert.equal(hostsFile.path, filePath);
    });
  });
  
  describe('read', function() {
    it('should assign file contents to contents property as UTF-8 string', function() {
      var filePath = path.resolve(__dirname, '../data/hosts_2'),
          hostsFile = new HostsFile(filePath);
      
      hostsFile.read(); // also done in constructor, here for clarity
      assert.equal(hostsFile.contents, '# short\n::1 file\n');
    });
  });
  
  describe('parse', function() {
    
    var hostsFile;
    beforeEach(function() {
      var filePath = path.resolve(__dirname, '../data/hosts_1');
      hostsFile = new HostsFile(filePath);
      hostsFile.parse(); // also done in constructor, here for clarity
    });
    
    it('should assign lines property to an Array', function() {
      assert.ok(hostsFile.lines instanceof Array);
    });
    
    it('should add an element to lines property for each line in file', function() {
      assert.equal(hostsFile.lines.length, 10);
    });
    
    it('lines elements should be ordered results of parseLine', function() {
      assert.deepEqual(hostsFile.lines[0], parseLine('##'));
      assert.deepEqual(hostsFile.lines[6], parseLine('127.0.0.1	      localhost'));
    });
  });
  
  describe('entries', function() {
    
    var hostsFile;
    beforeEach(function() {
      var filePath = path.resolve(__dirname, '../data/hosts_1');
      hostsFile = new HostsFile(filePath);
    });
    
    it('should return lines that are valid entries', function() {
      var entries = hostsFile.entries();
      assert.equal(entries.length, 3);
      assert.ok(entries.every(function(e) { return e instanceof Entry; }));
    });
  });
  
  describe('find', function() {
    
    var hostsFile;
    before(function() {
      var filePath = path.resolve(__dirname, '../data/hosts_1');
      hostsFile = new HostsFile(filePath);
    });
    
    it('should return all entries when omitting query parameter', function() {
      assert.deepEqual(hostsFile.find(), hostsFile.entries());
    });
    
    it('should return an array of entries matching the query', function() {
      var matches = hostsFile.find({ hostname: 'localhost' });
      assert.equal(matches.length, 2);
      assert.ok(matches.every(function(e) { return e instanceof Entry; }));
      assert.ok(matches.every(function(e) { return e.hostname === 'localhost'; }));
    });
    
    it('should treat multiple keys and AND conditions', function() {
      var matches = hostsFile.find({ hostname: 'localhost', ip: '::1' });
      assert.equal(matches.length, 1);
      assert.equal(matches[0].hostname, 'localhost');
      assert.equal(matches[0].ip, '::1');
    });
    
    it('should allow querying by keys that don’t exist on entry', function() {
      assert.deepEqual(hostsFile.find({ garbage: 'bin' }), []);
    });
    
    it('should allow querying for undefined', function() {
      assert.equal(hostsFile.find({ garbage: undefined }).length, 3);
    });
    
    it('should return an empty array if no entry matches', function() {
      assert.deepEqual(hostsFile.find({ hostname: 'foo' }), []);
    });
  });
  
  describe('write', function() {
    
    var hostsFile;
    beforeEach(function() {
      var filePath = path.resolve(__dirname, '../data/hosts_2');
      hostsFile = new HostsFile(filePath);
    });
    
    afterEach(function() {
      resetHosts(2);
    });
    
    it('should write unmodified contents when no changes exist', function() {
      hostsFile.read();
      var oldContents = hostsFile.contents;
      hostsFile.write();
      hostsFile.read();
      assert.equal(oldContents, hostsFile.contents);
    });
    
    it('should write changes made to entry', function() {
      hostsFile.entries()[0].hostname = 'elif';
      hostsFile.write();
      hostsFile.read();
      assert.equal(hostsFile.contents, '# short\n::1 elif\n');
    });
    
    it('should write changes made to a non-entry line', function() {
      hostsFile.lines[0] = '# long';
      hostsFile.write();
      hostsFile.read();
      assert.equal(hostsFile.contents, '# long\n::1 file\n');
    });
    
    it('should write new entries', function() {
      var entry = new Entry('::1', 'api', '::1 api');
      hostsFile.lines.splice(1, 0, entry);
      hostsFile.write();
      hostsFile.read();
      assert.equal(hostsFile.contents, '# short\n::1 api\n::1 file\n');
    });
    
    it('should delete removed lines', function() {
      hostsFile.lines.shift();
      hostsFile.write();
      hostsFile.read();
      assert.equal(hostsFile.contents, '::1 file\n');
    });
    
    it('should update contents property', function() {
      hostsFile.lines[0] = '# long';
      hostsFile.write();
      assert.equal(hostsFile.contents, '# long\n::1 file\n');
    });
  });
});