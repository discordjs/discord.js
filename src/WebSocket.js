const { browser } = require('./util/Constants');
const zlib = require('zlib');
const querystring = require('querystring');

if (browser) {
  exports.WebSocket = window.WebSocket; // eslint-disable-line no-undef
} else {
  try {
    exports.WebSocket = require('uws');
  } catch (err) {
    exports.WebSocket = require('ws');
  }
}

try {
  var erlpack = require('erlpack');
  if (!erlpack.pack) erlpack = null;
} catch (err) {} // eslint-disable-line no-empty

exports.encoding = erlpack ? 'etf' : 'json';

exports.pack = erlpack ? erlpack.pack : JSON.stringify;

exports.unpack = data => {
  if (Array.isArray(data)) data = Buffer.concat(data);
  if (!browser && data instanceof ArrayBuffer) data = Buffer.from(new Uint8Array(data));

  if (erlpack && typeof data !== 'string') {
    return erlpack.unpack(data);
  } else if (data instanceof ArrayBuffer || (!browser && data instanceof Buffer)) {
    data = zlib.inflateSync(data).toString();
  }
  return JSON.parse(data);
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
