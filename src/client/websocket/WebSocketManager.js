const EventEmitter = require('events').EventEmitter;
const Collection = require('../../util/Collection');
const WebSocketConnection = require('./WebSocketConnection');
const PacketManager = require('./packets/WebSocketPacketManager');
const Constants = require('../../util/Constants');

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
     * A cached gateway url
     * @type {string}
     */
    this.cachedGateway = null;

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
  debug(...args) {
    return this.client.emit('debug', `[ws] ${args.join(' ')}`);
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
    this.cachedGateway = gateway;
    this.spawnShards();
  }

  spawnShards() {
    (function spawnLoop(id) {
      if (id >= this.client.options.shardCount) return;
      this.debug(`Spawning shard ${id}`);
      this.spawnShard(id, this.cachedGateway)
      .once('ready', () => {
        this.client.setTimeout(spawnLoop.bind(this, id + 1), 5500);
        /**
         * Emitted when a shard becomes ready to start working.
         * @event Client#shardReady
         */
        this.client.emit(Constants.Events.SHARD_READY, id);
        if (id === this.client.options.shardCount) {
          /**
           * Emitted when the client becomes ready to start working.
           * @event Client#ready
           */
          this.client.emit(Constants.Events.READY);
        }
      });
    }.bind(this)(0));
  }

  spawnShard(id, gateway) {
    const shard = new WebSocketConnection(this, id, gateway);
    // Handlers for disconnect and such go here
    this.shards.set(id, shard);
    return shard;
  }
}

module.exports = WebSocketManager;
