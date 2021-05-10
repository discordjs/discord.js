'use strict';

const { WSEvents } = require('../../../util/Constants');

const handlers = {};

for (const name of Object.keys(WSEvents)) {
  handlers[name] = require(`./${name}.js`);
}

module.exports = handlers;
