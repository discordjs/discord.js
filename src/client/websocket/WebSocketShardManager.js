const EventEmitter = require('events').EventEmitter;
const WebSocketManager = require('./WebSocketManager');
const WebSocketConnection = require('./WebSocketConnection');
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
      client.options.shardCount = Math.max(1, client.options.shardCount);

      if (this.client.options.shardID) {
        this.spawn(this.client.options.shardID);
      } else {
        this._spawnAll();
      }
    }

    this.client.on('shardReady', () => {
      this.checkIfReady();
    });
  }

  get encoding() {
    return WebSocketConnection.encoding;
  }

  /**
   * Spawn all shards
   */
  _spawnAll() {
    this.client.emit('debug', `Spawning ${this.shardCount} shard(s)`);
    (function spawnLoop(id) {
      const manager = this.spawn(id);
      manager.once('ready', () => {
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
    if (!this.managers.has(id)) return false;
    this.managers.get(id).destroy();
    this.managers.delete(id);
    return true;
  }

  killAll() {
    for (const key of this.managers.keys()) this.kill(key);
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
   * Reshard
   * @param {number} count Number of shards
   * @param {number} [id] ID of shard if only one shard in the process
   */
  reshard(count, id) {
    this.shardCount = count;
    this.killAll();
    if (id) {
      this.client.options.shardID = id;
      this.spawn(id);
    } else {
      this._spawnAll();
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
   * Sets the full presence of the client user for all shards
   * @param {PresenceData} data Data for the presence
   */
  setPresence(data) {
    for (const manager of this.managers.values()) manager.setPresence(data);
  }

  /**
   * Set the status of this shard
   * @param {PresenceStatus} status Status to set
   */
  setStatus(status) {
    for (const manager of this.managers.values()) manager.setStatus(status);
  }

  /**
   * Set the game this shard is playing
   * @param {string} [name] Name of the game
   * @param {string} [url] URL for a stream
   */
  setGame(name, url) {
    for (const manager of this.managers.values()) manager.setGame(name, url);
  }

  /**
   * The statuses of the websocket managers
   * @type {number[]}
   * @readonly
   */
  get statuses() {
    return this.managers.map(m => m.status);
  }

  /**
   * The uptimes for the websocket managers
   * @type {number[]}
   * @readonly
   */
  get uptimes() {
    return this.managers.map(m => m.uptime);
  }

  /**
   * The previous average heartbeat pings of the websockets
   * @type {number[]}
   */
  get pings() {
    return this.managers.map(m => m.ping);
  }

  /**
   * The average heartbeat ping of the websockets
   * @type {?number}
   * @readonly
   */
  get ping() {
    if (this.pings.length === 0) return null;
    return this.pings.reduce((prev, p) => prev + p, 0) / this.pings.length;
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

  get shardCount() {
    return this.client.options.shardCount;
  }

  set shardCount(count) {
    this.client.options.shardCount = count;
    return count;
  }
}

module.exports = WebSocketShardManager;
