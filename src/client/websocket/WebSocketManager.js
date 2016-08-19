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
   * @returns {null}
   */
  connect(gateway) {
    /**
     * The status of the Client's connection, a type of Constants.Status
     * @type {Number}
     */
    this.status = Constants.Status.CONNECTING;
    /**
     * The WebSocket connection to the gateway
     * @type {?WebSocket}
     */
    this.ws = new WebSocket(gateway);
    this.ws.onopen = () => this.eventOpen();
    this.ws.onclose = () => this.eventClose();
    this.ws.onmessage = (e) => this.eventMessage(e);
    this.ws.onerror = (e) => this.eventError(e);
  }

  /**
   * Sends a packet to the gateway
   * @param {Object} packet An object that can be JSON stringified
   * @returns {null}
   */
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Run whenever the gateway connections opens up
   * @returns {null}
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
   * @returns {null}
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
   * @returns {null}
   */
  _sendNewIdentify() {
    this.reconnecting = false;
    const payload = this.client.options.ws;
    payload.token = this.client.token;

    this.send({
      op: Constants.OPCodes.IDENTIFY,
      d: payload,
    });
  }

  /**
   * Run whenever the connection to the gateway is closed, it will try to reconnect the client.
   * @returns {null}
   */
  eventClose() {
    if (!this.reconnecting) {
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

    if (packet.op === 10) {
      this.client.manager.setupKeepAlive(packet.d.heartbeat_interval);
    }

    return this.packetManager.handle(packet);
  }

  /**
   * Run whenever an error occurs with the WebSocket connection. Tries to reconnect
   * @returns {null}
   */
  eventError(e) {
    console.log(e);
    this.tryReconnect();
  }

  /**
   * Runs on new packets before `READY` to see if the Client is ready yet, if it is prepares
   * the `READY` event.
   * @returns {null}
   */
  checkIfReady() {
    if (this.status !== Constants.Status.READY) {
      let unavailableCount = 0;
      for (const guildID of this.client.guilds.keys()) {
        unavailableCount += this.client.guilds.get(guildID).available ? 0 : 1;
      }

      if (unavailableCount === 0) {
        this.status = Constants.Status.READY;
        /**
        * Emitted when the Client becomes ready to start working
        *
        * @event Client#ready
        */
        this.client.emit(Constants.Events.READY);
        this.packetManager.handleQueue();
      }
    }
  }

  /**
   * Tries to reconnect the client, changing the status to Constants.Status.RECONNECTING.
   * @returns {null}
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
