import { browser } from './util/Constants';
import querystring from 'querystring';
import require from './util/require';

try {
  var erlpack = require('erlpack');
  if (!erlpack.pack) erlpack = null;
} catch (err) {} // eslint-disable-line no-empty

let wsImpl;
if (browser) {
  wsImpl = window.WebSocket; // eslint-disable-line no-undef
} else {
  try {
    wsImpl = require('uws');
  } catch (err) {
    wsImpl = require('ws');
  }
}

export const WebSocket = wsImpl;

export const encoding = erlpack ? 'etf' : 'json';
export const pack = erlpack ? erlpack.pack : JSON.stringify;

export function unpack(data) {
  if (!erlpack || data[0] === '{') return JSON.parse(data);
  if (!(data instanceof Buffer)) data = Buffer.from(new Uint8Array(data));
  return erlpack.unpack(data);
}

export function create(gateway, query = {}, ...args) {
  const [g, q] = gateway.split('?');
  query.encoding = exports.encoding;
  if (q) query = Object.assign(querystring.parse(q), query);
  const ws = new exports.WebSocket(`${g}?${querystring.stringify(query)}`, ...args);
  if (browser) ws.binaryType = 'arraybuffer';
  return ws;
}

export const CONNECTING = WebSocket.CONNECTING;
export const OPEN = WebSocket.OPEN;
export const CLOSING = WebSocket.CLOSING;
export const CLOSED = WebSocket.CLOSED;
