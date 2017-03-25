const EventEmitter = require('events');
const WebSocketConnection = require('./WebSocketConnection');
const Constants = require('../../util/Constants');

class WebSocketShard extends EventEmitter {
  constructor(client, packetManager, options = {}) {
    super();

    this.client = client;
    this.packetManager = packetManager;

    this.id = options.shardID || this.client.options.shardID;

    this.sessionID = null;
    this.sequence = -1;
    this.resumeStart = -1;
    this._trace = [];

    this.ws = null;

    this.lastHeartbeatAck = true;
    this.heartbeatInterval = null;
    this.heartbeatTime = 0;
    this.lastPingTimestamp = 0;
    this.pings = [];

    this.first = true;
    this.connectionTimeout = null;

    this.syncInterval = null;

    this._reset();

    this.on('debug', e => {
      if (this.client.listenerCount('debug')) this.client.emit('debug', `SHARD ${this.id}: ${e}`);
    });
  }

  connect(gateway = this.client.ws.gateway) {
    if (this.first) {
      this._connect(gateway);
      this.first = false;
    } else {
      this.client.setTimeout(this._connect.bind(this, gateway), 2500);
    }
  }

  tryReconnect() {
    if (this.status === Constants.Status.RECONNECTING || this.status === Constants.Status.CONNECTING) return;
    this.status = Constants.Status.RECONNECTING;
    if (this.ws) this.ws.close();
    this.packetManager.handleQueue();
    this.emit(Constants.Events.RECONNECTING);
    this.connect();
  }

  destroy() {
    if (this.ws) this.ws.close(1000);
    this.status = Constants.Status.IDLE;
    this._reset();
  }

  /**
   * Sends a packet to the gateway
   * @param {Object} data An object that can be sent to the gateway
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
    if (this._remaining === 0) {
      this.client.setTimeout(this.doQueue.bind(this), Date.now() - this._remainingReset);
      return;
    }
    this._remaining--;
    this._send(item);
    this._queue.shift();
    this.doQueue();
  }

  /**
   * Sends a resume or identify packet, in cases of new connections or failed reconnections.
   * @param {boolean} [force=false] Force re-identify over resume
   */
  identify(force = false) {
    let d;
    let op;
    if (!this.sessionID || force) {
      op = Constants.OPCodes.IDENTIFY;
      d = this.client.options.ws;
      d.token = this.client.token;
      if (this.client.options.shardCount > 0) {
        d.shard = [Number(this.id), Number(this.client.options.shardCount)];
      }
      this.sessionID = null;
      this.sequence = -1;
      this.emit('debug', 'Identifying as new session');
    } else {
      op = Constants.OPCodes.RESUME;
      d = {
        token: this.client.token,
        session_id: this.sessionID,
        seq: this.sequence,
      };
      this.resumeStart = this.sequence;
      this.emit('debug', 'Identifying as resumed session');
    }

    this.send({ op, d });
  }

  /**
   * Requests a sync of guild data with Discord.
   * <info>This can be done automatically every 30 seconds by enabling {@link ClientOptions#sync}.</info>
   * <warn>This is only available when using a user account.</warn>
   * @param {Guild[]|Collection<Snowflake, Guild>} [guilds=client.guilds] An array or collection of guilds to sync
   */
  syncGuilds(guilds = this.client.guilds) {
    if (!this.client.user || this.client.user.bot) return;
    guilds = guilds.filter(g => g.shard.id === this.id).map(g => g.id);
    this.emit('debug', `Syncing ${guilds.length} guilds`);
    this.send({
      op: 12,
      d: guilds,
    });
  }

  heartbeat(normal) {
    if (normal && !this.lastHeartbeatAck) {
      this.emit('debug', 'Failed to recieve heartbeat ACK! Attempting to reconnect');
      this.ws.close(this.client.browser ? 1000 : 1007);
      return;
    }

    this.emit('debug', `Sending ${normal ? 'normal ' : ''}heartbeat @ ${this.sequence} seq`);
    this.lastPingTimestamp = Date.now();
    this.send({
      op: Constants.OPCodes.HEARTBEAT,
      d: this.sequence,
    }, true);

    this.lastHeartbeatAck = false;
  }

  pong() {
    this.pings.unshift(Date.now() - this.lastPingTimestamp);
    if (this.pings.length > 3) this.pings.length = 3;
    this.lastHeartbeatAck = true;
  }

  get ping() {
    return (this.pings.reduce((prev, p) => prev + p, 0) / this.pings.length) || 0;
  }

  checkIfReady() {
    let unavailableCount = 0;
    for (const guild of this.client.guilds.values()) {
      if (guild.shard.id === this.id) if (!guild.available) unavailableCount++;
    }
    if (unavailableCount === 0) {
      this.status = Constants.Status.NEARLY;
      if (this.client.options.fetchAllMembers) {
        const promises = [];
        for (const guild of this.client.guilds.values()) {
          if (guild.shard.id === this.id) promises.push(guild.fetchMembers());
        }
        Promise.all(promises).then(this._emitReady.bind(this), e => {
          this.client.emit(Constants.Events.WARN, 'Error in pre-ready guild member fetching');
          this.emit(Constants.Events.ERROR, e);
          this._emitReady();
        });
        return;
      }
      this._emitReady();
    }
  }

  /**
   * Run whenever the gateway connections opens up
   */
  eventOpen() {
    this.emit('debug', 'Connection to gateway opened');
    this.emit('open');
    this.lastHeartbeatAck = true;
    this.identify();
  }

  /**
   * Run whenever the connection to the gateway is closed, it will try to reconnect the client.
   * @param {CloseEvent} event The WebSocket close event
   * @param {number} shardID The shard ID
   */
  eventClose(event) {
    this.emit('close', event, this.id);
    this.client.clearInterval(this.heartbeatInterval);
    this.client.clearInterval(this.syncInterval);
    this.status = Constants.Status.DISCONNECTED;
    this._reset();
    /**
     * Emitted whenever the client websocket is disconnected
     * @event Client#disconnect
     * @param {CloseEvent} event The WebSocket close event
     */
    if (this.status !== Constants.Status.RECONNECTING) this.emit(Constants.Events.DISCONNECT, event);
    if (Object.keys(Constants.ClosableCodes).includes(event.code.toString())) return;
    if (this.status !== Constants.Status.RECONNECTING && event.code !== 1000) this.tryReconnect();
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

    this.client.emit('raw', packet, this.id);

    if (packet.op === Constants.OPCodes.HELLO) {
      this.emit('debug', `HELLO ${packet.d._trace.join(' -> ')} ${packet.d.heartbeat_interval}`);
      this.heartbeatTime = packet.d.heartbeat_interval;
      this._trace = packet.d._trace;
      this.heartbeatInterval = this.client.setInterval(() => this.heartbeat(true), packet.d.heartbeat_interval);
    }

    if (packet.s && packet.s > this.sequence) this.sequence = packet.s;

    packet.shard = this;
    if (packet.d) packet.d.shard = this;


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

  _reset() {
    this.client.clearTimeout(this.connectionTimeout);
    this._queue = [];
    this._remaining = 120;
    this.client.setInterval(() => {
      this._remaining = 120;
      this._remainingReset = Date.now();
    }, 60e3);
  }

  _connect(gateway) {
    this.emit('debug', `Connecting to gateway ${gateway}`);
    this.ws = new WebSocketConnection(gateway);
    this.ws.e.on('open', this.eventOpen.bind(this));
    this.ws.e.on('close', this.eventClose.bind(this));
    this.ws.e.on('error', this.eventError.bind(this));
    this.ws.e.on('packet', this.eventPacket.bind(this));
    this._reset();
  }

  _send(data) {
    if (this.ws.readyState !== WebSocketConnection.OPEN) return;
    if (this.listenerCount('send') > 0) this.emit('send', data);
    this.ws.send(data);
  }

  _emitReady() {
    this.status = Constants.Status.READY;
    this.packetManager.handleQueue();

    /**
     * Emitted when the Client becomes ready to start working
     * @event Client#shardReady
     * @param {Number} shardID
     */
    this.client.emit(Constants.Events.SHARD_READY, this.id);
    this.syncGuilds();
    this.readyAt = Date.now();
  }
}

module.exports = WebSocketShard;
