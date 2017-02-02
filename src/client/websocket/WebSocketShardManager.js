const EventEmitter = require('events').EventEmitter;
const WebSocketManager = require('./WebSocketManager');
const Constants = require('../../util/Constants');
const PacketManager = require('./packets/WebSocketPacketManager');
const Collection = require('../../util/Collection');

/**
 * A manager for the WebSocketManagers
 */
class WebSocketShardManager extends EventEmitter {
  /**
   * A manager for the WebSocketManagers
   * @param {Client} client Client this was intantiated with
   */
  constructor(client) {
    super();

    /**
     * The Client that instantiated this WebSocketShardManager
     * @type {Client}
     */
    this.client = client;

    /**
     * The packet manager
     * @type {PacketManager}
     */
    this.packetManager = new PacketManager(this);

    /**
     * A collection of WebSocketManagers
     * @type {Collection<WebSocketManager>}
     */
    this.managers = new Collection();

    /**
     * The gateway address, null if not yet available.
     * @type {?string}
     */
    this.gateway = null;

    /**
     * If this.connect has been called
     * @type {boolean}
     */
    this.afterConnect = false;

    /**
     * If the client has emitted a ready
     * @type {boolean}
     */
    this.afterReady = false;

    if (client.options.shardCount !== 'auto') {
      /**
       * The initial number of shards to spawn
       * @type {number}
       */
      this.shardCount = Math.max(1, client.options.shardCount);

      if (this.client.options.shardID) {
        this.spawn(0);
      } else {
        this._spawnAll();
      }
    }

    this.client.on('shardReady', () => {
      this.checkIfReady();
    });
  }

  /**
   * Spawn all shards
   */
  _spawnAll() {
    this.client.emit('debug', `Spawning ${this.shardCount} shard(s)`);
    (function spawnLoop(id) {
      const manager = this.spawn(id);
      manager.on('ready', () => {
        if (this.managers.size >= this.shardCount) return;
        this.client.setTimeout(() => {
          spawnLoop.bind(this)(++id);
        }, 5000);
      });
    }.bind(this)(0));
  }

  /**
   * Spawn a shard
   * @param {number} id ID of shard to spawn
   * @returns {WebSocketManager}
   */
  spawn(id) {
    const manager = new WebSocketManager(this.client, this.packetManager, {
      shardID: id,
      shardCount: this.shardCount,
    });

    manager.on('send', this.emit);

    manager.on(Constants.Events.RECONNECTING, () => {
      /**
       * Emitted when the Client tries to reconnect after being disconnected
       * @event Client#reconnecting
       * @param {Number} shardID ID of the shard that is reconnecting
       */
      this.client.emit(Constants.Events.RECONNECTING, id);
    });

    manager.on(Constants.Events.DISCONNECT, event => {
      this.client.emit(Constants.Events.DISCONNECT, event, id);
    });

    manager.on('close', (event, shardID) => {
      this.emit('close', event, shardID);
      const handler = () => {
        this.client.clearTimeout(timeout);
        manager.removeListener('open', handler);
      };
      const timeout = this.client.setTimeout(() => {
        manager.destroy();
        this.spawn(id);
      }, manager.heartbeatTime);
      manager.on('open', handler);
    });

    if (this.afterConnect) manager.connect(this.gateway);

    this.managers.set(id, manager);

    return manager;
  }

  /**
   * Kill a shardID
   * @param {number} id ID of shard to kill
   * @returns {boolean}
   */
  kill(id) {
    const existing = this.managers.get(id);
    if (!existing) return false;
    existing.destroy();
    this.managers.delete(id);
    return true;
  }

  /**
   * Respawn a shardID
   * @param {number} id ID of shard to respawn
   * @returns {boolean}
   */
  respawn(id) {
    if (this.kill(id)) {
      return this.spawn(id);
    } else {
      return false;
    }
  }

  /**
   * Connect to the gateway
   * @param {string} gateway The gateway to connect to
   * @param {number} [shardCount] Number of shards to spawn
   */
  connect(gateway, shardCount) {
    this.gateway = gateway;
    this.afterConnect = true;
    if (shardCount) {
      this.shardCount = shardCount;
      this._spawnAll();
    } else {
      for (const manager of this.managers.values()) {
        manager.connect(gateway);
      }
    }
  }

  /**
   * Send a message from all shard websockets
   * @param {*} data The packet to send
   */
  broadcast(data) {
    for (const manager of this.managers.values()) manager.send(data);
  }

  /**
   * Check if the client is ready
   * @param {number} [shardID] ID of shard to prompt a ready check on
   */
  checkIfReady() {
    if (this.managers.size < this.shardCount) return;
    if (this.managers.every((m) => m.status === Constants.Status.READY)) {
      if (!this.afterReady) {
        /**
         * Emitted when the Client becomes ready to start working
         * @event Client#ready
         */
        this.client.emit(Constants.Events.READY);
        this.afterReady = true;
      }
    }
  }
}

module.exports = WebSocketShardManager;
