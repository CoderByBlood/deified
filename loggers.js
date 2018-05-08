const pino = require('pino');

const defaultConfig = {
  classes: ['name', 'module', 'feature'],
  logs: [],
};

let logs = {};

const lookup = function(name, module, feature) {
  return logs[[name, module, feature].filter(x => x).join('.')];
};

module.exports = {
  configure: function(conf) {
    logs = {};

    const config = Object.assign({}, defaultConfig, conf);
    const classes = config.classes;
    const defaultConf = { log: '' };
    const loggers = config.logs.map(x => {
      const logless = Object.assign({}, defaultConf, x);
      const log = logless.log.split('.');

      logless.log = undefined;
      return { log, config: logless };
    });

    function findParent(lineage) {
      let parent;
      for (let i = lineage.length - 1; i > 0 && !parent; --i) {
        parent = logs[lineage.splice(0, i).join('.')];
      }

      return parent || pino();
    }

    classes.forEach((claz, i) => {
      loggers.filter(x => x.log.length === i + 1).forEach(x => {
        x.config[claz] = x.log[i];
        logs[x.log.join('.')] = findParent(x.log).child(x.config);

        if (i == 0) {
          logs.l = function(module, feature) {
            return lookup(x.log[i], module, feature);
          };
        }
      });
    });
  },

  $: function(module, feature) {
    return logs.l && logs.l(module, feature) || pino().child({ module, feature });
  },

  _: function(name, module, feature) {
    return lookup(name, module, feature) || pino().child({ name, module, feature });
  },
};
