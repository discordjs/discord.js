/* eslint no-console:0 no-return-assign:0 */
const GEN_VERSION = require('./config.json').GEN_VERSION;
const compress = require('./config.json').COMPRESS;
const DocumentationScanner = require('./doc-scanner');
const Documentation = require('./documentation');
const fs = require('fs-extra');
const zlib = require('zlib');
const custom = require('../custom/index');

const docScanner = new DocumentationScanner(this);

function parseDocs(json) {
  console.log(`${json.length} items found`);
  const documentation = new Documentation(json, custom);
  console.log('serializing');
  let output = JSON.stringify(documentation.serialize(), null, 0);
  if (compress) {
    console.log('compressing');
    output = zlib.deflateSync(output).toString('utf8');
  }
  if (!process.argv.slice(2).includes('silent')) {
    console.log('writing to docs.json');
    fs.writeFileSync('./docs/docs.json', output);
  }
  console.log('done!');
  process.exit(0);
}

console.log(`using format version ${GEN_VERSION}`);
console.log('scanning for documentation');

docScanner.scan('./src/')
  .then(parseDocs)
  .catch(console.error);
