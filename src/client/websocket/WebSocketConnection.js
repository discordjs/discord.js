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

/**
 * Abstracts a WebSocket connection with decoding/encoding for the discord gateway
 * @private
 */
class WebSocketConnection extends WebSocket {
  /**
   * @param {string} gateway Websocket gateway to connect to
   */
  constructor(gateway) {
    super(gateway);
    this.e = new EventEmitter();
    if (browser) this.binaryType = 'arraybuffer';
    this.onmessage = this.eventMessage.bind(this);
    this.onopen = this.e.emit.bind(this.e, 'open');
    this.onclose = this.e.emit.bind(this.e, 'close');
    this.onerror = this.e.emit.bind(this.e, 'error');
  }

  /**
   * Called when the websocket gets a message
   * @param {Object} event Close event object
   * @returns {Promise<boolean>}
   */
  eventMessage(event) {
    try {
      const data = this.unpack(event.data);
      this.e.emit('packet', data);
      return true;
    } catch (err) {
      if (this.e.listenerCount('decodeError')) this.e.emit('decodeError', err);
      return false;
    }
  }

  /**
   * Send data over the websocket
   * @param {string|Buffer} data Data to send
   */
  send(data) {
    super.send(this.pack(data));
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
      return erlpack.unpack(data);
    } else {
      if (data instanceof ArrayBuffer || data instanceof Buffer) data = this.inflate(data);
      return JSON.parse(data);
    }
  }

  /**
   * Zlib inflate data
   * @param {string|Buffer} data Data to inflate
   * @returns {string|Buffer}
   */
  inflate(data) {
    return erlpack ? data : zlib.inflateSync(data).toString();
  }
}

/**
 * Encoding the WebSocket connections will use
 * @type {string}
 */
WebSocketConnection.ENCODING = erlpack ? 'etf' : 'json';

module.exports = WebSocketConnection;
