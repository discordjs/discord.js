/* eslint-disable no-console */
const fs = require('fs-extra');
const zlib = require('zlib');
const jsdoc2md = require('jsdoc-to-markdown');
const Documentation = require('./documentation');
const custom = require('../custom/index');
const config = require('./config');

process.on('unhandledRejection', console.error);

console.log(`Using format version ${config.GEN_VERSION}.`);
console.log('Parsing JSDocs in source files...');

jsdoc2md.getTemplateData({ files: [`./src/*.js`, `./src/**/*.js`] }).then(data => {
  console.log(`${data.length} items found.`);
  const documentation = new Documentation(data, custom);
  console.log('Serializing...');
  let output = JSON.stringify(documentation.serialize(), null, 0);
  if (config.compress) {
    console.log('Compressing...');
    output = zlib.deflateSync(output).toString('utf8');
  }
  if (!process.argv.slice(2).includes('silent')) {
    console.log('Writing to docs.json...');
    fs.writeFileSync('./docs/docs.json', output);
  }
  console.log('Done!');
  process.exit(0);
}).catch(console.error);
