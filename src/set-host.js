var fs = require('fs'),
    escapeRegex = require('./lib/escape-regex'),
    HostsFile = require('./lib/hosts-file');

module.exports = function(ip, hostname, filePath) {
  
  var hostsFile = new HostsFile(filePath);
  
  // Hostname is already mapped
  var existingEntry = hostsFile.find({ hostname: hostname })[0];
  if (existingEntry) {
    var oldIp = existingEntry.ip;
    if (ip === oldIp) {
      console.log('%s already mapped to %s', ip, hostname);
      return process.exit(0);
    }
    
    existingEntry.ip = ip;
    hostsFile.write();
    console.log('Removed mapping from %s to %s', oldIp, hostname);
    console.log('Mapped %s to %s', ip, hostname);
  }
  
};
