#! /usr/bin/env node

var package = require('./package.json'),
    program = require('commander'),
    setHost = require('./src/set-host');

program
  .version(package.version)
  .arguments('<ip> <hostname>')
  .option('-p, --path <value>', 'The absolute path to the hosts file. [/etc/hosts]', '/etc/hosts')
  .action(function(ip, hostname) {
    setHost(ip, hostname, program.path);
  })
  .parse(process.argv);