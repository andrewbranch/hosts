var fs = require('fs'),
    Entry = require('./entry'),
    parseLine = require('./parse-line');

function HostsFile(path) {
  this.path = path;
  this.stats = fs.statSync(this.path);
  this.lines = null;
  
  this.read();
  this.parse();
}

HostsFile.prototype.read = function() {
  try {
    this.contents = fs.readFileSync(this.path).toString();
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
};

HostsFile.prototype.parse = function() {
  this.lines = [];
  this.contents.split('\n').forEach(function(l) {
    this.lines.push(parseLine(l));
  }.bind(this));
};

HostsFile.prototype.entries = function() {
  return this.lines.filter(function(l) {
    return l instanceof Entry;
  });
};

HostsFile.prototype.find = function(query) {
  return this.entries().filter(function(e) {
    for (var property in query) {
      if (e[property] !== query[property]) {
        return false;
      }
    }
    return true;
  });
};

HostsFile.prototype.add = function(ip, hostname, index) {
  index = index || this.lines.length + 1;
  this.lines.splice(index, 0, new Entry(ip, hostname));
};

HostsFile.prototype.write = function() {
  var contents = this.lines.map(function(l) {
    return l.toString();
  }).join('\n');
  
  try {
    fs.writeFileSync(this.path, contents);
    this.contents = contents;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = HostsFile;