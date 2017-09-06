const zlib = require('zlib');

try {
  exports.WebSocket = require('uws');
} catch (err) {
  exports.WebSocket = require('ws');
}

try {
  var erlpack = require('erlpack');
  if (!erlpack.pack) erlpack = null;
} catch (err) {} // eslint-disable-line no-empty

exports.encoding = erlpack ? 'etf' : 'json';

exports.pack = erlpack ? erlpack.pack : JSON.stringify;

exports.unpack = data => {
  if (Array.isArray(data)) data = Buffer.concat(data);
  if (data instanceof ArrayBuffer) data = Buffer.from(new Uint8Array(data));

  if (erlpack && typeof data !== 'string') return erlpack.unpack(data);
  else if (data instanceof Buffer) data = zlib.inflateSync(data).toString();
  return JSON.parse(data);
};
