const browser = require('os').platform() === 'browser';
const EventEmitter = require('events');
const zlib = require('zlib');
const erlpack = (function findErlpack() {
  if (browser) return null;
  try {
    const e = require('erlpack');
    if (!e.pack) return null;
    return e;
  } catch (e) {
    return null;
  }
}());

const WebSocket = (function findWebSocket() {
  if (browser) return window.WebSocket; // eslint-disable-line no-undef
  try {
    return require('uws');
  } catch (e) {
    return require('ws');
  }
}());

class WebSocketTransport extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
    this.ws = null;
    this.tries = 0;
    this.client_id = null;
    this.origin = null;
  }

  connect(options, tries = this.tries) {
    if (this.connected) return;
    const port = 6463 + (tries % 10);
    this.hostAndPort = `127.0.0.1:${port}`;
    const cid = this.client.clientID;
    this.ws = new WebSocket(
      `ws://${this.hostAndPort}/?v=1&encoding=${erlpack ? 'etf' : 'json'}${cid ? `&client_id=${cid}` : ''}`,
      typeof window === 'undefined' ? { origin: this.client.options._login.origin } : undefined
    );
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
  }

  send(data) {
    if (!this.ws) return;
    this.ws.send(encode(data));
  }

  close() {
    if (!this.ws) return;
    this.ws.close();
  }

  ping() {} // eslint-disable-line no-empty-function

  onMessage(event) {
    this.emit('message', decode(event.data));
  }

  onOpen() {
    this.client.rest.endpoint = `http://${this.hostAndPort}`;
    this.client.rest.versioned = false;
    this.emit('open');
  }

  onClose(e) {
    try {
      this.ws.close();
    } catch (err) {} // eslint-disable-line no-empty
    setTimeout(() => this.connect(undefined, e.code === 1006 ? ++this.tries : 0), 250);
  }
}

/**
 * Attempts to serialise data from the WebSocket.
 * @param {string|Object} data Data to unpack
 * @returns {Object}
 */
function decode(data) {
  if (Array.isArray(data)) data = Buffer.concat(data);
  if (data instanceof ArrayBuffer) data = Buffer.from(new Uint8Array(data));

  if (erlpack && typeof data !== 'string') return erlpack.unpack(data);
  else if (data instanceof Buffer) data = zlib.inflateSync(data).toString();

  return JSON.parse(data);
}

function encode(data) {
  return erlpack ? erlpack.pack(data) : JSON.stringify(data);
}

module.exports = WebSocketTransport;
module.exports.encode = encode;
module.exports.decode = decode;
