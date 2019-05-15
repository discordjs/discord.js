'use strict';

const { browser } = require('./util/Constants');
try {
  var erlpack = require('erlpack');
  if (!erlpack.pack) erlpack = null;
} catch (err) {} // eslint-disable-line no-empty

if (browser) {
  exports.WebSocket = window.WebSocket; // eslint-disable-line no-undef
} else {
  try {
    exports.WebSocket = require('@discordjs/uws');
  } catch (err) {
    exports.WebSocket = require('ws');
  }
}

exports.encoding = erlpack ? 'etf' : 'json';

exports.pack = erlpack ? erlpack.pack : JSON.stringify;

exports.unpack = data => {
  if (!erlpack || data[0] === '{') return JSON.parse(data);
  if (!Buffer.isBuffer(data)) data = Buffer.from(new Uint8Array(data));
  return erlpack.unpack(data);
};

exports.create = (gateway, query = {}, ...args) => {
  const [g, q] = gateway.split('?');
  query.encoding = exports.encoding;
  query = new URLSearchParams(query);
  if (q) new URLSearchParams(q).forEach((v, k) => query.set(k, v));
  const ws = new exports.WebSocket(`${g}?${query}`, ...args);
  if (browser) ws.binaryType = 'arraybuffer';
  return ws;
};

for (const state of ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']) exports[state] = exports.WebSocket[state];
