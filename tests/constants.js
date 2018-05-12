/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */

const paths = [
  '/tests/deified.test.js', //0
  '/tests/test.deified.js', //1
  '/deified/test.jsx', //2
  'deified/test.js', //3
  'test/deified/test.js', //4
  'test/selector/deified.test.js', //5
  'test/selector/test.deified.js', //6
  '/test/selector/deified.test.js', //7
  '/test/selector/test.deified.js', //8
  '/node_modules/test.jsx', //9
  'node_modules/test.js', //10
  'node_modules/deified/test.js', //11
  'node_modules/selector/deified.test.js', //12
  'node_modules/selector/test.deified.js', //13
  '/node_modules/selector/deified.test.js', //14
  '/node_modules/selector/test.deified.js', //15
  '/', //16
  '/tests/', //17
  'test/deified/', //18
  'node_modules/', //19
  '/node_modules/selector', //20
  '.git', //21
  '/.git', //22
  'test/.git', //23
  'test/.git/test.js', //24
];

const logConfig = {
  classes: ['name', 'module', 'feature'],
  logs: [
    { log: 'deified', level: 'debug' },
    { log: 'deified.main', level: 'info' },
    { log: 'deified.main.configure', level: 'info' },
    { log: 'deified.main.deify', level: 'info' },
    { log: 'deified.scanner', level: 'warn' },
    { log: 'deified.scanner.configure', level: 'trace' },
    { log: 'deified.scanner.scan', level: 'error' },
    { log: 'deified.globber', level: 'error' },
    { log: 'deified.globber.configure', level: 'debug' },
    { log: 'deified.globber.glob', level: 'warn' },
    { log: 'deified.filter', level: 'warn' },
    { log: 'deified.filter.configure', },
    { log: 'deified.filter.filter', level: 'fatal' },
  ],
};

const logPartial = {
  classes: ['name', 'module', 'feature'],
  logs: [
    { log: 'deified', level: 'debug' },
    { log: 'deified.main.configure', level: 'info' },
    { log: 'deified.main.deify', level: 'info' },
    { log: 'deified.scanner.configure', level: 'trace' },
    { log: 'deified.scanner.scan', level: 'error' },
    { log: 'deified.globber.configure', level: 'debug' },
    { log: 'deified.globber.glob', level: 'warn' },
    { log: 'deified.filter.configure', },
    { log: 'deified.filter.filter', level: 'fatal' },
  ],
};

module.exports = { paths, logConfig, logPartial };
