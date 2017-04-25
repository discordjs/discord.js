const browser = require('os').platform() === 'browser';
const EventEmitter = require('events');
const Constants = require('../../util/Constants');
const zlib = require('zlib');
const PacketManager = require('./packets/WebSocketPacketManager');
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
    /**
     * WebSocket Manager of this connection
     * @type {WebSocketManager}
     */
    this.manager = manager;
    /**
     * Client this belongs to
     * @type {Client}
     */
    this.client = manager.client;
    /**
     * WebSocket connection itself
     * @type {WebSocket}
     */
    this.ws = null;
    /**
     * Current sequence of the WebSocket
     * @type {number}
     */
    this.sequence = -1;
    /**
     * Current status of the client
     * @type {number}
     */
    this.status = Constants.Status.IDLE;
    /**
     * Packet Manager of the connection
     * @type {WebSocketPacketManager}
     */
    this.packetManager = new PacketManager(this);
    /**
     * Last time a ping was sent (a timestamp)
     * @type {number}
     */
    this.pingSendTime = 0;
    /**
     * Contains the rate limit queue and metadata
     * @type {Object}
     */
    this.rateLimit = {
      queue: [],
      remaining: 120,
      resetTime: -1,
    };
    this.connect(gateway);
  }

  /**
   * Causes the client to be marked as ready and emits the ready event
   * @returns {void}
   */
  triggerReady() {
    if (this.status === Constants.Status.READY) return this.debug('Tried to mark self as ready, but already ready');
    this.status = Constants.Status.READY;
    this.client.emit(Constants.Events.READY);
    return this.packetManager.handleQueue();
  }

  /**
   * Checks whether the client is ready to be marked as ready
   * @returns {void}
   */
  checkIfReady() {
    if (this.status === Constants.Status.READY || this.status === Constants.Status.NEARLY) return false;
    let unavailableGuilds = 0;
    for (const guild of this.client.guilds.values()) {
      unavailableGuilds += guild.available ? 0 : 1;
    }
    if (unavailableGuilds === 0) {
      this.status = Constants.Status.NEARLY;
      if (!this.client.options.fetchAllMembers) return this.triggerReady();
      // Fetch all members before marking self as ready
      const promises = this.client.guilds.map(g => g.fetchMembers());
      Promise.all(promises)
        .then(() => this.triggerReady())
        .catch(e => {
          this.debug(`Failed to fetch all members before ready! ${e}`);
          this.triggerReady();
        });
    }
    return true;
  }

  // Util
  /**
   * Emits a debug message
   * @param {string} message Debug message
   * @returns {void}
   */
  debug(message) {
    if (message instanceof Error) message = message.stack;
    return this.manager.debug(`[connection] ${message}`);
  }

  /**
   * Attempts to serialise data from the WebSocket
   * @param {string|Object} data Data to unpack
   * @returns {Object}
   */
  unpack(data) {
    if (erlpack && typeof data !== 'string') {
      if (data instanceof ArrayBuffer) data = Buffer.from(new Uint8Array(data));
      return erlpack.unpack(data);
    } else if (data instanceof ArrayBuffer || data instanceof Buffer) {
      data = zlib.inflateSync(data).toString();
    }
    return JSON.parse(data);
  }

  /**
   * Packs an object ready to be sent
   * @param {Object} data Data to pack
   * @returns {string|Buffer}
   */
  pack(data) {
    return erlpack ? erlpack.pack(data) : JSON.stringify(data);
  }

  /**
   * Processes the current WebSocket queue
   */
  processQueue() {
    if (this.rateLimit.remaining === 0) return;
    if (this.rateLimit.queue.length === 0) return;
    if (this.rateLimit.remaining === 120) {
      this.rateLimit.resetTimer = setTimeout(() => {
        this.rateLimit.remaining = 120;
        this.processQueue();
      }, 120e3); // eslint-disable-line
    }
    while (this.rateLimit.remaining > 0) {
      const item = this.rateLimit.queue.shift();
      if (!item) return;
      this._send(item);
      this.rateLimit.remaining--;
    }
  }

  /**
   * Sends data, bypassing the queue
   * @param {Object} data Packet to send
   * @returns {void}
   */
  _send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return this.debug(`Tried to send packet ${data} but no WebSocket is available!`);
    }
    return this.ws.send(this.pack(data));
  }

  /**
   * Adds data to the queue to be sent
   * @param {Object} data Packet to send
   * @returns {void}
   */
  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return this.debug(`Tried to send packet ${data} but no WebSocket is available!`);
    }
    this.rateLimit.queue.push(data);
    return this.processQueue();
  }

  /**
   * Creates a connection to a gateway
   * @param {string} gateway Gateway to connect to
   * @param {number} [after=0] How long to wait before connecting
   * @param {boolean} [force=false] Whether or not to force a new connection even if one already exists
   * @returns {boolean}
   */
  connect(gateway = this.gateway, after = 0, force = false) {
    if (after) return this.client.setTimeout(() => this.connect(gateway, 0, force), after); // eslint-disable-line
    if (this.ws && !force) return this.debug('WebSocket connection already exists');
    if (typeof gateway !== 'string') return this.debug(`Tried to connect to an invalid gateway: ${gateway}`);

    this.gateway = gateway;
    this.debug(`Connecting to ${gateway}`);
    const ws = this.ws = new WebSocket(gateway);
    if (browser) ws.binaryType = 'arraybuffer';
    ws.onmessage = this.onMessage.bind(this);
    ws.onopen = this.onOpen.bind(this);
    ws.onerror = this.onError.bind(this);
    ws.onclose = this.onClose.bind(this);
    this.status = Constants.Status.CONNECTING;
    return true;
  }

  /**
   * Destroys the connection
   * @returns {boolean}
   */
  destroy() {
    const ws = this.ws;
    if (!ws) return this.debug('Attempted to destroy WebSocket but no connection exists!');
    this.heartbeat(-1);
    ws.close(1000);
    this.packetManager.handleQueue();
    this.ws = null;
    return true;
  }

  /**
   * Called whenever a message is received
   * @param {Event} event Event received
   * @returns {boolean}
   */
  onMessage(event) {
    try {
      this.onPacket(this.unpack(event.data));
      return true;
    } catch (err) {
      this.debug(err);
      return false;
    }
  }

  /**
   * Sets the current sequence of the connection
   * @param {number} s New sequence
   */
  setSequence(s) {
    this.sequence = s > this.sequence ? s : this.sequence;
  }

  /**
   * Called whenever a packet is received
   * @param {Object} packet received packet
   * @returns {boolean}
   */
  onPacket(packet) {
    if (!packet) return this.debug('Received null packet');
    this.client.emit('raw', packet);
    switch (packet.op) {
      case Constants.OPCodes.HELLO:
        return this.heartbeat(packet.d.heartbeat_interval);
      case Constants.OPCodes.RECONNECT:
        return this.reconnect();
      case Constants.OPCodes.INVALID_SESSION:
        if (!packet.d) this.sessionID = null;
        return this.identify(packet.d ? 2500 : 0);
      case Constants.OPCodes.HEARTBEAT_ACK:
        return this.ackHeartbeat();
      case Constants.OPCodes.HEARTBEAT:
        return this.heartbeat();
      default:
        return this.packetManager.handle(packet);
    }
  }

  /**
   * Called whenever a connection is opened to the gateway
   * @param {Event} event Received open event
   */
  onOpen(event) {
    this.gateway = event.target.url;
    this.debug(`Connected to gateway ${this.gateway}`);
    this.identify();
  }

  /**
   * Causes a reconnection to the gateway
   */
  reconnect() {
    this.client.emit(Constants.Events.RECONNECTING);
    this.connect(this.gateway, 5500, true);
  }

  /**
   * Called whenever an error occurs with the WebSocket
   * @param {Error} error Error that occurred
   */
  onError(error) {
    this.debug(error);
  }

  /**
   * @external CloseEvent
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent}
   */

  /**
   * Called whenever a connection to the gateway is closed
   * @param {CloseEvent} event Close event that was received
   */
  onClose(event) {
    this.debug(`Closed: ${event.code}`);
    // Reset the state before trying to fix anything
    this.emit('close', event);
    this.heartbeat(-1);
    // Should we reconnect?
    if (![1000, 4004, 4010, 4011].includes(event.code)) this.reconnect();
    else this.destroy();
  }

  // Heartbeat
  /**
   * Acknowledges a heartbeat
   */
  ackHeartbeat() {
    this.debug(`Heartbeat acknowledged, latency of ${Date.now() - this.pingSendTime}ms`);
    this.client._pong(this.pingSendTime);
  }

  /**
   * Sends a heartbeat or sets an interval for sending heartbeats.
   * @param {number} [time] If -1, clears the interval, any other number sets an interval.
   * If no value is given, a heartbeat will be sent instantly.
   */
  heartbeat(time) {
    if (!isNaN(time)) {
      if (time === -1) {
        this.debug('Clearing heartbeat interval');
        this.client.clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      } else {
        this.debug(`Setting a heartbeat interval for ${time}ms`);
        this.heartbeatInterval = this.client.setInterval(() => this.heartbeat(), time);
      }
      return;
    }
    this.debug('Sending a heartbeat');
    this.pingSendTime = Date.now();
    this.send({
      op: Constants.OPCodes.HEARTBEAT,
      d: this.sequence,
    });
  }

  // Identification
  /**
   * Identifies the client on a connection
   * @param {number} [after] How long to wait before identifying
   * @returns {void}
   */
  identify(after) {
    if (after) return this.client.setTimeout(this.identify.apply(this), after);
    return this.sessionID ? this.identifyResume() : this.identifyNew();
  }

  /**
   * Identifies as a new connection on the gateway
   * @returns {void}
   */
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
    this.debug('Identifying as a new session');
    return this.send({ op: Constants.OPCodes.IDENTIFY, d });
  }

  /**
   * Resumes a session on the gateway
   * @returns {void}
   */
  identifyResume() {
    if (!this.sessionID) {
      this.debug('Warning: wanted to resume but session ID not available; identifying as a new session instead');
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
