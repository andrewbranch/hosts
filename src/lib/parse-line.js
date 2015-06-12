var Entry = require('./entry');

module.exports = function(line) {
  // Check if comment or empty
  if (/^\s*(#.*)?$/m.test(line)) {
    return line;
  }
  
  var parts = line.match(/^\s*([0-9.:]+)\s+([^\s]+)/m),
      ip = parts[1],
      hostname = parts[2];
      
  if (!ip || !hostname) {
    console.error(color.red('Could not parse file at line: ') + line);
    return process.exit(1);
  }
  
  return new Entry(ip, hostname, line);
};
