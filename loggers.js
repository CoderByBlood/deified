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

let configs = {};

const numberOfDots = function(string) {
  let result = 0;
  for (let i = 0; i < string.length; i++) {
    if (string[i] == '.') { result++ };
  }

  return result;
};

const toParentFQC = function(fqc) {
  return (fqc && fqc.replace(/[.]?[^.]+$/, '')) || '';
};


const toParentConfig = function(fqc) {
  let config = configs[fqc];
  for (let p = toParentFQC(fqc); !config && p; p = toParentFQC(p)) {
    config = configs[p];
  }

  return config;
};

const objectify = function(fqc, classes, def, obj) {
  const o = Object.assign({}, def, obj);
  const parts = (fqc || '').split('.');

  (classes || []).forEach((x, i) => {
    o[x] = o[x] || parts[i];
  });

  return o;
};

module.exports = {
  configure: function(conf) {
    configs = {};

    const config = Object.assign({}, defaultConfig, conf);
    const classes = config.classes;
    const defaultConf = { log: '' };

    configs._classes = classes;
    classes.forEach((claz, i) => {
      config.logs.filter(x => numberOfDots(x.log) === i).forEach(x => {
        const fqc = x.log;
        const logless = Object.assign({}, defaultConf, x);
        delete logless.log;

        configs[x.log] = objectify(fqc, classes, toParentConfig(fqc), logless);
      });
    });
  },

  $: function(fqc) {
    let config = configs[fqc];
    if (!config) {
      const parent = toParentConfig(fqc);

      if (parent) {
        config = objectify(fqc, configs._classes, parent);
      }
      else {
        config = objectify(fqc, configs._classes);
      }

      //cache for next time
      configs[fqc] = config;
    }

    return pino().child(config);
  },
};
