/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */

const mm = require('micromatch');
const loggers = require('./loggers');

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
    const log = loggers.$('deified.globber.configure');
    log.trace({ args: { conf } }, 'enter');
    const config = Object.assign({}, defaultConfig, conf);
    config.globs = config.globs || defaultConfig.globs;
    log.debug({ configuration: config }, 'configuration set');

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
      const log = loggers.$('deified.globber.glob');
      log.trace({ args: { paths } }, 'enter');
      return mm(paths, config.globs, config.options);
    };
  },
};
