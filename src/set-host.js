var fs = require('fs'),
    escapeRegex = require('./lib/escape-regex'),
    color = require('bash-color'),
    HostsFile = require('./lib/hosts-file');

module.exports = function(ip, hostname, filePath) {
  
  var hostsFile = new HostsFile(filePath);
  
  // Hostname is already mapped
  var existingEntry = hostsFile.find({ hostname: hostname })[0];
  if (existingEntry) {
    var oldIp = existingEntry.ip;
    if (ip === oldIp) {
      console.log(' Entry already exists:');
      console.log(' %s → %s',
        color.wrap(hostname, color.colors.CYAN, color.styles.bold),
        color.wrap(ip, color.colors.CYAN, color.styles.bold)
      );
      return process.exit(0);
    }
    
    existingEntry.ip = ip;
    hostsFile.write();
    console.log(' Updated entry:');
    console.log(' %s → %s',
      color.wrap(' - ' + hostname, color.colors.RED, color.styles.bold),
      color.wrap(oldIp, color.colors.RED, color.styles.bold)
    );
    console.log(' %s → %s',
      color.wrap(' + ' + hostname, color.colors.GREEN, color.styles.bold),
      color.wrap(ip, color.colors.GREEN, color.styles.bold)
    );
    return process.exit(0);
  }
  
  // Add a new hostname
  hostsFile.add(ip, hostname);
  hostsFile.write();
  console.log(' Added entry:');
  console.log(' %s → %s',
    color.wrap(' + ' + hostname, color.colors.GREEN, color.styles.bold),
    color.wrap(ip, color.colors.GREEN, color.styles.bold)
  );
  return process.exit(0);
  
};
