const { browser } = require('./util/Constants');
const querystring = require('querystring');
try {
  var erlpack = require('erlpack');
  if (!erlpack.pack) erlpack = null;
} catch (err) {} // eslint-disable-line no-empty

if (browser) {
  exports.WebSocket = window.WebSocket; // eslint-disable-line no-undef
} else {
  try {
    exports.WebSocket = require('uws');
  } catch (err) {
    exports.WebSocket = require('ws');
  }
}

exports.encoding = erlpack ? 'etf' : 'json';

exports.pack = erlpack ? erlpack.pack : JSON.stringify;

exports.unpack = data => {
  if (!erlpack || data[0] === '{') return JSON.parse(data);
  if (!(data instanceof Buffer)) data = Buffer.from(new Uint8Array(data));
  return erlpack.unpack(data);
};

exports.create = (gateway, query = {}, ...args) => {
  const [g, q] = gateway.split('?');
  query.encoding = exports.encoding;
  if (q) query = Object.assign(querystring.parse(q), query);
  const ws = new exports.WebSocket(`${g}?${querystring.stringify(query)}`, ...args);
  if (browser) ws.binaryType = 'arraybuffer';
  return ws;
};

for (const state of ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']) exports[state] = exports.WebSocket[state];
