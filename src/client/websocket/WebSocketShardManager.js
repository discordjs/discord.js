const EventEmitter = require('events').EventEmitter;
const WebSocketShard = require('./WebSocketShard');
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
    this.killAll();
    (function spawnLoop(id) {
      const cb = () => spawnLoop.bind(this)(++id);
      const manager = this.spawn(id);
      if (this.managers.size >= this.shardCount) return;
      manager.once('ready', () => {
        manager.removeListener('close', cb);
        this.client.setTimeout(cb, 5000);
      });
      manager.once('close', cb);
    }.bind(this)(0));
  }

  /**
   * Spawn a shard
   * @param {number} id ID of shard to spawn
   * @returns {WebSocketManager}
   */
  spawn(id) {
    const manager = new WebSocketShard(this.client, this.packetManager, {
      shardID: id,
      shardCount: this.shardCount,
    });

    this.managers.set(id, manager);

    manager.on('send', packet => this.emit('send', packet, this.id));

    manager.on(Constants.Events.RECONNECTING, () => {
      /**
       * Emitted when the Client tries to reconnect after being disconnected
       * @event Client#reconnecting
       * @param {Number} shardID ID of the shard that is reconnecting
       */
      this.client.emit(Constants.Events.RECONNECTING, id);
    });

    manager.on(Constants.Events.DISCONNECT, event => {
      this.client.emit(Constants.Events.DISCONNECT, event, manager.id);
    });

    manager.on('close', (event, shardID) => {
      this.emit('close', event, shardID);
      const handler = () => {
        this.client.clearTimeout(timeout);
        manager.removeListener('open', handler);
      };
      // Copy the value to remove references in case we destroy it
      const time = manager.heartbeatTime;
      const timeout = this.client.setTimeout(() => {
        manager.destroy();
        this.spawn(id);
      }, time);
      manager.once('open', handler);
    });

    if (this.afterConnect) manager.connect(this.gateway);

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
   * Connect to the gateway
   * @param {string} gateway The gateway to connect to
   */
  connect(gateway) {
    this.gateway = gateway;
    this.afterConnect = true;
    if (this.client.options.shardID) {
      this.spawn(this.client.options.shardID);
    } else {
      this._spawnAll();
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
    if (this.managers.every(m => m.status === Constants.Status.READY)) {
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
