'use strict';

const { WSEvents } = require('../../../util/Constants');

const handlers = {};

for (const name of Object.keys(WSEvents)) {
  try {
    handlers[name] = require(`./${name}.js`);
  } catch (err) {} // eslint-disable-line no-empty
}

module.exports = handlers;
