const EventEmitter = require('events');
const WebSocket = require('../../WebSocket');
const { Status, Events, OPCodes, WSEvents, WSCodes } = require('../../util/Constants');
try {
  var zlib = require('zlib-sync');
  if (!zlib.Inflate) zlib = require('pako');
} catch (err) {
  zlib = require('pako');
}

/**
 * Represents a Shard's Websocket connection.
 */
class WebSocketShard extends EventEmitter {
  constructor(manager, id) {
    super();

    /**
     * The WebSocket Manager of this connection
     * @type {WebSocketManager}
     */
    this.manager = manager;

    /**
     * The id of the this shard.
     * @type {number}
     */
    this.id = id;

    /**
     * The current status of the shard
     * @type {number}
     */
    this.status = Status.IDLE;

    /**
     * The current sequence of the WebSocket
     * @type {number}
     */
    this.sequence = -1;
    this.pings = [];
    this.lastPingTimestamp = -1;
    this.sessionID = undefined;

    this.trace = undefined;

    /**
     * Contains the rate limit queue and metadata
     * @type {Object}
     */
    this.ratelimit = {
      queue: [],
      total: 120,
      remaining: 120,
      time: 60e3,
      timer: null,
    };

    this.inflate = null;

    this.connect();
  }

  get ping() {
    const sum = this.pings.reduce((a, b) => a + b, 0);
    return sum / this.pings.length;
  }

  /**
   * Emits a debug event.
   * @param {string} message Debug message
   */
  debug(message) {
    this.manager.debug(`[shard ${this.id}] ${message}`);
  }

  /**
   * Sends a heartbeat or sets an interval for sending heartbeats.
   * @param {number} [time] If -1, clears the interval, any other number sets an interval
   * If no value is given, a heartbeat will be sent instantly
   */
  heartbeat(time) {
    if (!isNaN(time)) {
      if (time === -1) {
        this.debug('Clearing heartbeat interval');
        this.manager.client.clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      } else {
        this.debug(`Setting a heartbeat interval for ${time}ms`);
        this.heartbeatInterval = this.manager.client.setInterval(() => this.heartbeat(), time);
      }
      return;
    }

    this.debug('Sending a heartbeat');
    this.lastPingTimestamp = Date.now();
    this.send({
      op: OPCodes.HEARTBEAT,
      d: this.sequence,
    });
  }

  /**
   * Acknowledges a heartbeat.
   */
  ackHeartbeat() {
    const latency = Date.now() - this.lastPingTimestamp;
    this.debug(`Heartbeat acknowledged, latency of ${latency}ms`);
    this.pings.unshift(latency);
    if (this.pings.length > 3) this.pings.length = 3;
  }

  /**
   * Connects the shard to a gateway.
   * @param {string} gateway The gateway to connect to
   */
  connect() {
    this.inflate = new zlib.Inflate({
      chunkSize: 65535,
      flush: zlib.Z_SYNC_FLUSH,
      to: WebSocket.encoding === 'json' ? 'string' : '',
    });
    const gateway = this.manager.gateway;
    this.debug(`Connecting to ${gateway}`);
    const ws = this.ws = WebSocket.create(gateway, {
      v: this.manager.client.options.ws.version,
      compress: 'zlib-stream',
    });
    ws.onopen = this.onOpen.bind(this);
    ws.onmessage = this.onMessage.bind(this);
    ws.onerror = this.onError.bind(this);
    ws.onclose = this.onClose.bind(this);
    this.status = Status.CONNECTING;
  }

  /**
   * Called whenever a packet is received
   * @param {Object} packet Packet received
   * @returns {boolean}
   */
  onPacket(packet) {
    if (!packet) {
      this.debug('Received null packet');
      return false;
    }

    this.manager.client.emit(Events.RAW, packet, this.id);

    switch (packet.t) {
      case WSEvents.READY:
        this.sessionID = packet.d.session_id;
        this.trace = packet.d._trace;
        this.status = Status.READY;
        this.debug(`READY ${this.trace.join(' -> ')} ${this.sessionID}`);
        this.heartbeat();
        break;
      case WSEvents.RESUMED: {
        this.trace = packet.d._trace;
        this.status = Status.READY;
        const replayed = packet.s - this.sequence;
        this.debug(`RESUMED ${this.trace.join(' -> ')} | replayed ${replayed} events.`);
        this.heartbeat();
        break;
      }
    }

    if (packet.s > this.sequence) this.sequence = packet.s;

    switch (packet.op) {
      case OPCodes.HELLO:
        this.identify();
        return this.heartbeat(packet.d.heartbeat_interval);
      case OPCodes.RECONNECT:
        return this.reconnect();
      case OPCodes.INVALID_SESSION:
        if (!packet.d) this.sessionID = null;
        this.sequence = -1;
        this.debug('Session invalidated');
        return this.reconnect();
      case OPCodes.HEARTBEAT_ACK:
        return this.ackHeartbeat();
      case OPCodes.HEARTBEAT:
        return this.heartbeat();
      default:
        return this.manager.handlePacket(packet, this);
    }
  }

  /**
   * Called whenever a connection is opened to the gateway.
   * @param {Event} event Received open event
   */
  onOpen() {
    this.debug('Connection open');
  }

  /**
   * Called whenever a message is received.
   * @param {Event} event Event received
   */
  onMessage({ data }) {
    if (data instanceof ArrayBuffer) data = new Uint8Array(data);
    const l = data.length;
    const flush = l >= 4 &&
      data[l - 4] === 0x00 &&
      data[l - 3] === 0x00 &&
      data[l - 2] === 0xFF &&
      data[l - 1] === 0xFF;

    this.inflate.push(data, flush && zlib.Z_SYNC_FLUSH);
    if (!flush) return;
    let packet;
    try {
      packet = WebSocket.unpack(this.inflate.result);
      this.manager.client.emit('raw', packet);
    } catch (err) {
      this.manager.client.emit(Events.ERROR, err);
      return;
    }
    if (packet.t === 'READY') {
      this.emit('ready');
    }
    this.onPacket(packet);
  }

  /**
   * Called whenever an error occurs with the WebSocket.
   * @param {Error} error The error that occurred
   */
  onError(error) {
    if (error && error.message === 'uWs client connection error') {
      this.reconnect();
      return;
    }
    this.manager.client.emit(Events.ERROR, error);
  }

  /**
   * @external CloseEvent
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent}
   */

  /**
   * Called whenever a connection to the gateway is closed.
   * @param {CloseEvent} event Close event that was received
   */
  onClose(event) {
    this.emit('close', event);
    if (event.code === 1000 ? this.expectingClose : WSCodes[event.code]) {
      this.manager.client.emit(Events.DISCONNECT, event, this.id);
      this.debug(WSCodes[event.code] || `Got code ${event.code}, not reconnecting`);
      return;
    }
    this.reconnect();
  }

  /**
   * Identifies the client on a connection.
   * @param {number} [after] How long to wait before identifying
   * @returns {void}
   */
  identify() {
    return this.sessionID ? this.identifyResume() : this.identifyNew();
  }

  /**
   * Identifies as a new connection on the gateway.
   * @returns {void}
   */
  identifyNew() {
    if (!this.manager.client.token) {
      this.debug('No token available to identify a new session with');
      return;
    }
    // Clone the generic payload and assign the token
    const d = Object.assign({ token: this.manager.client.token }, this.manager.client.options.ws);

    const { shardCount } = this.manager.client.options;
    d.shard = [this.id, Number(shardCount)];

    // Send the payload
    this.debug('Identifying as a new session');
    this.send({ op: OPCodes.IDENTIFY, d });
  }

  /**
   * Resumes a session on the gateway.
   * @returns {void}
   */
  identifyResume() {
    if (!this.sessionID) {
      this.debug('Warning: wanted to resume but session ID not available; identifying as a new session instead');
      return this.identifyNew();
    }
    this.debug(`Attempting to resume session ${this.sessionID}`);

    const d = {
      token: this.manager.client.token,
      session_id: this.sessionID,
      seq: this.sequence,
    };

    return this.send({
      op: OPCodes.RESUME,
      d,
    });
  }

  /**
   * Adds data to the queue to be sent.
   * @param {Object} data Packet to send
   */
  send(data) {
    this.ratelimit.queue.push(data);
    this.processQueue();
  }

  /**
   * Sends data, bypassing the queue.
   * @param {Object} data Packet to send
   */
  _send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.debug(`Tried to send packet ${data} but no WebSocket is available!`);
      return;
    }
    this.ws.send(WebSocket.pack(data));
  }

  /**
   * Processes the current WebSocket queue.
   */
  processQueue() {
    if (this.ratelimit.remaining === 0) return;
    if (this.ratelimit.queue.length === 0) return;
    if (this.ratelimit.remaining === this.ratelimit.total) {
      this.ratelimit.resetTimer = this.manager.client.setTimeout(() => {
        this.ratelimit.remaining = this.ratelimit.total;
        this.processQueue();
      }, this.ratelimit.time);
    }
    while (this.ratelimit.remaining > 0) {
      const item = this.ratelimit.queue.shift();
      if (!item) return;
      this._send(item);
      this.ratelimit.remaining--;
    }
  }

  reconnect() {
    this.heartbeat(-1);
    this.status = Status.RECONNECTING;
    this.manager.spawn(this.id);
  }

  destroy() {
    this.heartbeat(-1);
    this.expectingClose = true;
    if (this.ws) this.ws.close(1000);
    this.ws = null;
    this.status = Status.DISCONNECTED;
    this.ratelimit.remaining = this.ratelimit.total;
  }
}
module.exports = WebSocketShard;
