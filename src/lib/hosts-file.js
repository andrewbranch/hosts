var fs = require('fs'),
    color = require('bash-color'),
    Entry = require('./entry'),
    parseLine = require('./parse-line');

function HostsFile(path) {
  this.path = path;
  this.lines = null;
  
  this.read();
  this.parse();
}

HostsFile.prototype.read = function() {
  try {
    this.contents = fs.readFileSync(this.path).toString();
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(color.red(' File %s doesn’t exist.\n Use the `--path` option to specify the location of your hosts file.'), this.path);
    } else {
      console.error(err);
    }
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
    if (err.code === 'EACCES') {
      console.error(color.red(' Permission was denied.\n Make sure you are running the command with `sudo`.'));
    } else {
      console.error(err);
    }
    process.exit(1);
  }
};

module.exports = HostsFile;