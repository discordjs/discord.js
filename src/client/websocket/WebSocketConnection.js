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
  /**
   * @param {string} gateway Websocket gateway to connect to
   */
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

  /**
   * @type {number}
   */
  get readyState() {
    return this.ws.readyState;
  }

  /**
   * Close the websocket
   * @param {number} code Code to close with
   * @param {string} [reason] Human readable reason
   */
  close(code, reason) {
    this.ws.close(code, reason);
  }

  /**
   * Called when the websocket opens
   */
  eventOpen() {
    this.emit('open');
  }

  /**
   * Called when the websocket closes
   * @param {Object} event Close event object
   */
  eventClose(event) {
    this.emit('close', event);
  }

  /**
   * Called when the websocket errors
   * @param {Object} event Error event object
   */
  eventError(event) {
    this.emit('error', event);
  }

  /**
   * Called when the websocket gets a message
   * @param {Object} event Close event object
   * @returns {Promise<boolean>}
   */
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

  /**
   * Send data over the websocket
   * @param {string|Buffer} data Data to send
   */
  send(data) {
    this.ws.send(this.pack(data));
  }

  /**
   * Pack data using JSON or Erlpack
   * @param {*} data Data to pack
   * @returns {string|Buffer}
   */
  pack(data) {
    return erlpack ? erlpack.pack(data) : JSON.stringify(data);
  }

  /**
   * Unpack data using JSON or Erlpack
   * @param {string|ArrayBuffer|Buffer} data Data to unpack
   * @returns {string|Object}
   */
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

  /**
   * Zlib inflate data
   * @param {string|Buffer} data Data to inflate
   * @returns {string|Buffer}
   */
  inflate(data) {
    if (erlpack) return Promise.resolve(data);
    return new Promise((resolve, reject) => {
      zlib.inflate(data, (err, res) => {
        if (err) reject(err);
        else resolve(res.toString());
      });
    });
  }

  /**
   * The encoding this connection will use
   * @type {string}
   * @static
   */
  static get encoding() {
    return erlpack ? 'etf' : 'json';
  }
}

WebSocketConnection.CONNECTING = 0;
WebSocketConnection.OPEN = 1;
WebSocketConnection.CLOSING = 2;
WebSocketConnection.CLOSED = 3;

module.exports = WebSocketConnection;
