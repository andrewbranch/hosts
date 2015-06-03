#! /usr/bin/env node

var package = require('./package.json'),
    program = require('commander'),
    setHost = require('./src/set-host');

program
  .version(package.version)
  .arguments('<ip> <hostname>')
  .action(setHost)
  .parse(process.argv);