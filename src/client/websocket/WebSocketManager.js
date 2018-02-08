const Collection = require('../../util/Collection');
const EventEmitter = require('events');
const { Events } = require('../../util/Constants');
const PacketManager = require('./packets/WebSocketPacketManager');
const WebSocketConnection = require('./WebSocketConnection');

/**
 * WebSocket Manager of the client.
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

    /*
     * The Shards connected to this manager.
     * @type {Collection}
     */
    this.shards = new Collection();

    /**
     * A cached gateway url
     * @type {string}
     */
    this.gateway = null;

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
   * Sends a heartbeat on the available connection.
   * @returns {void}
   */
  heartbeat() {
    if (!this.connection) return this.debug('No connection to heartbeat');
    return this.connection.heartbeat();
  }

  /**
   * Emits a debug event.
   * @param {string} message Debug message
   * @returns {void}
   */
  debug(message) {
    return this.client.emit(Events.DEBUG, `[ws] ${message}`);
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
    this.packetManager.handleQueue();
    for (const shard of this.shards.values()) shard.destroy();
    return true;
  }

  /**
   * Send a packet on the available WebSocket.
   * @param {Object} packet Packet to send
   * @returns {boolean}
   */
  send(packet) {
    if (!this.shards.size) {
      this.debug('No connection any websockets');
      return false;
    }
    for (const shard of this.shards.values()) shard.send(packet);
    return true;
  }

  /**
   * Connects all appropriate Shards to the gateway.
   * @param {string} gateway The gateway to connect to
   * @param {Function} resolve Function to run when connection is successful
   * @param {Function} reject Function to run when connection fails
   */
  spawn(gateway, resolve, reject) {
    this.debug(`SHARD EXISTS: ${typeof this.client.shard}`);
    this.debug(`SHARD ID: ${(this.client.shard ? this.client.shard.id : 0)}`);
    this.gateway = gateway;
    (function spawnLoop(id) {
      if (id >= this.client.options.shardCount) return;
      this.debug(`Spawning shard ${id}`);
      const shard = this.createShard(id);
      shard.ws.once('error', reject);
      shard.ws.once('close', event => {
        if (event === 4004) reject(new Error('TOKEN_INVALID'));
        if (event === 4010) reject(new Error('SHARDING_INVALID'));
        if (event === 4011) reject(new Error('SHARDING_REQUIRED'));
      });
      shard.once('ready', () => {
        this.debug(`Shard ready ${id}`);
        if (this.client.options.internalSharding) this.client.setTimeout(spawnLoop.bind(this, id + 1), 5500);
        /**
         * Emitted when a shard becomes ready to start working.
         * @event Client#shardReady
         * @param {Number} shardId The created shard's ID
         */
        this.client.emit(Events.SHARD_READY, id);
        if (this.client.options.internalSharding && id === this.client.options.shardCount - 1) {
          /**
           * Emitted when the client becomes ready to start working.
           * @event Client#ready
           */
          this.client.emit(Events.READY);
          this.packetManager.handleQueue();
        }
      });
    }.bind(this)(this.client.shard ? this.client.shard.id : 0));
  }

  /**
   * Spawns a new Shard on the client
   * @param {number} id The Shard's ID
   * @returns {WebSocketConnection} The created Shard
   */
  createShard(id) {
    const shard = new WebSocketConnection(this, id);
    this.shards.set(id, shard);
    return shard;
  }
}

module.exports = WebSocketManager;
