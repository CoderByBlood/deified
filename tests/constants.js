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

module.exports = { paths, };
