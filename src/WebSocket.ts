'use strict';

import { URLSearchParams } from 'url';
import type { FIXME } from './types';

const { browser } = require('./util/Constants');

let erlpack;

try {
  erlpack = require('erlpack');
  if (!erlpack.pack) erlpack = null;
} catch {} // eslint-disable-line no-empty

// @ts-ignore
const window = global.window ?? {};
export const TextDecoder = browser ? window.TextDecoder : require('util').TextDecoder;
export const WebSocket = browser ? window.WebSocket : require('ws');

const ab = new TextDecoder();

export const encoding = erlpack ? 'etf' : 'json';

export const pack = erlpack ? erlpack.pack : JSON.stringify;

export const unpack = (data, type) => {
  if (encoding === 'json' || type === 'json') {
    if (typeof data !== 'string') {
      data = ab.decode(data);
    }
    return JSON.parse(data);
  }
  if (!Buffer.isBuffer(data)) data = Buffer.from(new Uint8Array(data));
  return erlpack.unpack(data);
};

export const create = (gateway, query: FIXME = {}, ...args: FIXME) => {
  const [g, q] = gateway.split('?');
  query.encoding = encoding;
  query = new URLSearchParams(query);
  if (q) new URLSearchParams(q).forEach((v, k) => query.set(k, v));
  const ws = new WebSocket(`${g}?${query}`, ...args);
  if (browser) ws.binaryType = 'arraybuffer';
  return ws;
};

export const CONNECTING = WebSocket.CONNECTING;
export const OPEN = WebSocket.OPEN;
export const CLOSING = WebSocket.CLOSING;
export const CLOSED = WebSocket.CLOSED;
