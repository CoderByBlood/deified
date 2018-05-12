/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
 */

const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const defaultConfig = {};
const defaultInfo = { directory: '.' };
const loggers = require('./loggers');

/**
 * Scan files in any directory and return them in an array.
 * @module scanner
 */

module.exports = {

  /**
   * Configures the scan function
   *
   * @param {object} config - The configuration for the scanning
   * - `config.options` is passed to readdir
   * - [`config.filter`]{@link module:filter} filters the results from readdir
   *
   * @return {function} Scans based on the configuration
   **/
  configure: function(conf) {
    const log = loggers.$('deified.scanner.configure');
    log.trace({ args: { conf } }, 'enter');
    const config = Object.assign({}, defaultConfig, conf);
    log.debug({ configuration: config }, 'configuration set');

    /**
     * Recursively builds a list of files and directories for the specified
     * directory and all subdirectors - can be optionally filtered.
     *
     * @param {string} dir - The directory to list (ls)
     * @param {array} files - The array for appending files/directors
     * @return {array} The files argument
     **/
    const tree = async function(dir, files) {
      const log = loggers.$('deified.scanner.scan');
      log.debug('reading directory %s', dir);

      const filter = config.filter;
      const ls = await readdir(dir, config.options);

      for (let i = 0; i < ls.length; i++) {
        const file = path.join(dir, ls[i]);
        if (!filter || filter([file]).length) {

          log.trace('file %s passed through fitler', file);
          files.push(file);

          if ((await stat(file)).isDirectory()) {
            log.trace('directory %s found, recurse', file);
            await tree(file, files);
          }
          else {
            log.trace('file %s was filtered', file);
          }
        }
      }

      return files;
    };

    /**
     * Recursively scans directories
     *
     * @function scan
     *
     * @param {object} dirInfo - The information about the directory to scan
     * - `dirInfo.directory` is the directory to scan
     *
     * @return {array} All of the files and subdirectors - depth first
     **/
    return async function(dirInfo) {
      const log = loggers.$('deified.scanner.scan');
      log.trace({ args: { dirInfo } }, 'enter');
      const info = Object.assign({}, defaultInfo, dirInfo);
      log.debug({ configuration: config }, 'info set');

      return await tree(info.directory || defaultInfo.directory, []);
    };
  },
};
