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

const mm = require('micromatch');

/**
 * Apply a glob pattern to strings in an array and return the filtered array.
 * @module globber
 */

/**
 * @description The default glob pattern matches everything
 * @default ['**&#8205;/**']
 **/
const defaultConfig = {
  globs: ['**/*'],
};

module.exports = {

  /**
   * Configures the glob function
   *
   * @param {object} config - Holds the configuration for the globbing
   * - `config.globs` is an array of glob patterns
   *
   * @return {function} Globs based on the configuration
   **/
  configure: function(conf) {
    const config = Object.assign({}, defaultConfig, conf);
    config.globs = config.globs || defaultConfig.globs;
    config.globs = (config.globs.every && config.globs) || [config.globs];

    /**
     * Filters the paths by the configured globs
     *
     * @function glob
     *
     * @param {array} paths - The paths to apply the globs to
     *
     * @return {array} The filtered paths based on the globs
     **/
    return function(paths) {
      return mm(paths, config.globs, config.options);
    };
  },
};
