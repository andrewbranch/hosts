var path = require('path'),
    fs = require('fs');

module.exports = function(which) {
  switch (which) {
    case 1:
      fs.writeFileSync(path.resolve(__dirname, '../data/hosts_1'), '##\n# Host Database\n#\n# localhost is used to configure the loopback interface\n# when the system is booting.  Do not change this entry.\n##\n127.0.0.1	      localhost\n255.255.255.255	broadcasthost\n::1             localhost\n');
      break;
    case 2:
      fs.writeFileSync(path.resolve(__dirname, '../data/hosts_2'), '# short\n::1 file\n');
      break;
  }
};
