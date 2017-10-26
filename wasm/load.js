/* global WebAssembly */

const fs = require('fs');

module.exports = function load(file, imports = {}) {
  const raw = fs.readFileSync(file);
  return WebAssembly.compile(raw)
    .then(module => {
      imports.env = imports.env || {};
      imports.env.memoryBase = imports.env.memoryBase || 0;
      imports.env.tableBase = imports.env.tableBase || 0;
      if (!imports.env.memory) {
        imports.env.memory = new WebAssembly.Memory({ initial: 256 });
      }
      if (!imports.env.table) {
        imports.env.table = new WebAssembly.Table({ initial: 0, element: 'anyfunc' });
      }
      return new WebAssembly.Instance(module, imports);
    }).then(instance => ({
      instance,
      exports: new Proxy(instance.exports, { get(target, prop) {
        if (typeof prop === 'string') return target[`_${prop}`];
        return target[prop];
      } }),
    }));
};
