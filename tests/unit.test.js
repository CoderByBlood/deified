/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */

// eslint-disable-next-line spaced-comment
/*global expect describe test*/

const path = require('path');
const mm = require('micromatch');
const globber = require('../globber');
const filtration = require('../filter');
const scanner = require('../scanner');
const constants = require('./constants');

const { paths } = constants;

describe('The globber should...', () => {
  test('using defaults, identify all but hidden files', () => {
    expect.assertions(4);

    const selectedPaths = mm(paths, '**/*');
    const glob = globber.configure();
    const globbed = glob(paths);

    expect(globbed).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(globbed));

    // corner case
    const globbed2 = globber.configure({ globs: undefined });
    const selected2 = globbed2(paths);

    expect(selected2).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(selected2));
  });

  test('using a custom glob pattern, identify specified files', () => {
    expect.assertions(2);

    const mmGlobs = ['**/tests/**/*.js?(x)', '**/*.test.js?(x)'];
    const selectedPaths = mm(paths, mmGlobs);
    const globbed = globber.configure({ globs: mmGlobs });
    const selected = globbed(paths);

    expect(selected).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(selected));
  });
});

describe('The filter should...', () => {
  test('using defaults, filter hidden and node_modules files', () => {
    expect.assertions(4);

    const regexes = ['/[.]', '^[.]', '/?node_modules/'];
    const selectedPaths = paths.filter(x => regexes.every(r => !x.match(r)));
    const filter = filtration.configure();
    const filtered = filter(paths);

    expect(filtered).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(filtered));

    // corner case
    const filter2 = filtration.configure({ regexes: undefined });
    const filtered2 = filter2(paths);

    expect(filtered2).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(filtered2));
  });

  test('using a custom regex, filter specified files', () => {
    expect.assertions(4);

    const regexes = ['node_modules/', '/selector/', '/?test/'];
    const selectedPaths = paths.filter(x => regexes.every(r => !x.match(r)));
    const filter = filtration.configure({ regexes });
    const filtered = filter(paths);

    expect(filtered).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(filtered));

    // corner case
    const regexes2 = '(node_modules/|/selector/|/?test/)';
    const selectedPaths2 = paths.filter(x => !x.match(regexes2));
    const filter2 = filtration.configure({ regexes: regexes2 });
    const filtered2 = filter2(paths);

    expect(filtered2).toEqual(expect.arrayContaining(selectedPaths2));
    expect(selectedPaths2).toEqual(expect.arrayContaining(filtered2));
  });
});

describe('The scanner should...', () => {
  test('list all files starting from the default directory', async () => {
    expect.assertions(4);

    const tests = ['package.json', 'tests/unit.test.js'];

    const scan = scanner.configure();
    const results = await scan();

    tests.forEach(x => expect(results).toContain(x));

    // corner case
    const results2 = await scan({ directory: undefined });

    tests.forEach(x => expect(results2).toContain(x));
  });

  test('list files starting from a specified directory', async () => {
    expect.assertions(2);

    const scan = scanner.configure();
    const results = await scan({ directory: __dirname });

    expect(results).toContain(path.join(__dirname, 'unit.test.js'));
    expect(results).toContain(path.join(__dirname, 'constants.js'));
  });
});
