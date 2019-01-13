/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */

const d = require('debug');
const globber = require('./globber');
const filtration = require('./filter');
const scanner = require('./scanner');

const ns = 'deified:';
const log = {
  debug: {
    configure: d(`${ns}configure`),
    deify: d(`${ns}deify`),
  },
  trace: {
    configure: d(`${ns}configure:trace`),
    deify: d(`${ns}deify:trace`),
  },
};

/**
 * Scans a directory for files and subdirectories and filters using regular
 * expression filters as it scans and glob patterns post scanning.
 * @module diefied
 */

/**
 * @description Ensures the [scanner]{@link module:scanner} configuration
 * can accept a [filter]{@link module:filter}
 */
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
   */
  configure(config) {
    const conf = Object.assign({}, defaultConfig, config);

    log.trace.configure({ enter: 'configure', args: { config } });
    const filter = filtration.configure(conf.filter);
    const glob = globber.configure(conf.glob);

    conf.scan.filter = filter;
    log.debug.configure({ conf });

    const scan = scanner.configure(conf.scan);


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
     */
    return async function deify(dirInfo) {
      log.trace.deify({ enter: 'deify', args: { dirInfo } });
      return glob(await scan(dirInfo));
    };
  },
};
