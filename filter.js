/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */

const d = require('debug');

const ns = 'deified:filter:';
const log = {
  debug: {
    configure: d(`${ns}configure`),
    filter: d(`${ns}filter`),
  },
  trace: {
    configure: d(`${ns}configure:trace`),
    filter: d(`${ns}filter:trace`),
  },
};

/**
 * Apply a regular expression pattern to strings in an array and
 * return the filtered array.
 * @module filter
 */


/**
 * @description The default regex pattern filters hidden and node_modules directories
 * @default ['/[.]', '^[.]', '/?node_modules/', '^node_modules$']
 *
 */
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
   */
  configure(config) {
    log.trace.configure({ enter: 'configure', args: { config } });
    const conf = Object.assign({}, defaultConfig, config);
    conf.regexes = conf.regexes || defaultConfig.regexes;
    conf.regexes = Array.isArray(conf.regexes) ? conf.regexes : [conf.regexes];
    log.debug.configure({ conf });

    /**
     * Filters the paths by the configured regular expressions
     *
     * @function filter
     *
     * @param {array} paths - The paths to apply the regexes to
     *
     * @return {array} The filtered paths based on the regexs
     */
    return function filter(paths) {
      log.trace.filter({ enter: 'filter', args: { paths } });
      return paths.filter(path => conf.regexes.every(regex => !path.match(regex)));
    };
  },
};
