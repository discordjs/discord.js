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
  }
}

module.exports = WebSocketManager;
