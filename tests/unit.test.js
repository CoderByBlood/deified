/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */

/*global expect*/

const path = require('path');
const mm = require('micromatch');
const globber = require('../globber');
const filtration = require('../filter');
const scanner = require('../scanner');
const constants = require('./constants');
const paths = constants.paths;

describe('The globber should...', () => {
  test('using defaults, identify all but hidden files', () => {
    expect.assertions(4);

    const selectedPaths = mm(paths, '**/*');
    const glob = globber.configure();
    const globbed = glob(paths);

    expect(globbed).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(globbed));

    //corner case
    const globbed_2 = globber.configure({ globs: undefined });
    const selected_2 = globbed_2(paths);

    expect(selected_2).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(selected_2));
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

    //corner case
    const filter_2 = filtration.configure({ regexes: undefined });
    const filtered_2 = filter_2(paths);

    expect(filtered_2).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(filtered_2));
  });

  test('using a custom regex, filter specified files', () => {
    expect.assertions(4);

    const regexes = ['node_modules/', '/selector/', '/?test/'];
    const selectedPaths = paths.filter(x => regexes.every(r => !x.match(r)));
    const filter = filtration.configure({ regexes });
    const filtered = filter(paths);

    expect(filtered).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(filtered));

    //corner case
    const regexes_2 = '(node_modules/|/selector/|/?test/)';
    const selectedPaths_2 = paths.filter(x => !x.match(regexes_2));
    const filter_2 = filtration.configure({ regexes: regexes_2 });
    const filtered_2 = filter_2(paths);

    expect(filtered_2).toEqual(expect.arrayContaining(selectedPaths_2));
    expect(selectedPaths_2).toEqual(expect.arrayContaining(filtered_2));
  });
});

describe('The scanner should...', () => {
  test('list all files starting from the default directory', async() => {
    expect.assertions(4);

    const tests = ['package.json', 'tests/unit.test.js'];

    const scan = scanner.configure();
    const results = await scan();

    tests.forEach(x => expect(results).toContain(x));

    //corner case
    const results_2 = await scan({ directory: undefined });

    tests.forEach(x => expect(results_2).toContain(x));
  });

  test('list files starting from a specified directory', async() => {
    expect.assertions(2);

    const scan = scanner.configure();
    const results = await scan({ directory: __dirname });

    expect(results).toContain(path.join(__dirname, 'unit.test.js'));
    expect(results).toContain(path.join(__dirname, 'constants.js'));
  });
});
