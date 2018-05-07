const pino = require('pino');

const defaultConfig = {
  name: "deified",
  level: 'info',
};

let logs = {};
const indexes = ['name', 'module', 'feature'];

module.exports = {
  configure: function(conf) {
    logs = {};

    const config = Object.assign({}, defaultConfig, conf);

    function createChild(depth, c, parent, parentage) {
      const childless = Object.assign({}, c);
      const children = c.children || [];

      childless.children = undefined;

      const child = parent.child(childless);
      const lineage = parentage.slice();
      const deep = depth + 1;

      lineage.push(c[indexes[depth]]);
      logs[lineage.join('_')] = child;
      (children).forEach(gc => createChild(deep, gc, child, lineage));

      if (depth == 0) {
        logs.l = function(module, feature) {
          return logs[[lineage[depth], module, feature].filter(x => x).join('_')];
        };
      }
    }

    createChild(0, config, pino(), []);
  },

  $: function(module, feature) {
    return logs.l && logs.l(module, feature) || pino().child({ module, feature });
  },
};
