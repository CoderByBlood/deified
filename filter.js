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


/**
 * Apply a regular expression pattern to strings in an array and
 * return the filtered array.
 * @module filter
 */

/**
 * @description The default regex pattern filters hidden and node_modules directories
 * @default ['/[.]', '^[.]', '/?node_modules/', '^node_modules$']
 *
 **/
const defaultConfig = {
  regexes: ['/[.]', '^[.]', '/?node_modules/', '^node_modules$'],
};

module.exports = {

  /**
   * Configures the glob function
   *
   * @param {object} config - Holds the configuration for the globbing
   * - `config.globs` is an array of glob patterns
   * @return {function} Globs based on the configuration
   **/
  configure: function(conf) {
    const config = Object.assign({}, defaultConfig, conf);
    const snap = config.regexes;
    config.regexes = config.regexes || defaultConfig.regexes;
    config.regexes = (config.regexes.every && config.regexes) || [config.regexes];

    if (snap !== config.regexes) console.log(config);

    /**
     * Filters the paths by the configured regular expressions
     *
     * @function filter
     *
     * @param {array} paths - The paths to apply the regexes to
     *
     * @return {array} The filtered paths based on the regexs
     **/
    return function(paths) {
      return paths.filter(path => config.regexes.every(regex => !path.match(regex)));
    };
  },
};