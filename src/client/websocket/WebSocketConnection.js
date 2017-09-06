const EventEmitter = require('events');
const Constants = require('../../util/Constants');
const PacketManager = require('./packets/WebSocketPacketManager');
const WebSocket = require('../../WebSocket');

/**
 * Abstracts a WebSocket connection with decoding/encoding for the Discord gateway.
 * @private
 */
class WebSocketConnection extends EventEmitter {
  /**
   * @param {WebSocketManager} manager The WebSocket manager
   * @param {string} gateway The WebSocket gateway to connect to
   */
  constructor(manager, gateway) {
    super();
    /**
     * The WebSocket Manager of this connection
     * @type {WebSocketManager}
     */
    this.manager = manager;

    /**
     * The client this belongs to
     * @type {Client}
     */
    this.client = manager.client;

    /**
     * The WebSocket connection itself
     * @type {WebSocket}
     */
    this.ws = null;

    /**
     * The current sequence of the WebSocket
     * @type {number}
     */
    this.sequence = -1;

    /**
     * The current status of the client
     * @type {number}
     */
    this.status = Constants.Status.IDLE;

    /**
     * The Packet Manager of the connection
     * @type {WebSocketPacketManager}
     */
    this.packetManager = new PacketManager(this);

    /**
     * The last time a ping was sent (a timestamp)
     * @type {number}
     */
    this.lastPingTimestamp = 0;

    /**
     * Contains the rate limit queue and metadata
     * @type {Object}
     */
    this.ratelimit = {
      queue: [],
      remaining: 60,
      total: 60,
      resetTimer: null,
    };
    this.connect(gateway);

    /**
     * Events that are disabled (will not be processed)
     * @type {Object}
     */
    this.disabledEvents = {};

    /**
     * The sequence on WebSocket close
     * @type {number}
     */
    this.closeSequence = 0;

    /**
     * Whether or not the WebSocket is expecting to be closed
     * @type {boolean}
     */
    this.expectingClose = false;
    for (const event of this.client.options.disabledEvents) this.disabledEvents[event] = true;
  }

  /**
   * Causes the client to be marked as ready and emits the ready event.
   * @returns {void}
   */
  triggerReady() {
    if (this.status === Constants.Status.READY) {
      this.debug('Tried to mark self as ready, but already ready');
      return;
    }
    /**
     * Emitted when the client becomes ready to start working.
     * @event Client#ready
     */
    this.status = Constants.Status.READY;
    this.client.emit(Constants.Events.READY);
    this.packetManager.handleQueue();
  }

  /**
   * Checks whether the client is ready to be marked as ready.
   * @returns {void}
   */
  checkIfReady() {
    if (this.status === Constants.Status.READY || this.status === Constants.Status.NEARLY) return false;
    let unavailableGuilds = 0;
    for (const guild of this.client.guilds.values()) {
      if (!guild.available) unavailableGuilds++;
    }
    if (unavailableGuilds === 0) {
      this.status = Constants.Status.NEARLY;
      if (!this.client.options.fetchAllMembers) return this.triggerReady();
      // Fetch all members before marking self as ready
      const promises = this.client.guilds.map(g => g.members.fetch());
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
   * Emits a debug message.
   * @param {string} message Debug message
   * @returns {void}
   */
  debug(message) {
    if (message instanceof Error) message = message.stack;
    return this.manager.debug(`[connection] ${message}`);
  }

  /**
   * Processes the current WebSocket queue.
   */
  processQueue() {
    if (this.ratelimit.remaining === 0) return;
    if (this.ratelimit.queue.length === 0) return;
    if (this.ratelimit.remaining === this.ratelimit.total) {
      this.ratelimit.resetTimer = this.client.setTimeout(() => {
        this.ratelimit.remaining = this.ratelimit.total;
        this.processQueue();
      }, 120e3);
    }
    while (this.ratelimit.remaining > 0) {
      const item = this.ratelimit.queue.shift();
      if (!item) return;
      this._send(item);
      this.ratelimit.remaining--;
    }
  }

  /**
   * Sends data, bypassing the queue.
   * @param {Object} data Packet to send
   * @returns {void}
   */
  _send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.debug(`Tried to send packet ${data} but no WebSocket is available!`);
      return;
    }
    this.ws.send(WebSocket.pack(data));
  }

  /**
   * Adds data to the queue to be sent.
   * @param {Object} data Packet to send
   * @returns {void}
   */
  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.debug(`Tried to send packet ${data} but no WebSocket is available!`);
      return;
    }
    this.ratelimit.queue.push(data);
    this.processQueue();
  }

  /**
   * Creates a connection to a gateway.
   * @param {string} gateway The gateway to connect to
   * @param {number} [after=0] How long to wait before connecting
   * @param {boolean} [force=false] Whether or not to force a new connection even if one already exists
   * @returns {boolean}
   */
  connect(gateway = this.gateway, after = 0, force = false) {
    if (after) return this.client.setTimeout(() => this.connect(gateway, 0, force), after); // eslint-disable-line
    if (this.ws && !force) {
      this.debug('WebSocket connection already exists');
      return false;
    } else if (typeof gateway !== 'string') {
      this.debug(`Tried to connect to an invalid gateway: ${gateway}`);
      return false;
    }
    this.expectingClose = false;
    this.gateway = gateway;
    this.debug(`Connecting to ${gateway}`);
    const ws = this.ws = WebSocket.create(gateway, { v: Constants.DefaultOptions.ws.version });
    ws.onmessage = this.onMessage.bind(this);
    ws.onopen = this.onOpen.bind(this);
    ws.onerror = this.onError.bind(this);
    ws.onclose = this.onClose.bind(this);
    this.status = Constants.Status.CONNECTING;
    return true;
  }

  /**
   * Destroys the connection.
   * @returns {boolean}
   */
  destroy() {
    const ws = this.ws;
    if (!ws) {
      this.debug('Attempted to destroy WebSocket but no connection exists!');
      return false;
    }
    this.heartbeat(-1);
    this.expectingClose = true;
    ws.close(1000);
    this.packetManager.handleQueue();
    this.ws = null;
    this.status = Constants.Status.DISCONNECTED;
    this.ratelimit.remaining = this.ratelimit.total;
    return true;
  }

  /**
   * Called whenever a message is received.
   * @param {Event} event Event received
   * @returns {boolean}
   */
  onMessage(event) {
    let data;
    try {
      data = WebSocket.unpack(event.data);
    } catch (err) {
      this.emit('debug', err);
    }
    const ret = this.onPacket(data);
    this.client.emit('raw', data);
    return ret;
  }

  /**
   * Sets the current sequence of the connection.
   * @param {number} s New sequence
   */
  setSequence(s) {
    this.sequence = s > this.sequence ? s : this.sequence;
  }

  /**
   * Called whenever a packet is received.
   * @param {Object} packet Received packet
   * @returns {boolean}
   */
  onPacket(packet) {
    if (!packet) {
      this.debug('Received null packet');
      return false;
    }
    switch (packet.op) {
      case Constants.OPCodes.HELLO:
        return this.heartbeat(packet.d.heartbeat_interval);
      case Constants.OPCodes.RECONNECT:
        return this.reconnect();
      case Constants.OPCodes.INVALID_SESSION:
        if (!packet.d) this.sessionID = null;
        this.sequence = -1;
        this.debug('Session invalidated -- will identify with a new session');
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
   * Called whenever a connection is opened to the gateway.
   * @param {Event} event Received open event
   */
  onOpen(event) {
    if (event && event.target && event.target.url) this.gateway = event.target.url;
    this.debug(`Connected to gateway ${this.gateway}`);
    this.identify();
  }

  /**
   * Causes a reconnection to the gateway.
   */
  reconnect() {
    this.debug('Attemping to reconnect in 5500ms...');
    /**
     * Emitted whenever the client tries to reconnect to the WebSocket.
     * @event Client#reconnecting
     */
    this.client.emit(Constants.Events.RECONNECTING);
    this.connect(this.gateway, 5500, true);
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
    /**
     * Emitted whenever the client's WebSocket encounters a connection error.
     * @event Client#error
     * @param {Error} error The encountered error
     */
    this.client.emit(Constants.Events.ERROR, error);
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
    this.debug(`${this.expectingClose ? 'Client' : 'Server'} closed the WebSocket connection: ${event.code}`);
    this.closeSequence = this.sequence;
    // Reset the state before trying to fix anything
    this.emit('close', event);
    this.heartbeat(-1);
    // Should we reconnect?
    if (event.code === 1000 ? this.expectingClose : Constants.WSCodes[event.code]) {
      this.expectingClose = false;
      /**
       * Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
       * @event Client#disconnect
       * @param {CloseEvent} event The WebSocket close event
       */
      this.client.emit(Constants.Events.DISCONNECT, event);
      this.debug(Constants.WSCodes[event.code]);
      this.destroy();
      return;
    }
    this.expectingClose = false;
    this.reconnect();
  }

  // Heartbeat
  /**
   * Acknowledges a heartbeat.
   */
  ackHeartbeat() {
    this.debug(`Heartbeat acknowledged, latency of ${Date.now() - this.lastPingTimestamp}ms`);
    this.client._pong(this.lastPingTimestamp);
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
        this.client.clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      } else {
        this.debug(`Setting a heartbeat interval for ${time}ms`);
        this.heartbeatInterval = this.client.setInterval(() => this.heartbeat(), time);
      }
      return;
    }
    this.debug('Sending a heartbeat');
    this.lastPingTimestamp = Date.now();
    this.send({
      op: Constants.OPCodes.HEARTBEAT,
      d: this.sequence,
    });
  }

  // Identification
  /**
   * Identifies the client on a connection.
   * @param {number} [after] How long to wait before identifying
   * @returns {void}
   */
  identify(after) {
    if (after) return this.client.setTimeout(this.identify.bind(this), after);
    return this.sessionID ? this.identifyResume() : this.identifyNew();
  }

  /**
   * Identifies as a new connection on the gateway.
   * @returns {void}
   */
  identifyNew() {
    if (!this.client.token) {
      this.debug('No token available to identify a new session with');
      return;
    }
    // Clone the generic payload and assign the token
    const d = Object.assign({ token: this.client.token }, this.client.options.ws);

    // Sharding stuff
    const { shardId, shardCount } = this.client.options;
    if (shardCount > 0) d.shard = [Number(shardId), Number(shardCount)];

    // Send the payload
    this.debug('Identifying as a new session');
    this.send({ op: Constants.OPCodes.IDENTIFY, d });
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

module.exports = WebSocketConnection;
