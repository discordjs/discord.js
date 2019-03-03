'use strict';

const EventEmitter = require('events');
const WebSocket = require('../../WebSocket');
const { Status, Events, OPCodes, WSEvents, WSCodes } = require('../../util/Constants');
const Util = require('../../util/Util');

let zlib;
try {
  zlib = require('zlib-sync');
  if (!zlib.Inflate) zlib = require('pako');
} catch (err) {
  zlib = require('pako');
}

/**
 * Represents a Shard's WebSocket connection
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
     * The ID of the this shard
     * @type {number}
     */
    this.id = id;

    /**
     * The current status of the shard
     * @type {Status}
     */
    this.status = Status.IDLE;

    /**
     * The current sequence of the shard
     * @type {number}
     * @private
     */
    this.sequence = -1;

    /**
     * The sequence of the shard after close
     * @type {number}
     * @private
     */
    this.closeSequence = 0;

    /**
     * The current session ID of the shard
     * @type {string}
     * @private
     */
    this.sessionID = undefined;

    /**
     * The previous 3 heartbeat pings of the shard (most recent first)
     * @type {number[]}
     */
    this.pings = [];

    /**
     * The last time a ping was sent (a timestamp)
     * @type {number}
     * @private
     */
    this.lastPingTimestamp = -1;

    /**
     * If we received a heartbeat ack back. Used to identify zombie connections
     * @type {boolean}
     * @private
     */
    this.lastHeartbeatAcked = true;

    /**
     * List of servers the shard is connected to
     * @type {string[]}
     * @private
     */
    this.trace = [];

    /**
     * Contains the rate limit queue and metadata
     * @type {Object}
     * @private
     */
    this.ratelimit = {
      queue: [],
      total: 120,
      remaining: 120,
      time: 60e3,
      timer: null,
    };

    /**
     * The WebSocket connection for the current shard
     * @type {?WebSocket}
     * @private
     */
    this.connection = null;

    /**
     * @external Inflate
     * @see {@link https://www.npmjs.com/package/zlib-sync}
     */

    /**
     * The compression to use
     * @type {?Inflate}
     * @private
     */
    this.inflate = null;

    if (this.manager.gateway) this.connect();
  }

  /**
   * Average heartbeat ping of the websocket, obtained by averaging the WebSocketShard#pings property
   * @type {number}
   * @readonly
   */
  get ping() {
    const sum = this.pings.reduce((a, b) => a + b, 0);
    return sum / this.pings.length;
  }

  /**
   * Emits a debug event.
   * @param {string} message Debug message
   * @private
   */
  debug(message) {
    this.manager.debug(`[Shard ${this.id}] ${message}`);
  }

  /**
   * Sends a heartbeat to the WebSocket.
   * If this shard didn't receive a heartbeat last time, it will destroy it and reconnect
   * @private
   */
  sendHeartbeat() {
    if (!this.lastHeartbeatAcked) {
      this.debug("Didn't receive a heartbeat ack last time, assuming zombie conenction. Destroying and reconnecting.");
      this.connection.close(4000);
      return;
    }
    this.debug('Sending a heartbeat');
    this.lastHeartbeatAcked = false;
    this.lastPingTimestamp = Date.now();
    this.send({ op: OPCodes.HEARTBEAT, d: this.sequence });
  }

  /**
   * Sets the heartbeat timer for this shard.
   * @param {number} time If -1, clears the interval, any other number sets an interval
   * @private
   */
  setHeartbeatTimer(time) {
    if (time === -1) {
      if (this.heartbeatInterval) {
        this.debug('Clearing heartbeat interval');
        this.manager.client.clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
      return;
    }
    this.debug(`Setting a heartbeat interval for ${time}ms`);
    this.heartbeatInterval = this.manager.client.setInterval(() => this.sendHeartbeat(), time);
  }

  /**
   * Acknowledges a heartbeat.
   * @private
   */
  ackHeartbeat() {
    this.lastHeartbeatAcked = true;
    const latency = Date.now() - this.lastPingTimestamp;
    this.debug(`Heartbeat acknowledged, latency of ${latency}ms`);
    this.pings.unshift(latency);
    if (this.pings.length > 3) this.pings.length = 3;
  }

  /**
   * Connects this shard to the gateway.
   * @private
   */
  connect() {
    const { expectingClose, gateway } = this.manager;
    if (expectingClose) return;
    this.inflate = new zlib.Inflate({
      chunkSize: 65535,
      flush: zlib.Z_SYNC_FLUSH,
      to: WebSocket.encoding === 'json' ? 'string' : '',
    });
    this.debug(`Connecting to ${gateway}`);
    const ws = this.connection = WebSocket.create(gateway, {
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
   * Called whenever a connection is opened to the gateway.
   * @private
   */
  onOpen() {
    this.debug('Connected to the gateway');
  }

  /**
   * Called whenever a message is received.
   * @param {Event} event Event received
   * @private
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
      this.manager.client.emit(Events.RAW, packet, this.id);
    } catch (err) {
      this.manager.client.emit(Events.ERROR, err);
      return;
    }
    this.onPacket(packet);
  }

  /**
   * Called whenever a packet is received.
   * @param {Object} packet Packet received
   * @private
   */
  onPacket(packet) {
    if (!packet) {
      this.debug('Received null or broken packet');
      return;
    }

    switch (packet.t) {
      case WSEvents.READY:
        /**
         * Emitted when a shard becomes ready.
         * @event WebSocketShard#ready
         */
        this.emit(Events.READY);
        /**
         * Emitted when a shard becomes ready.
         * @event Client#shardReady
         * @param {number} shardID The ID of the shard
         */
        this.manager.client.emit(Events.SHARD_READY, this.id);

        this.sessionID = packet.d.session_id;
        this.trace = packet.d._trace;
        this.status = Status.READY;
        this.debug(`READY ${this.trace.join(' -> ')} | Session ${this.sessionID}`);
        this.lastHeartbeatAcked = true;
        this.sendHeartbeat();
        break;
      case WSEvents.RESUMED: {
        this.emit(Events.RESUMED);
        this.trace = packet.d._trace;
        this.status = Status.READY;
        const replayed = packet.s - this.closeSequence;
        this.debug(`RESUMED ${this.trace.join(' -> ')} | Replayed ${replayed} events.`);
        this.lastHeartbeatAcked = true;
        this.sendHeartbeat();
        break;
      }
    }

    if (packet.s > this.sequence) this.sequence = packet.s;

    switch (packet.op) {
      case OPCodes.HELLO:
        this.setHeartbeatTimer(packet.d.heartbeat_interval);
        this.identify();
        break;
      case OPCodes.RECONNECT:
        this.connection.close(1001);
        break;
      case OPCodes.INVALID_SESSION:
        this.debug(`Session was invalidated. Resumable: ${packet.d}.`);
        // If the session isn't resumable
        if (!packet.d) {
          // Reset the sequence, since it isn't valid anymore
          this.sequence = -1;
          // If we had a session ID before
          if (this.sessionID) {
            this.sessionID = null;
            this.connection.close(1000);
            return;
          }
          this.connection.close(1000);
          return;
        }
        this.identifyResume();
        break;
      case OPCodes.HEARTBEAT_ACK:
        this.ackHeartbeat();
        break;
      case OPCodes.HEARTBEAT:
        this.sendHeartbeat();
        break;
      default:
        this.manager.handlePacket(packet, this);
    }
  }

  /**
   * Identifies the client on a connection.
   * @returns {void}
   * @private
   */
  identify() {
    return this.sessionID ? this.identifyResume() : this.identifyNew();
  }

  /**
   * Identifies as a new connection on the gateway.
   * @private
   */
  identifyNew() {
    if (!this.manager.client.token) {
      this.debug('No token available to identify a new session with');
      return;
    }
    // Clone the generic payload and assign the token
    const d = {
      ...this.manager.client.options.ws,
      token: this.manager.client.token,
      shard: [this.id, Number(this.manager.client.options.totalShardCount)],
    };

    // Send the payload
    this.debug('Identifying as a new session');
    this.send({ op: OPCodes.IDENTIFY, d });
  }

  /**
   * Resumes a session on the gateway.
   * @returns {void}
   * @private
   */
  identifyResume() {
    if (!this.sessionID) {
      this.debug('Warning: wanted to resume but session ID not available; identifying as a new session instead');
      return this.identifyNew();
    }

    this.debug(`Attempting to resume session ${this.sessionID} at sequence ${this.closeSequence}`);

    const d = {
      token: this.manager.client.token,
      session_id: this.sessionID,
      seq: this.closeSequence,
    };

    return this.send({ op: OPCodes.RESUME, d });
  }

  /**
   * Called whenever an error occurs with the WebSocket.
   * @param {Error} error The error that occurred
   * @private
   */
  onError(error) {
    if (error && error.message === 'uWs client connection error') {
      this.connection.close(4000);
      return;
    }

    /**
     * Emitted whenever the client's WebSocket encounters a connection error.
     * @event Client#error
     * @param {Error} error The encountered error
     * @param {number} shardID The shard that encountered this error
     */
    this.manager.client.emit(Events.ERROR, error, this.id);
  }

  /**
   * @external CloseEvent
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent}
   */

  /**
   * Called whenever a connection to the gateway is closed.
   * @param {CloseEvent} event Close event that was received
   * @private
   */
  onClose(event) {
    this.closeSequence = this.sequence;
    this.debug(`WebSocket was closed.
      Event Code: ${event.code}
      Reason: ${event.reason}`);

    if (event.code === 1000 ? this.manager.expectingClose : WSCodes[event.code]) {
      /**
       * Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
       * @event Client#disconnect
       * @param {CloseEvent} event The WebSocket close event
       * @param {number} shardID The shard that disconnected
       */
      this.manager.client.emit(Events.DISCONNECT, event, this.id);
      this.debug(WSCodes[event.code]);
      return;
    }

    this.destroy();

    this.status = Status.RECONNECTING;

    /**
     * Emitted whenever a shard tries to reconnect to the WebSocket.
     * @event Client#reconnecting
     * @param {number} shardID The shard ID that is reconnecting
     */
    this.manager.client.emit(Events.RECONNECTING, this.id);

    this.debug(`${this.sessionID ? `Reconnecting in 3500ms` : 'Queueing a reconnect'} to the gateway...`);

    if (this.sessionID) {
      Util.delayFor(3500).then(() => this.connect());
    } else {
      this.manager.reconnect(this);
    }
  }

  /**
   * Adds data to the queue to be sent.
   * @param {Object} data Packet to send
   * @private
   * @returns {void}
   */
  send(data) {
    this.ratelimit.queue.push(data);
    this.processQueue();
  }

  /**
   * Sends data, bypassing the queue.
   * @param {Object} data Packet to send
   * @returns {void}
   * @private
   */
  _send(data) {
    if (!this.connection || this.connection.readyState !== WebSocket.OPEN) {
      this.debug(`Tried to send packet ${JSON.stringify(data)} but no WebSocket is available!`);
      return;
    }

    this.connection.send(WebSocket.pack(data), err => {
      if (err) this.manager.client.emit(Events.ERROR, err);
    });
  }

  /**
   * Processes the current WebSocket queue.
   * @returns {void}
   * @private
   */
  processQueue() {
    if (this.ratelimit.remaining === 0) return;
    if (this.ratelimit.queue.length === 0) return;
    if (this.ratelimit.remaining === this.ratelimit.total) {
      this.ratelimit.timer = this.manager.client.setTimeout(() => {
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

  /**
   * Destroys this shard and closes its connection.
   * @private
   */
  destroy() {
    this.setHeartbeatTimer(-1);
    if (this.connection) this.connection.close(1000);
    this.connection = null;
    this.status = Status.DISCONNECTED;
    this.ratelimit.remaining = this.ratelimit.total;
    this.ratelimit.queue.length = 0;
    if (this.ratelimit.timer) {
      this.manager.client.clearTimeout(this.ratelimit.timer);
      this.ratelimit.timer = null;
    }
    this.sequence = -1;
  }
}

module.exports = WebSocketShard;
