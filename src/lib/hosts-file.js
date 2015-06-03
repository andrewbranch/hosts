var fs = require('fs');

function HostsFile() {
  this.path = '/etc/hosts';
  this.stats = fs.statSync(this.path);
}

HostsFile.prototype.read = function() {
  try {
    this.contents = fs.readFileSync(this.path);
    return this.contents.toString();
  } catch (err) {
    console.error(err);
    return process.exit(1);
  }
};

HostsFile.prototype.replaceEntry = function(entry, ip, hostname) {
  var newContentsUTF8 = this.contents.toString('utf8').replace(entry, ip + ' ' + hostname);
  try {
    fs.writeFileSync('/etc/hosts', newContentsUTF8);
    this.contents = new Buffer(newContentsUTF8);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = HostsFile;