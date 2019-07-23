'use strict';

const { browser } = require('./util/Constants');

let erlpack;

try {
  erlpack = require('erlpack');
  if (!erlpack.pack) erlpack = null;
} catch {} // eslint-disable-line no-empty

let TextDecoder;

if (browser) {
  TextDecoder = window.TextDecoder; // eslint-disable-line no-undef
  exports.WebSocket = window.WebSocket; // eslint-disable-line no-undef
} else {
  TextDecoder = require('util').TextDecoder;
  exports.WebSocket = require('ws');
}

const ab = new TextDecoder();

exports.encoding = erlpack ? 'etf' : 'json';

exports.pack = erlpack ? erlpack.pack : JSON.stringify;

exports.unpack = (data, type) => {
  if (exports.encoding === 'json' || type === 'json') {
    if (typeof data !== 'string') {
      data = ab.decode(data);
    }
    return JSON.parse(data);
  }
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
