#! /usr/bin/env node

var package = require('./package.json'),
    program = require('commander'),
    setHost = require('./src/set-host');

program
  .version(package.version)
  .arguments('<ip> <hostname>')
  .action(function(ip, hostname) {
    setHost(ip, hostname, '/etc/hosts'); // TODO read from option
  })
  .parse(process.argv);