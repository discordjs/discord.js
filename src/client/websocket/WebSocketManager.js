const WebSocket = require('ws');
const Constants = require('../../util/Constants');
const zlib = require('zlib');
const PacketManager = require('./packets/WebSocketPacketManager');

/**
 * The WebSocket Manager of the Client
 * @private
 */
class WebSocketManager {

  constructor(client) {
    /**
     * The Client that instantiated this WebSocketManager
     * @type {Client}
     */
    this.client = client;
    this.ws = null;
    /**
     * A WebSocket Packet manager, it handles all the messages
     * @type {PacketManager}
     */
    this.packetManager = new PacketManager(this);
    /**
     * The status of the WebSocketManager, a type of Constants.Status. It defaults to IDLE.
     * @type {Number}
     */
    this.status = Constants.Status.IDLE;

    /**
     * The session ID of the connection, null if not yet available.
     * @type {?String}
     */
    this.sessionID = null;

    /**
     * The packet count of the client, null if not yet available.
     * @type {?Number}
     */
    this.sequence = -1;

    /**
     * The gateway address for this WebSocket connection, null if not yet available.
     * @type {?String}
     */
    this.gateway = null;
  }

  /**
   * Connects the client to a given gateway
   * @param {String} gateway the gateway to connect to
   * @returns {void}
   */
  connect(gateway) {
    this.status = Constants.Status.CONNECTING;
    /**
     * The WebSocket connection to the gateway
     * @type {?WebSocket}
     */
    this.ws = new WebSocket(gateway);
    this.ws.onopen = () => this.eventOpen();
    this.ws.onclose = (d) => this.eventClose(d);
    this.ws.onmessage = (e) => this.eventMessage(e);
    this.ws.onerror = (e) => this.eventError(e);
    this._queue = [];
    this._remaining = 3;
  }

  /**
   * Sends a packet to the gateway
   * @param {Object} packet An object that can be JSON stringified
   * @returns {void}
   */
  send(data) {
    this._queue.push(JSON.stringify(data));
    this.doQueue();
  }

  destroy() {
    this.ws.close(1000);
    this._queue = [];
    this.status = Constants.Status.IDLE;
  }

  doQueue() {
    const item = this._queue[0];
    if (this.ws.readyState === WebSocket.OPEN && item) {
      if (this._remaining === 0) {
        return this.client.setTimeout(() => {
          this.doQueue();
        }, 1000);
      }
      this._remaining--;
      this.ws.send(item);
      this._queue.shift();
      this.doQueue();
      this.client.setTimeout(() => this._remaining++, 1000);
    }
  }

  /**
   * Run whenever the gateway connections opens up
   * @returns {void}
   */
  eventOpen() {
    if (this.reconnecting) {
      this._sendResume();
    } else {
      this._sendNewIdentify();
    }
  }

  /**
   * Sends a gatway resume packet, in cases of unexpected disconnections.
   * @returns {void}
   */
  _sendResume() {
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
   * @returns {void}
   */
  _sendNewIdentify() {
    this.reconnecting = false;
    const payload = this.client.options.ws;
    payload.token = this.client.token;
    if (this.client.options.shard_count > 0) {
      payload.shard = [this.client.options.shard_id, this.client.options.shard_count];
    }

    this.send({
      op: Constants.OPCodes.IDENTIFY,
      d: payload,
    });
  }

  /**
   * Run whenever the connection to the gateway is closed, it will try to reconnect the client.
   * @returns {void}
   */
  eventClose(event) {
    if (event.code === 4004) {
      throw Constants.Errors.BAD_LOGIN;
    }
    if (!this.reconnecting && event.code !== 1000) {
      this.tryReconnect();
    }
  }

  /**
   * Run whenever a message is received from the WebSocket. Returns `true` if the message
   * was handled properly.
   * @param {Object} data the received websocket data
   * @returns {Boolean}
   */
  eventMessage($event) {
    let packet;
    const event = $event;
    try {
      if (event.binary) {
        event.data = zlib.inflateSync(event.data).toString();
      }

      packet = JSON.parse(event.data);
    } catch (e) {
      return this.eventError(Constants.Errors.BAD_WS_MESSAGE);
    }

    this.client.emit('raw', packet);

    if (packet.op === 10) {
      this.client.manager.setupKeepAlive(packet.d.heartbeat_interval);
    }

    return this.packetManager.handle(packet);
  }

  /**
   * Run whenever an error occurs with the WebSocket connection. Tries to reconnect
   * @returns {void}
   */
  eventError(e) {
    /**
     * Emitted whenever the Client encounters a serious connection error
     * @event Client#error
     * @param {Error} error the encountered error
     */
    this.client.emit('error', e);
    this.tryReconnect();
  }

  _emitReady() {
    /**
     * Emitted when the Client becomes ready to start working
     *
     * @event Client#ready
     */
    this.status = Constants.Status.READY;
    this.client.emit(Constants.Events.READY);
    this.packetManager.handleQueue();
  }

  /**
   * Runs on new packets before `READY` to see if the Client is ready yet, if it is prepares
   * the `READY` event.
   * @returns {void}
   */
  checkIfReady() {
    if (this.status !== Constants.Status.READY && this.status !== Constants.Status.NEARLY) {
      let unavailableCount = 0;
      for (const guildID of this.client.guilds.keys()) {
        unavailableCount += this.client.guilds.get(guildID).available ? 0 : 1;
      }
      if (unavailableCount === 0) {
        this.status = Constants.Status.NEARLY;
        if (this.client.options.fetch_all_members) {
          const promises = this.client.guilds.array().map(g => g.fetchMembers());
          return Promise.all(promises).then(() => this._emitReady()).catch(e => {
            this.client.emit('warn', `error on pre-ready guild member fetching - ${e}`);
            this._emitReady();
          });
        }
        this._emitReady();
      }
    }
  }

  /**
   * Tries to reconnect the client, changing the status to Constants.Status.RECONNECTING.
   * @returns {void}
   */
  tryReconnect() {
    this.status = Constants.Status.RECONNECTING;
    this.ws.close();
    this.packetManager.handleQueue();
    /**
    * Emitted when the Client tries to reconnect after being disconnected
    *
    * @event Client#reconnecting
    */
    this.client.emit(Constants.Events.RECONNECTING);
    this.connect(this.client.ws.gateway);
  }
}

module.exports = WebSocketManager;
