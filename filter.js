/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */


/**
 * Apply a regular expression pattern to strings in an array and
 * return the filtered array.
 * @module filter
 */


const loggers = require('./loggers');

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
    const log = loggers.$('deified.filter.configure');
    log.trace({ args: { conf } }, 'enter');
    const config = Object.assign({}, defaultConfig, conf);
    config.regexes = config.regexes || defaultConfig.regexes;
    config.regexes = (config.regexes.every && config.regexes) || [config.regexes];
    log.debug({ configuration: config }, 'configuration set');

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
      const log = loggers.$('deified.filter.filter');
      log.trace({ args: { paths } }, 'enter');

      return paths.filter(path => config.regexes.every(regex => !path.match(regex)));
    };
  },
};
