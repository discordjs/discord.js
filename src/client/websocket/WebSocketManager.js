const EventEmitter = require('events');
const WebSocketConnection = require('./WebSocketConnection');
const Constants = require('../../util/Constants');

class WebSocketManager extends EventEmitter {
  constructor(client, packetManager, options = {}) {
    super();
    /**
     * The Client that instantiated this WebSocketManager
     * @type {Client}
     */
    this.client = client;

    this.packetManager = packetManager;

    /**
     * The status of the WebSocketManager, a type of Constants.Status. It defaults to IDLE.
     * @type {number}
     */
    this.status = Constants.Status.IDLE;

    /**
     * The session ID of the connection, null if not yet available.
     * @type {?string}
     */
    this.sessionID = null;

    /**
     * The packet count of the client, null if not yet available.
     * @type {?number}
     */
    this.sequence = -1;

    /**
     * The gateway address for this WebSocket connection, null if not yet available.
     * @type {?string}
     */
    this.gateway = null;

    /**
     * Whether READY was emitted normally (all packets received) or not
     * @type {boolean}
     */
    this.normalReady = false;

    /**
     * The WebSocket connection to the gateway
     * @type {?WebSocket}
     */
    this.ws = null;

    this.first = true;

    this.lastHeartbeatAck = true;
    this.heartbeatInterval = null;
    this.heartbeatTime = 0;
    this.lastPingTimestamp = 0;
    this.pings = [];

    this.shardID = options.shardID || this.client.options.shardID;
    this.shardCount = options.shardCount || this.client.options.shardCount;

    /**
     * The date at which this Websocket Manager was regarded as being in the `READY` state.
     * @type {?Date}
     */
    this.readyAt = null;

    this.on('debug', e => this.client.emit('debug', `SHARD ${this.shardID}: ${e}`));
  }

  _connect(gateway) {
    this.emit('debug', `Connecting to gateway ${gateway}`);
    this.normalReady = false;
    if (this.status !== Constants.Status.RECONNECTING) this.status = Constants.Status.CONNECTING;
    this.ws = new WebSocketConnection(gateway);
    this.ws.on('open', this.eventOpen.bind(this));
    this.ws.on('close', this.eventClose.bind(this));
    this.ws.on('error', this.eventError.bind(this));
    this.ws.on('packet', this.eventPacket.bind(this));
    this._queue = [];
    this._remaining = 120;
    this.client.setInterval(() => {
      this._remaining = 120;
      this._remainingReset = Date.now();
    }, 60e3);
  }

  /**
   * Connects the client to a given gateway
   * @param {string} gateway The gateway to connect to
   */
  connect(gateway) {
    if (this.first) {
      this._connect(gateway);
      this.first = false;
    } else {
      this.client.setTimeout(() => this._connect(gateway), 5500);
    }
  }

  destroy() {
    if (this.ws) this.ws.close(1000);
    this._queue = [];
    this.status = Constants.Status.IDLE;
  }

  /**
   * Run whenever the gateway connections opens up
   */
  eventOpen() {
    this.emit('debug', 'Connection to gateway opened');
    this.emit('open', this.shardID);
    this.lastHeartbeatAck = true;
    if (this.status === Constants.Status.RECONNECTING || this.sessionID) this.sendResume();
    else this.sendNewIdentify();
  }

  /**
   * Run whenever the connection to the gateway is closed, it will try to reconnect the client.
   * @param {CloseEvent} event The WebSocket close event
   * @param {number} shardID The shard ID
   */
  eventClose(event) {
    this.emit('close', event, this.shardID);
    this.client.clearInterval(this.heartbeatInterval);
    this.status = Constants.Status.DISCONNECTED;
    this._queue = [];
    /**
     * Emitted whenever the client websocket is disconnected
     * @event Client#disconnect
     * @param {CloseEvent} event The WebSocket close event
     */
    if (!this.reconnecting) this.emit(Constants.Events.DISCONNECT, event);
    if (Object.keys(Constants.ClosableCodes).includes(event.code.toString())) return;
    if (!this.reconnecting && event.code !== 1000) this.tryReconnect();
  }

  /**
   * Run whenever a packet is received from the WebSocketConnection. Returns `true` if the message
   * was handled properly.
   * @param {Object} packet The parsed event packet
   * @returns {boolean}
   */
  eventPacket(packet) {
    if (packet === null) {
      this.eventError(new Error(Constants.Errors.BAD_WS_MESSAGE));
      return false;
    }

    if (packet.op === Constants.OPCodes.HELLO) {
      this.heartbeatTime = packet.d.heartbeat_interval;
      this.heartbeatInterval = this.client.setInterval(() => this.heartbeat(true), packet.d.heartbeat_interval);
    }

    if (packet.s && packet.s > this.sequence) this.sequence = packet.s;

    packet.shardID = this.shardID;
    return this.packetManager.handle(packet);
  }

  /**
   * Run whenever an error occurs with the WebSocket connection. Tries to reconnect
   * @param {Error} err The encountered error
   */
  eventError(err) {
    /**
     * Emitted whenever the Client encounters a serious connection error
     * @event Client#error
     * @param {Error} error The encountered error
     */
    if (this.client.listenerCount('error') > 0) this.emit('error', err);
    this.tryReconnect();
  }

  /**
   * Sends a packet to the gateway
   * @param {Object} data An object that can be JSON stringified
   * @param {boolean} force Whether or not to send the packet immediately
   */
  send(data, force = false) {
    if (force) {
      this._send(data);
      return;
    }
    this._queue.push(data);
    this.doQueue();
  }

  doQueue() {
    const item = this._queue[0];
    if (!(this.ws.readyState === WebSocketConnection.OPEN && item)) return;
    if (this.remaining === 0) {
      this.client.setTimeout(this.doQueue.bind(this), Date.now() - this.remainingReset);
      return;
    }
    this._remaining--;
    this._send(item);
    this._queue.shift();
    this.doQueue();
  }

  /**
   * Sends a gateway resume packet, in cases of unexpected disconnections.
   */
  sendResume() {
    if (!this.sessionID) {
      this.sendNewIdentify();
      return;
    }
    this.emit('debug', 'Identifying as resumed session');
    this.resumeStart = this.sequence;
    const payload = {
      token: this.client.token,
      session_id: this.sessionID,
      seq: this.sequence,
    };

    this.send({
      op: Constants.OPCodes.RESUME,
      d: payload,
    });
  }

  /**
   * Sends a new identification packet, in cases of new connections or failed reconnections.
   */
  sendNewIdentify() {
    this.reconnecting = false;
    const payload = this.client.options.ws;
    payload.token = this.client.token;
    if (this.client.options.shardCount > 0) {
      payload.shard = [Number(this.shardID), Number(this.client.options.shardCount)];
    }
    this.emit('debug', 'Identifying as new session');
    this.send({
      op: Constants.OPCodes.IDENTIFY,
      d: payload,
    });
    this.sequence = -1;
  }

  heartbeat(normal) {
    if (normal && !this.lastHeartbeatAck) {
      this.ws.close(this.client.browser ? 1000 : 1007);
      return;
    }

    this.emit('debug', `Sending ${normal ? 'normal ' : ''}heartbeat`);
    this.lastPingTimestamp = Date.now();
    this.send({
      op: Constants.OPCodes.HEARTBEAT,
      d: this.sequence,
    }, true);

    this.lastHeartbeatAck = false;
  }

  pong(startTime) {
    this.pings.unshift(Date.now() - startTime);
    if (this.pings.length > 3) this.pings.length = 3;
    this.lastHeartbeatAck = true;
  }

  get ping() {
    return (this.pings.reduce((prev, p) => prev + p, 0) / this.pings.length) || 0;
  }

  tryReconnect() {
    if (this.status === Constants.Status.RECONNECTING || this.status === Constants.Status.CONNECTING) return;
    this.status = Constants.Status.RECONNECTING;
    if (this.ws) this.ws.close();
    this.packetManager.handleQueue();
    this.emit(Constants.Events.RECONNECTING);
    this.connect(this.client.ws.gateway);
  }

  /**
   * Runs on new packets before `READY` to see if the Manager is ready yet, if it is prepares
   * the `SHARD_READY` event.
   */
  checkIfReady() {
    if (!(this.status !== Constants.Status.READY && this.status !== Constants.Status.NEARLY)) return;
    let unavailableCount = 0;
    for (const guild of this.client.guilds.values()) {
      if (guild.shardID === this.shardID) if (!guild.available) unavailableCount++;
    }
    if (unavailableCount === 0) {
      this.status = Constants.Status.NEARLY;
      if (this.client.options.fetchAllMembers) {
        const promises = [];
        for (const guild of this.client.guilds.values()) {
          if (guild.shardID === this.shardID) promises.push(guild.fetchMembers());
        }
        Promise.all(promises).then(() => this._emitReady(), e => {
          this.client.emit(Constants.Events.WARN, 'Error in pre-ready guild member fetching');
          this.emit(Constants.Events.ERROR, e);
          this._emitReady();
        });
        return;
      }
      this._emitReady();
    }
  }

  _send(data) {
    if (this.ws.readyState === WebSocketConnection.OPEN) {
      if (this.listenerCount('send') > 0) this.emit('send', data);
      this.ws.send(data);
    }
  }

  _emitReady(normal = true) {
    this.status = Constants.Status.READY;
    this.packetManager.handleQueue();
    this.normalReady = normal;

    /**
     * Emitted when the Client becomes ready to start working
     * @event Client#shardReady
     * @param {Number} shardID
     */
    this.client.emit(Constants.Events.SHARD_READY, this.shardID);
    this.readyAt = Date.now();
  }
}

module.exports = WebSocketManager;
