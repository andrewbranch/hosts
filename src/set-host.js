var fs = require('fs'),
    escapeRegex = require('./lib/escape-regex'),
    HostsFile = require('./lib/hosts-file');

module.exports = function(ip, hostname) {
  
  var hostsFile = new HostsFile(true),
      hosts = hostsFile.read();
  
  // IP address is already mapped
  var matches = hosts.match(new RegExp('^\\s*([0-9.:]+)\\s+(' + escapeRegex(hostname) + ')', 'm'));
  if (matches) {
    var oldIp = matches[1];
    if (ip === oldIp) {
      console.log('%s already mapped to %s', ip, hostname);
      return process.exit(0);
    }
    
    hostsFile.replaceEntry(matches[0], ip, hostname);
    console.log('Removed mapping from %s to %s', oldIp, hostname);
    console.log('Mapped %s to %s', ip, hostname);
  }
  
};
