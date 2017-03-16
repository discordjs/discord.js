const browser = require('os').platform() === 'browser';
const EventEmitter = require('events');
const zlib = require('zlib');
const erlpack = (function findErlpack() {
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


class WebSocketConnection extends EventEmitter {
  constructor(gateway) {
    super();
    this.gateway = gateway;
    this.ws = new WebSocket(gateway);
    if (browser) this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.eventOpen.bind(this);
    this.ws.onclose = this.eventClose.bind(this);
    this.ws.onmessage = this.eventMessage.bind(this);
    this.ws.onerror = this.eventError.bind(this);
  }

  get readyState() {
    return this.ws.readyState;
  }

  close(code, reason) {
    return this.ws.close(code, reason);
  }

  eventOpen() {
    this.emit('open');
  }

  eventClose(event) {
    this.emit('close', event);
  }

  eventError(event) {
    this.emit('error', event);
  }

  eventMessage(event) {
    if (this.listenerCount('message')) this.emit('message', event);
    return this.unpack(event.data)
    .then(data => {
      if (this.ws.readyState !== this.ws.OPEN) return false;
      this.emit('packet', data);
      return true;
    })
    .catch(err => {
      if (this.listenerCount('decodeError')) this.emit('decodeError', err);
      return false;
    });
  }

  send(data) {
    return this.ws.send(this.pack(data));
  }

  pack(data) {
    return erlpack ? erlpack.pack(data) : JSON.stringify(data);
  }

  unpack(data) {
    if (erlpack && typeof data !== 'string') {
      if (data instanceof ArrayBuffer) data = Buffer.from(new Uint8Array(data));
      return Promise.resolve(erlpack.unpack(data));
    } else {
      if (data instanceof ArrayBuffer || data instanceof Buffer) {
        return this.inflate(data).then(JSON.parse);
      }
      return Promise.resolve(JSON.parse(data));
    }
  }

  inflate(data) {
    if (erlpack) return Promise.resolve(data);
    return new Promise((resolve, reject) => {
      zlib.inflate(data, (err, res) => {
        if (err) reject(err);
        else resolve(res.toString());
      });
    });
  }

  get encoding() {
    return this.constructor.encoding;
  }

  static get encoding() {
    return erlpack ? 'etf' : 'json';
  }
}

WebSocketConnection.CONNECTING = 0;
WebSocketConnection.OPEN = 1;
WebSocketConnection.CLOSING = 2;
WebSocketConnection.CLOSED = 3;

module.exports = WebSocketConnection;
