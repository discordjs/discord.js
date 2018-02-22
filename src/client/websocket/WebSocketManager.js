const Collection = require('../../util/Collection');
const { Error, RangeError } = require('../../errors');
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

    /**
     * The shards connected to this manager
     * @type {Collection<number, WebSocketConnection>}
     */
    this.shards = new Collection();

    /**
     * A cached gateway url
     * @type {?string}
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
  broadcast(packet) {
    if (!this.shards.size) {
      this.debug('No websocket connections');
      return false;
    }
    for (const shard of this.shards.values()) shard.send(packet);
    return true;
  }

  /**
   * Connects all appropriate shards to the gateway.
   * @param {string} gateway The gateway to connect to
   * @param {Function} resolve Function to run when connection is successful
   * @param {Function} reject Function to run when connection fails
   */
  spawn(gateway, resolve, reject) {
    this.gateway = gateway;
    let shardsToSpawn;
    if (!(this.client.options.shardID instanceof Array) && typeof this.client.options.shardID !== 'number' &&
        this.client.options.shardCount) {
      shardsToSpawn = new Array(this.client.options.shardCount).fill(0).map((v, i) => i);
    } else if (this.client.options.shardID instanceof Array) {
      shardsToSpawn = this.client.options.shardID;
    } else if (typeof this.client.options.shardID !== 'number' && !this.client.options.shardCount) {
      shardsToSpawn = [0];
    } else {
      shardsToSpawn = [this.client.options.shardID];
    }
    if (shardsToSpawn.some(i => i !== 0 && i >= this.client.options.shardCount)) {
      reject(new RangeError('CLIENT_INVALID_OPTION', 'shardID', `less than ${this.client.options.shardCount}`));
      return;
    }
    this.debug(`Shards to spawn ${JSON.stringify(shardsToSpawn)}`);
    const spawnShard = pos => {
      if (pos >= shardsToSpawn.length) return;
      const id = shardsToSpawn[pos];
      this.debug(`Spawning shard ${id}`);
      const shard = this.createShard(id);
      shard.once('error', reject);
      shard.once('close', event => {
        this.debug(`Event ${event}`);
        if (event.code === 4004) reject(new Error('TOKEN_INVALID'));
        if (event.code === 4010) reject(new Error('SHARDING_INVALID'));
        if (event.code === 4011) reject(new Error('SHARDING_REQUIRED'));
      });
      shard.once('ready', () => {
        this.debug(`Shard ${id} is ready`);
        this.client.setTimeout(newPos => spawnShard(newPos), 5500, pos + 1);
        /**
         * Emitted when a shard becomes ready to start working.
         * @event Client#shardReady
         * @param {Number} shardID The created shard's ID
         */
        this.client.emit(Events.SHARD_READY, id);
        if (pos === shardsToSpawn.length - 1) {
          /**
           * Emitted when the client becomes ready to start working.
           * @event Client#ready
           */
          this.client.emit(Events.READY);
          this.packetManager.handleQueue();
        }
      });
    };
    spawnShard(0);
  }

  /**
   * Spawns a new shard on the client
   * @param {number} id The shard's ID
   * @returns {WebSocketConnection} The created shard
   */
  createShard(id) {
    const shard = new WebSocketConnection(this, id);
    this.shards.set(id, shard);
    return shard;
  }
}

module.exports = WebSocketManager;
