/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */

// eslint-disable-next-line spaced-comment
/*global expect describe test*/

const mm = require('micromatch');
const globber = require('../globber');
const filtration = require('../filter');
const scanner = require('../scanner');
const constants = require('./constants.js');
const deified = require('../deified');

const { paths } = constants;

describe('Chaining globbing and filtering should...', () => {
  test('using defaults, identify specified files', () => {
    expect.assertions(2);

    const mmGlobs = ['**/*'];
    const regexes = ['/[.]', '^[.]', '/?node_modules/'];
    const globbed = mm(paths, mmGlobs);
    const selectedPaths = globbed.filter(x => regexes.every(r => !x.match(r)));

    const glob = globber.configure();
    const filter = filtration.configure();

    const chained = filter(glob(paths));

    expect(chained).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(chained));
  });

  test('using globs and regexes, identify specified files', () => {
    expect.assertions(2);

    const mmGlobs = ['**/tests/**/*.js?(x)', '**/*.test.js?(x)'];
    const regexes = ['node_modules/', '/selector/'];
    const globbed = mm(paths, mmGlobs);
    const selectedPaths = globbed.filter(x => regexes.every(r => !x.match(r)));
    const glob = globber.configure({ globs: mmGlobs });
    const filter = filtration.configure({ regexes });
    const chained = filter(glob(paths));

    expect(chained).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(chained));
  });
});

describe('Integrating scanner and filter should...', () => {
  test('using defaults, identify typical files', async () => {
    expect.assertions(2);

    const tests = [/^[.]/, /[/][.]/, /node_modules/];
    const filter = filtration.configure();
    const scan = scanner.configure({ filter });
    const scanned = await scan();

    expect(scanned.length).toBeGreaterThan(0);
    expect(scanned.every(x => tests.every(r => !x.match(r)))).toBeTruthy();
  });

  test('using custom filter, identify specified files', async () => {
    expect.assertions(2);

    const tests = [/node_modules/, /doc/];
    const regexes = ['node_modules', 'doc'];
    const filter = filtration.configure({ regexes });
    const scan = scanner.configure({ filter });
    const scanned = await scan();

    expect(scanned.length).toBeGreaterThan(0);
    expect(scanned.every(x => tests.every(r => !x.match(r)))).toBeTruthy();
  });
});

describe('Deified should...', () => {
  test('using defaults, identify typical files from cwd', async () => {
    expect.assertions(2);

    const tests = [/^[.]/, /[/][.]/, /node_modules/];
    const deify = deified.configure();
    const results = await deify();

    expect(results.length).toBeGreaterThan(10);
    expect(results.every(x => tests.every(r => !x.match(r)))).toBeTruthy();
  });

  test('using globs and filters, identify specified files from cwd', async () => {
    expect.assertions(2);

    const glob = { globs: ['**/package.json'] };
    const filter = { regexes: ['node_modules/([^/]+/){2,}'] };
    const deify = deified.configure({ glob, filter });
    const results = await deify();

    expect(results.length).toBeGreaterThan(10);
    expect(results.every(x => x.match(/package[.]json$/))).toBeTruthy();
  });

  test('using defaults, identify typical files from specified directory', async () => {
    expect.assertions(2);

    const deify = deified.configure();
    const results = await deify({ directory: __dirname });

    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThan(5);
  });

  test('using globs and filters, identify specified files and directory', async () => {
    expect.assertions(2);

    const glob = { globs: ['**/*.test.js'] };
    const filter = { regexes: ['/[j-z,A-Z][^/]*$'] };
    const deify = deified.configure({ glob, filter });
    const results = await deify({ directory: __dirname });

    expect(results.length).toBeGreaterThan(0);
    expect(results.some(x => x.match(/intergration.+[.]js$/))).toBeTruthy();
  });

  test('work using the documented installation', async () => {
    expect.assertions(1);

    // const deified = require('deified');
    const config = { // optional - all configuration has intuitive defaults
      glob: {
        globs: ['**/*.js'], // passed to micromatch mm() - defaults to [**/*]
        options: {}, // options for micromatch - defaults to undefied
      },
      filter: {
        regexes: ['/?test/'], // defaults to filter hidden files and node_modules
      },
      scan: {
        options: { encoding: 'utf8' }, // options for readdir - defaults to undefined
      },
    };

    const deify = deified.configure(config);
    const pathArray = await deify({ directory: __dirname }); // pass the directory - defaults to cwd
    expect(pathArray.some(x => x.match(/unit.+[.]js$/))).toBeTruthy();
  });
});
