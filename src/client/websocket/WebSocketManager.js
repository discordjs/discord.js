const EventEmitter = require('events').EventEmitter;
const Constants = require('../../util/Constants');
const PacketManager = require('./packets/WebSocketPacketManager');
const WebSocketConnection = require('./WebSocketConnection');

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
     * The WebSocket connection of this manager
     * @type {?WebSocketConnection}
     */
    this.connection = null;
  }

  heartbeat() {
    if (!this.connection) return this.debug('No connection to heartbeat');
    return this.connection.heartbeat();
  }

  debug(message) {
    return this.client.emit('debug', `[ws] ${message}`);
  }

  destroy() {
    if (!this.connection) return this.debug('Attempted to destroy WebSocket but no connection exists!');
    return this.connection.destroy();
  }

  connect(gateway) {
    if (!this.connection) {
      this.connection = new WebSocketConnection(this, gateway);
      return true;
    }
    switch (this.connection.status) {
      case Constants.Status.IDLE:
        this.connection.connect(gateway, 5500);
        return true;
      case Constants.Status.DISCONNECTED:
        this.connection.connect(gateway, 5500);
        return true;
      default:
        this.debug(`Couldn't connect to ${gateway} as the websocket is at state ${this.connection.status}`);
        return false;
    }
  }
}

module.exports = WebSocketManager;
