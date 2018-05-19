/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */

const mm = require('micromatch');
const d = require('debug');
const ns = 'deified:globber:';
const log = {
  debug: {
    configure: d(ns + 'configure'),
    glob: d(ns + 'glob'),
  },
  trace: {
    configure: d(ns + 'configure:trace'),
    glob: d(ns + 'glob:trace'),
  },
};

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
  configure(config) {
    log.trace.configure({ enter: 'configure', args: { config } });
    const conf = Object.assign({}, defaultConfig, config);
    conf.globs = conf.globs || defaultConfig.globs;
    log.debug.configure({ conf });

    /**
     * Filters the paths by the configured globs
     *
     * @function glob
     *
     * @param {array} paths - The paths to apply the globs to
     *
     * @return {array} The filtered paths based on the globs
     **/
    return function glob(paths) {
      log.trace.glob({ enter: 'glob', args: { paths } });
      return mm(paths, conf.globs, conf.options);
    };
  },
};
