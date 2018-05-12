/* MIT License
 *
 * Copyright (c) 2018 Coder by Blood, Inc.
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
