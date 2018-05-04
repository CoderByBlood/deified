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

const globber = require('./globber');
const filtration = require('./filter');
const scanner = require('./scanner');

/**
 * Scans a directory for files and subdirectories and filters using regular
 * expression filters as it scans and glob patterns post scanning.
 * @module diefied
 */

/**
 * @description Ensures the [scanner]{@link module:scanner} configuration
 * can accept a [filter]{@link module:filter}
 **/
const defaultConfig = {
  scan: {},
};

module.exports = {

  /**
   * Configures the deify function
   *
   * @param {object} config - The configuration for the scanning
   * - `config.filter` is passed to [filter]{@link module:filter}
   * - `config.glob` is passed to [globber]{@link module:globber}
   * - `config.scan` is passed to [scanner]{@link module:scanner}
   *
   * @return {function} Scans based on the configuration
   **/
  configure: function(conf) {
    const config = Object.assign({}, defaultConfig, conf);
    const filter = filtration.configure(config.filter);
    const glob = globber.configure(config.glob);

    config.scan.filter = filter;

    const scan = scanner.configure(config.scan);


    /**
     * Recursively scans and filters directories
     *
     * @function deify
     *
     * @param {object} dirInfo - The information about the directory to scan
     * - `dirInfo.directory` is the directory to scan
     *
     * @return {array} All of the post filtered files and
     * subdirectors - depth first
     **/
    return async function(dirInfo) {
      return glob(await scan(dirInfo));
    }
  },
};