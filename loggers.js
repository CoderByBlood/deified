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

const pino = require('pino');

const defaultConfig = {
  classes: ['name', 'module', 'feature'],
  logs: [],
};

let logs = {};

const toKey = function(parts) {
  return parts.filter(x => x).join('.');
};

const toParts = function(key) {
  return key.split('.');
};

const toParentKey = function(parts) {
  return toKey(parts.slice(0, parts.length - 1));
};

const objectify = function(fqc, classes) {
  const o = {};
  const parts = toParts(fqc || '');

  classes.forEach((x, i) => {
    o[x] = parts[i];
  });

  return o;
};

module.exports = {
  configure: function(conf) {
    logs = {};

    const config = Object.assign({}, defaultConfig, conf);
    const classes = config.classes;
    const defaultConf = { log: '' };
    const loggers = config.logs.map(x => {
      const logless = Object.assign({}, defaultConf, x);
      const log = toParts(logless.log);

      logless.log = undefined;
      return { log, config: logless };
    });

    function findParent(lineage) {
      let parent;
      for (let i = lineage.length - 1; i > 0 && !parent; --i) {
        parent = logs[toKey(lineage.slice(0, i))];
      }

      return parent || pino();
    }

    classes.forEach((claz, i) => {
      loggers.filter(x => x.log.length === i + 1).forEach(x => {
        const key = toKey(x.log);
        const parentKey = toParentKey(x.log);

        //if we skipped a classification, fill it in
        if (parentKey && !logs[parentKey]) {
          const parentConfig = {};

          parentConfig[classes[i - 1]] = x.log[i - 1];
          logs[parentKey] = findParent(x.log).child(parentConfig);
        }

        x.config[claz] = x.log[i];
        logs[key] = findParent(x.log).child(x.config);

        if (i === 0) {
          logs._ = function(fqc) {
            return logs[fqc] || pino().child(objectify(fqc, classes));
          };
        }
      });
    });
  },

  $: function(fqc) {
    return logs._ && logs._(fqc) ||
      pino().child(objectify(fqc, defaultConfig.classes));
  },
};
