const browser = typeof window !== 'undefined';
const EventEmitter = require('events').EventEmitter;
const Constants = require('../../util/Constants');
const convertArrayBuffer = require('../../util/ConvertArrayBuffer');
const pako = require('pako');
const zlib = require('zlib');
const PacketManager = require('./packets/WebSocketPacketManager');

let WebSocket, erlpack;
let serialize = JSON.stringify;
if (browser) {
  WebSocket = window.WebSocket; // eslint-disable-line no-undef
} else {
  try {
    WebSocket = require('uws');
  } catch (err) {
    WebSocket = require('ws');
  }

  try {
    erlpack = require('erlpack');
    serialize = erlpack.pack;
  } catch (err) {
    erlpack = null;
  }
}

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
    for (const event of client.options.disabledEvents) this.disabledEvents[event] = true;

    this.first = true;

    this.lastHeartbeatAck = true;
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
    if (browser) this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.eventOpen.bind(this);
    this.ws.onmessage = this.eventMessage.bind(this);
    this.ws.onclose = this.eventClose.bind(this);
    this.ws.onerror = this.eventError.bind(this);
    this._queue = [];
    this._remaining = 120;
    this.client.setInterval(() => {
      this._remaining = 120;
      this._remainingReset = Date.now();
    }, 60e3);
  }

  connect(gateway) {
    gateway = `${gateway}&encoding=${erlpack ? 'etf' : 'json'}`;
    if (this.first) {
      this._connect(gateway);
      this.first = false;
    } else {
      this.client.setTimeout(() => this._connect(gateway), 5500);
    }
  }

  heartbeat(normal) {
    if (normal && !this.lastHeartbeatAck) {
      this.ws.close(1007);
      return;
    }

    this.client.emit('debug', 'Sending heartbeat');
    this.client._pingTimestamp = Date.now();
    this.client.ws.send({
      op: Constants.OPCodes.HEARTBEAT,
      d: this.sequence,
    }, true);

    this.lastHeartbeatAck = false;
  }

  /**
   * Sends a packet to the gateway
   * @param {Object} data An object that can be JSON stringified
   * @param {boolean} force Whether or not to send the packet immediately
   */
  send(data, force = false) {
    if (force) {
      this._send(serialize(data));
      return;
    }
    this._queue.push(serialize(data));
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
    if (!(this.ws.readyState === WebSocket.OPEN && item)) return;
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
   * Run whenever the gateway connections opens up
   */
  eventOpen() {
    this.client.emit('debug', 'Connection to gateway opened');
    this.lastHeartbeatAck = true;
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
   * @external CloseEvent
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent}
   */

  /**
   * Run whenever the connection to the gateway is closed, it will try to reconnect the client.
   * @param {CloseEvent} event The WebSocket close event
   */
  eventClose(event) {
    this.emit('close', event);
    this.client.clearInterval(this.client.manager.heartbeatInterval);
    this.status = Constants.Status.DISCONNECTED;
    this._queue = [];
    /**
     * Emitted whenever the client websocket is disconnected
     * @event Client#disconnect
     * @param {CloseEvent} event The WebSocket close event
     */
    if (!this.reconnecting) this.client.emit(Constants.Events.DISCONNECT, event);
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
    const data = this.tryParseEventData(event.data);
    if (data === null) {
      this.eventError(new Error(Constants.Errors.BAD_WS_MESSAGE));
      return false;
    }

    this.client.emit('raw', data);

    if (data.op === Constants.OPCodes.HELLO) this.client.manager.setupKeepAlive(data.d.heartbeat_interval);
    return this.packetManager.handle(data);
  }

  /**
   * Parses the raw data from a websocket event, inflating it if necessary
   * @param {*} data Event data
   * @returns {Object}
   */
  parseEventData(data) {
    if (erlpack) {
      if (data instanceof ArrayBuffer) data = convertArrayBuffer(data);
      return erlpack.unpack(data);
    } else {
      if (data instanceof ArrayBuffer) data = pako.inflate(data, { to: 'string' });
      else if (data instanceof Buffer) data = zlib.inflateSync(data).toString();
      return JSON.parse(data);
    }
  }

  /**
   * Tries to call `parseEventData()` and return its result, or returns `null` upon thrown errors.
   * @param {*} data Event data
   * @returns {?Object}
   */
  tryParseEventData(data) {
    try {
      return this.parseEventData(data);
    } catch (err) {
      return null;
    }
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
          Promise.all(promises).then(() => this._emitReady(), e => {
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
    if (this.status === Constants.Status.RECONNECTING || this.status === Constants.Status.CONNECTING) return;
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
