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

const mm = require('micromatch');
const globber = require('../globber');
const filtration = require('../filter');
const scanner = require('../scanner');
const constants = require('./constants.js');
const paths = constants.paths;
const range = constants.range;

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
  test('using defaults, identify typical files', async() => {
    expect.assertions(2);

    const tests = [/^[.]/, /[/][.]/, /node_modules/];
    const filter = filtration.configure();
    const scan = scanner.configure({ filter: filter });
    const scanned = await scan();

    expect(scanned.length).toBeGreaterThan(0);
    expect(scanned.every(x => tests.every(r => !x.match(r)))).toBeTruthy();
  });

  test('using custom filter, identify specified files', async() => {
    expect.assertions(2);

    const tests = [/node_modules/, /doc/];
    const regexes = ['node_modules', 'doc'];
    const filter = filtration.configure({ regexes });
    const scan = scanner.configure({ filter: filter });
    const scanned = await scan();

    expect(scanned.length).toBeGreaterThan(0);
    expect(scanned.every(x => tests.every(r => !x.match(r)))).toBeTruthy();
  });
});
