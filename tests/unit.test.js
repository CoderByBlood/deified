/* MIT License
 *
 * Copyright (c) 2018-present CoderByBlood
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*global expect*/

const path = require('path');
const mm = require('micromatch');
const globber = require('../globber');
const filtration = require('../filter');
const scanner = require('../scanner');
const deified = require('../deified');
const constants = require('./constants');
const paths = constants.paths;
const range = constants.range;

describe('The globber should...', () => {
  test('using defaults, identify all but hidden files', () => {
    expect.assertions(2);

    const mmGlobs = ['**/*'];
    const selectedPaths = mm(paths, mmGlobs);
    const glob = globber.configure();
    const globbed = glob(paths);

    expect(globbed).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(globbed));
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
    expect.assertions(2);

    const regexes = ['/[.]', '^[.]', '/?node_modules/'];
    const selectedPaths = paths.filter(x => regexes.every(r => !x.match(r)));
    const filter = filtration.configure();
    const filtered = filter(paths);

    expect(filtered).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(filtered));
  });

  test('using a custom regex, filter specified files', () => {
    expect.assertions(2);

    const regexes = ['node_modules/', '/selector/', '/?test/'];
    const selectedPaths = paths.filter(x => regexes.every(r => !x.match(r)));
    const filter = filtration.configure({ regexes });
    const filtered = filter(paths);

    expect(filtered).toEqual(expect.arrayContaining(selectedPaths));
    expect(selectedPaths).toEqual(expect.arrayContaining(filtered));
  });
});

describe('The scanner should...', () => {
  test('list all files starting from the default directory', async() => {
    expect.assertions(2);

    const scan = scanner.configure();
    const results = await scan();

    expect(results).toContain('package.json');
    expect(results).toContain('tests/unit.test.js');
  });

  test('list files starting from a specified directory', async() => {
    expect.assertions(2);

    const scan = scanner.configure();
    const results = await scan({ directory: __dirname });

    expect(results).toContain(path.join(__dirname, 'unit.test.js'));
    expect(results).toContain(path.join(__dirname, 'constants.js'));
  });
});

describe('Deified should...', () => {
  test('using defaults, identify typical files from cwd', async() => {
    expect.assertions(2);

    const tests = [/^[.]/, /[/][.]/, /node_modules/];
    const deify = deified.configure();
    const results = await deify();

    expect(results.length).toBeGreaterThan(10);
    expect(results.every(x => tests.every(r => !x.match(r)))).toBeTruthy();
  });

  test('using globs and filters, identify specified files from cwd', async() => {
    expect.assertions(2);

    const glob = { globs: ['**/package.json'] };
    const filter = { regexes: ['node_modules/([^/]+/){2,}'] };
    const deify = deified.configure({ glob, filter });
    const results = await deify();

    expect(results.length).toBeGreaterThan(10);
    expect(results.every(x => x.match(/package[.]json$/))).toBeTruthy();
  });

  test('using defaults, identify typical files from specified directory', async() => {
    expect.assertions(2);

    const deify = deified.configure();
    const results = await deify({ directory: __dirname });

    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThan(5);
  });

  test('using globs and filters, identify specified files and directory', async() => {
    expect.assertions(2);

    const glob = { globs: ['**/*.test.js'] };
    const filter = { regexes: ['/[j-z,A-Z][^/]*$'] };
    const deify = deified.configure({ glob, filter });
    const results = await deify({ directory: __dirname });

    expect(results.length).toBeGreaterThan(0);
    expect(results.some(x => x.match(/intergration.+[.]js$/))).toBeTruthy();
  });

  test('work using the documented installation', async() => {
    expect.assertions(1);

    //const deified = require('deified');
    const config = { //optional - all configuration has intuitive defaults
      glob: {
        globs: ['**/*.js'], //passed to micromatch mm() - defaults to [**/*]
        options: {}, //options for micromatch - defaults to undefied
      },
      filter: {
        regexes: ['/?test/'] //defaults to filter hidden files and node_modules
      },
      scan: {
        options: { encoding: 'utf8' } //options for readdir - defaults to undefined
      }
    };

    const deify = deified.configure(config);
    const paths = await deify({ directory: __dirname }); //pass the directory to scan - defaults to cwd
    expect(paths.some(x => x.match(/unit.+[.]js$/))).toBeTruthy();
  });
});
