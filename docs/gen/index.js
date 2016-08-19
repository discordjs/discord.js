let fs;
/* eslint no-console:0 no-return-assign:0 */
let parse;

const customDocs = require('../custom/index');

const GEN_VERSION = 6;

try {
  fs = require('fs-extra');
  parse = require('jsdoc-parse');
} catch (e) {
  console.log('Error loading fs-extra or jsdoc-parse:');
  console.log(e);
  process.exit();
}

console.log('Starting...');

let json = '';

const stream = parse({
  src: ['./src/*.js', './src/*/*.js', './src/**/*.js'],
  private: true,
});

const cwd = (`${process.cwd()}\\`).replace(/\\/g, '/');

const regex = /([\w]+)([^\w]+)/;
const regexG = /([\w]+)([^\w]+)/g;

function matchReturnName(str) {
  const matches = str.match(regexG);
  const output = [];
  if (matches) {
    for (const match of matches) {
      const groups = match.match(regex);
      output.push([groups[1], groups[2]]);
    }
  } else {
    output.push([str.match(/(\w+)/g), '']);
  }
  return output;
}

function cleanPaths() {
  for (const item of json) {
    if (item.meta && item.meta.path) {
      item.meta.path = item.meta.path.replace(/\\/g, '/').replace(cwd, '');
    }
  }
}

function clean() {
  const cleaned = {
    classes: {},
    interfaces: {},
    typedefs: {},
  };
  for (const item of json) {
    if (item.kind === 'class') {
      cleaned.classes[item.longname] = {
        meta: item,
        functions: [],
        properties: [],
        events: [],
      };
    } else if (item.kind === 'interface') {
      cleaned.interfaces[item.longname] = {
        meta: item,
        functions: [],
        properties: [],
        events: [],
      };
    } else if (item.kind === 'member') {
      const obj = cleaned.classes[item.memberof] || cleaned.interfaces[item.memberof];
      const newTypes = [];
      for (const name of item.type.names) {
        newTypes.push(matchReturnName(name));
      }
      item.type = newTypes;
      obj.properties.push(item);
    } else if (item.kind === 'function' && item.memberof) {
      const obj = cleaned.classes[item.memberof] || cleaned.interfaces[item.memberof];
      const newReturns = [];
      if (!item.returns) {
        item.returns = [{
          type: {
            names: ['null'],
          },
        }];
      }
      for (const name of item.returns[0].type.names) {
        newReturns.push(matchReturnName(name));
      }
      item.returns = newReturns;
      obj.functions.push(item);
    } else if (item.kind === 'typedef') {
      cleaned.typedefs[item.longname] = item;
    }
  }
  json = cleaned;
}

function next() {
  json = JSON.parse(json);
  cleanPaths();
  console.log('parsed inline code');
  clean();
  json = {
    meta: {
      version: GEN_VERSION,
    },
    custom: customDocs,
    json,
  };
  fs.writeFile('./docs/docs.json', JSON.stringify(json, null, 0), err => {
    if (err) {
      throw err;
    }
    console.log('done');
  });
}

stream.on('data', chunk => json += chunk.toString('utf-8'));
stream.on('end', () => next());
