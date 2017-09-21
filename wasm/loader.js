/* global WebAssembly */

// https://github.com/dcodeIO/webassembly/blob/master/src/index.js

const fs = require('fs');

function load(file, options = {}) {
  return new Promise((resolve, reject) => {
    const imports = options.imports || {};

    let memory = imports.memory;
    if (!memory) {
      const opts = { initial: options.initialMemory || 1 };
      if (options.maximumMemory) opts.maximum = options.maximumMemory;
      memory = new WebAssembly.Memory(opts);
      memory.initial = options.initialMemory || 1;
      memory.maximum = options.maximumMemory;
    }

    let table = imports.table;
    if (!table) table = new WebAssembly.Table({ initial: 0, element: 'anyfunc' });

    function grow() {
      let buf = memory.buffer;
      memory.U8 = new Uint8Array(buf);
      memory.S32 = new Int32Array(buf);
      memory.U32 = new Uint32Array(buf);
      memory.F32 = new Float32Array(buf);
      memory.F64 = new Float64Array(buf);
    }

    grow();

    const getInt = ptr => memory.S32[ptr >> 2];
    const getUint = ptr => memory.U32[ptr >> 2];
    const getFloat = ptr => memory.F32[ptr >> 2];
    const getDouble = ptr => memory.F64[ptr >> 3];
    function getString(ptr) {
      let start = ptr >>>= 0;
      while (memory.U8[ptr++]);
      getString.bytes = ptr - start;
      return String.fromCharCode.apply(null, memory.U8.subarray(start, ptr - 1));
    }
    memory.getInt = getInt;
    memory.getUint = getUint;
    memory.getFloat = getFloat;
    memory.getDouble = getDouble;
    memory.getString = getString;

    const env = {};

    env.memoryBase = imports.memoryBase || 0;
    env.memory = memory;
    env.tableBase = imports.tableBase || 0;
    env.table = table;

    function sprintf(ptr, base) {
      const s = getString(ptr);
      return base ?
        s.replace(/%([dfisu]|lf)/g, ($0, $1) => {
          let val;
          base +=
            $1 === 'u' ? (val = getUint(base), 4) :
              $1 === 'f' ? (val = getFloat(base), 4) :
                $1 === 's' ? (val = getString(getUint(base)), 4) :
                  $1 === 'lf' ? (val = getDouble(base), 8) :
                    (val = getInt(base), 4);
          return val;
        }) : s;
    }

    for (const key of Reflect.ownKeys(console)) {
      if (typeof console[key] !== 'function') continue; // eslint-disable-line no-console
      env[`console_${key}`] = (ptr, base) => console[key](sprintf(ptr, base)); // eslint-disable-line no-console
    }
    for (const key of Reflect.ownKeys(Math)) {
      if (typeof Math[key] === 'function') env[`Math_${key}`] = Math[key];
    }
    for (const key of Object.keys(imports)) env[key] = imports[key];
    if (!env._abort) env._abort = errno => { throw Error(`abnormal abort in ${file}: ${errno}`); };
    if (!env._exit) env._exit = code => { if (code) throw Error(`abnormal exit in ${file}: ${code}`); };
    env._grow = grow;

    fs.readFile(file, (err, data) => {
      if (err) reject(err);
      else resolve({ data, imports, memory, env });
    });
  })
    .then(({ data, imports, memory, env }) =>
      WebAssembly.instantiate(data, { env })
        .then(module => {
          const instance = module.instance;
          instance.imports = imports;
          instance.memory = memory;
          instance.env = env;
          return instance;
        }));
}


module.exports = { load };
