const EventEmitter = require('events').EventEmitter;
const Constants = require('../../util/Constants');
const Collection = require('../../util/Collection');
const WebSocketConnection = require('./WebSocketConnection');
const PacketManager = require('./packets/WebSocketPacketManager');

/**
 * WebSocket Manager of the client
 * @private
 */
class WebSocketManager extends EventEmitter {
  constructor(client) {
    super();
    /**
     * The client that instantiated this WebSocketManager
     * @type {Client}
     */
    this.client = client;

    /**
     * The WebSocket connection of this manager
     * @type {?WebSocketConnection}
     */
    this.shards = new Collection();

    /**
     * The Packet Manager of the connection
     * @type {WebSocketPacketManager}
     */
    this.packetManager = new PacketManager(this);

    /**
     * Events that are disabled (will not be processed)
     * @type {Object}
     */
    this.disabledEvents = {};
    for (const event of this.client.options.disabledEvents) this.disabledEvents[event] = true;
  }

  /**
   * Emits a debug event.
   * @param {string} message Debug message
   * @returns {void}
   */
  debug(message) {
    return this.client.emit('debug', `[ws] ${message}`);
  }

  /**
   * Destroy the client.
   * @returns {boolean} Whether or not destruction was successful
   */
  destroy() {
    if (!this.shards.size) {
      this.debug('Attempted to destroy WebSocket but no connections exist!');
      return false;
    }
    // TODO: iterate and destroy
    return true;
  }

  /**
   * Connects the client to a gateway.
   * @param {string} gateway Gateway to connect to
   */
  connect(gateway) {
    for (let i = 0; i < this.client.options.shardCount; i++) {
      this.shards.set(i, new WebSocketConnection(this, i, gateway));
    }
  }
}

module.exports = WebSocketManager;
