const { browser } = require('./util/Constants');
const querystring = require('querystring');
let erlpack;
try {
  erlpack = require('erlpack');
} catch (err) {
  erlpack = require('earl');
}

if (browser) {
  exports.WebSocket = window.WebSocket; // eslint-disable-line no-undef
} else {
  try {
    exports.WebSocket = require('uws');
  } catch (err) {
    exports.WebSocket = require('ws');
  }
}

exports.encoding = 'etf';

exports.pack = erlpack.pack;

exports.unpack = data => erlpack.unpack(data);

exports.create = (gateway, query = {}, ...args) => {
  const [g, q] = gateway.split('?');
  query.encoding = exports.encoding;
  if (q) query = Object.assign(querystring.parse(q), query);
  const ws = new exports.WebSocket(`${g}?${querystring.stringify(query)}`, ...args);
  if (browser) ws.binaryType = 'arraybuffer';
  return ws;
};

for (const state of ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']) exports[state] = exports.WebSocket[state];
