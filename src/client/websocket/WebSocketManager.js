const WebSocket = require('ws');
const EventEmitter = require('events').EventEmitter;
const Constants = require('../../util/Constants');
const zlib = require('zlib');
const PacketManager = require('./packets/WebSocketPacketManager');

/**
 * The WebSocket Manager of the Client
 * @private
 */
class WebSocketManager extends EventEmitter {
  constructor(client) {
    super();
    /**
     * The Client that instantiated this WebSocketManager
     * @type {Client}
     */
    this.client = client;

    /**
     * A WebSocket Packet manager, it handles all the messages
     * @type {PacketManager}
     */
    this.packetManager = new PacketManager(this);

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

    /**
     * An object with keys that are websocket event names that should be ignored
     * @type {Object}
     */
    this.disabledEvents = {};
    for (const event in client.options.disabledEvents) this.disabledEvents[event] = true;

    this.first = true;
  }

  /**
   * Connects the client to a given gateway
   * @param {string} gateway The gateway to connect to
   */
  _connect(gateway) {
    this.client.emit('debug', `Connecting to gateway ${gateway}`);
    this.normalReady = false;
    if (this.status !== Constants.Status.RECONNECTING) this.status = Constants.Status.CONNECTING;
    this.ws = new WebSocket(gateway);
    this.ws.onopen = () => this.eventOpen();
    this.ws.onclose = (d) => this.eventClose(d);
    this.ws.onmessage = (e) => this.eventMessage(e);
    this.ws.onerror = (e) => this.eventError(e);
    this._queue = [];
    this._remaining = 3;
  }

  connect(gateway) {
    if (this.first) {
      this._connect(gateway);
      this.first = false;
    } else {
      this.client.setTimeout(() => this._connect(gateway), 5500);
    }
  }

  /**
   * Sends a packet to the gateway
   * @param {Object} data An object that can be JSON stringified
   * @param {boolean} force Whether or not to send the packet immediately
   */
  send(data, force = false) {
    if (force) {
      this._send(JSON.stringify(data));
      return;
    }
    this._queue.push(JSON.stringify(data));
    this.doQueue();
  }

  destroy() {
    this.ws.close(1000);
    this._queue = [];
    this.status = Constants.Status.IDLE;
  }

  _send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.emit('send', data);
      this.ws.send(data);
    }
  }

  doQueue() {
    const item = this._queue[0];
    if (this.ws.readyState === WebSocket.OPEN && item) {
      if (this._remaining === 0) {
        this.client.setTimeout(() => {
          this.doQueue();
        }, 1000);
        return;
      }
      this._remaining--;
      this._send(item);
      this._queue.shift();
      this.doQueue();
      this.client.setTimeout(() => this._remaining++, 1000);
    }
  }

  /**
   * Run whenever the gateway connections opens up
   */
  eventOpen() {
    this.client.emit('debug', 'Connection to gateway opened');
    if (this.status === Constants.Status.RECONNECTING) this._sendResume();
    else this._sendNewIdentify();
  }

  /**
   * Sends a gateway resume packet, in cases of unexpected disconnections.
   */
  _sendResume() {
    if (!this.sessionID) {
      this._sendNewIdentify();
      return;
    }
    this.client.emit('debug', 'Identifying as resumed session');
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
  _sendNewIdentify() {
    this.reconnecting = false;
    const payload = this.client.options.ws;
    payload.token = this.client.token;
    if (this.client.options.shardCount > 0) {
      payload.shard = [Number(this.client.options.shardId), Number(this.client.options.shardCount)];
    }
    this.client.emit('debug', 'Identifying as new session');
    this.send({
      op: Constants.OPCodes.IDENTIFY,
      d: payload,
    });
    this.sequence = -1;
  }

  /**
   * Run whenever the connection to the gateway is closed, it will try to reconnect the client.
   * @param {Object} event The received websocket data
   */
  eventClose(event) {
    this.emit('close', event);
    /**
     * Emitted whenever the client websocket is disconnected
     * @event Client#disconnect
     */
    clearInterval(this.client.manager.heartbeatInterval);
    if (!this.reconnecting) this.client.emit(Constants.Events.DISCONNECT);
    if (event.code === 4004) return;
    if (event.code === 4010) return;
    if (!this.reconnecting && event.code !== 1000) this.tryReconnect();
  }

  /**
   * Run whenever a message is received from the WebSocket. Returns `true` if the message
   * was handled properly.
   * @param {Object} event The received websocket data
   * @returns {boolean}
   */
  eventMessage(event) {
    let packet;
    try {
      if (event.binary) event.data = zlib.inflateSync(event.data).toString();
      packet = JSON.parse(event.data);
    } catch (e) {
      return this.eventError(new Error(Constants.Errors.BAD_WS_MESSAGE));
    }

    this.client.emit('raw', packet);

    if (packet.op === Constants.OPCodes.HELLO) this.client.manager.setupKeepAlive(packet.d.heartbeat_interval);
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
    if (this.client.listenerCount('error') > 0) this.client.emit('error', err);
    this.tryReconnect();
  }

  _emitReady(normal = true) {
    /**
     * Emitted when the Client becomes ready to start working
     * @event Client#ready
     */
    this.status = Constants.Status.READY;
    this.client.emit(Constants.Events.READY);
    this.packetManager.handleQueue();
    this.normalReady = normal;
  }

  /**
   * Runs on new packets before `READY` to see if the Client is ready yet, if it is prepares
   * the `READY` event.
   */
  checkIfReady() {
    if (this.status !== Constants.Status.READY && this.status !== Constants.Status.NEARLY) {
      let unavailableCount = 0;
      for (const guildID of this.client.guilds.keys()) {
        unavailableCount += this.client.guilds.get(guildID).available ? 0 : 1;
      }
      if (unavailableCount === 0) {
        this.status = Constants.Status.NEARLY;
        if (this.client.options.fetchAllMembers) {
          const promises = this.client.guilds.map(g => g.fetchMembers());
          Promise.all(promises).then(() => this._emitReady()).catch(e => {
            this.client.emit(Constants.Events.WARN, 'Error in pre-ready guild member fetching');
            this.client.emit(Constants.Events.ERROR, e);
            this._emitReady();
          });
          return;
        }
        this._emitReady();
      }
    }
  }

  /**
   * Tries to reconnect the client, changing the status to Constants.Status.RECONNECTING.
   */
  tryReconnect() {
    this.status = Constants.Status.RECONNECTING;
    this.ws.close();
    this.packetManager.handleQueue();
    /**
     * Emitted when the Client tries to reconnect after being disconnected
     * @event Client#reconnecting
     */
    this.client.emit(Constants.Events.RECONNECTING);
    this.connect(this.client.ws.gateway);
  }
}

module.exports = WebSocketManager;
