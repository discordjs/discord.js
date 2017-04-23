const browser = require('os').platform() === 'browser';
const EventEmitter = require('events');
const Constants = require('../../util/Constants');
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
class WebSocketConnection extends EventEmitter {
  /**
   * @param {WebSocketManager} manager the WebSocket manager
   * @param {string} gateway Websocket gateway to connect to
   */
  constructor(manager, gateway) {
    super();
    this.manager = manager;
    this.client = manager.client;
    this.ws = null;
    this.connect(gateway);
  }

  debug(message) {
    return this.manager.debug(`[connection] ${message}`);
  }

  unpack(data) {
    if (erlpack && typeof data !== 'string') {
      if (data instanceof ArrayBuffer) data = Buffer.from(new Uint8Array(data));
      return erlpack.unpack(data);
    } else if (data instanceof ArrayBuffer || data instanceof Buffer) {
      return zlib.inflateSync(data).toString();
    }
    throw new Error('Failed to unpack');
  }

  pack(data) {
    return erlpack ? erlpack.pack(data) : JSON.stringify(data);
  }

  connect(gateway) {
    if (this.ws) return this.debug('WebSocket connection already exists');
    if (typeof gateway !== 'string') return this.debug(`Tried to connect to an invalid gateway: ${gateway}`);

    this.gateway = gateway;

    const ws = this.ws = new WebSocket(gateway);
    if (browser) ws.binaryType = 'arraybuffer';
    ws.onmessage = this.onMessage.bind(this);
    ws.onopen = this.onOpen.bind(this);
    ws.onerror = this.onError.bind(this);
    ws.onclose = this.onClose.bind(this);

    return true;
  }

  onMessage(event) {
    try {
      this.emit('packet', this.unpack(event.data));
      return true;
    } catch (err) {
      this.debug(err);
      return false;
    }
  }

  onOpen(event) {
    this.debug(`Connected to gateway ${this.gateway}`);
    this.identify();
  }

  onError(error) {

  }

  onClose(event) {

  }

  // Identification
  identify() {
    return this.sessionID ? this.identifyResume() : this.identifyNew();
  }

  identifyNew() {
    if (!this.client.token) {
      return this.debug('No token available to identify a new session with');
    }
    // Clone the generic payload and assign the token
    const d = Object.assign({ token: this.client.token }, this.client.options.ws);

    // Sharding stuff
    const { shardId, shardCount } = this.client.options;
    if (shardCount > 0) d.shard = [Number(shardId), Number(shardCount)];

    // Send the payload
    this.client.emit('debug', 'Identifying as a new session');
    return this.send({ op: Constants.OPCodes.IDENTIFY, d });
  }

  identifyResume() {
    if (!this.sessionID) {
      this.debug('warning: wanted to resume but session ID not available; identifying as a new session instead');
      return this.identifyNew();
    }
    this.debug(`Attempting to resume session ${this.sessionID}`);

    const d = {
      token: this.client.token,
      session_id: this.sessionID,
      seq: this.sequence,
    };

    return this.send({
      op: Constants.OPCodes.RESUME,
      d,
    });
  }
}

/**
 * Encoding the WebSocket connections will use
 * @type {string}
 */
WebSocketConnection.ENCODING = erlpack ? 'etf' : 'json';
WebSocketConnection.WebSocket = WebSocket;

module.exports = WebSocketConnection;
