const Collection = require('../../util/Collection');
const WebSocketShard = require('./WebSocketShard');
const { Events, Status, WSEvents } = require('../../util/Constants');
const PacketHandlers = require('./handlers');
const Util = require('../../util/Util');

const BeforeReadyWhitelist = [
  WSEvents.READY,
  WSEvents.RESUMED,
  WSEvents.GUILD_CREATE,
  WSEvents.GUILD_DELETE,
  WSEvents.GUILD_MEMBERS_CHUNK,
  WSEvents.GUILD_MEMBER_ADD,
  WSEvents.GUILD_MEMBER_REMOVE,
];

/**
 * WebSocket Manager of the client.
 */
class WebSocketManager {
  constructor(client) {
    /**
     * The client that instantiated this WebSocketManager
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The gateway this WebSocketManager uses.
     * @type {?string}
     */
    this.gateway = undefined;

    /**
     * An array of shards spawned by this WebSocketManager.
     * @type {Collection<number, WebSocketShard>}
     */
    this.shards = new Collection();

    /**
     * An array of queued shards to be spawned by this WebSocketManager.
     * @type {Array<WebSocketShard|number|string>}
     * @private
     */
    this.spawnQueue = [];

    /**
     * An array of queued shard IDs to be reconnected.
     * @type {WebSocketShard[]}
     * @private
     */
    this.reconnectQueue = [];

    /**
     * Wether or not this WebSocketManager is currently reconnecting a shard.
     * @type {boolean}
     * @private
     */
    this.reconnecting = false;

    /**
     * The timeout induced until shards can start reconnecting again.
     * @type {?Timeout}
     * @private
     */
    this.reconnectTimeout = null;

    /**
     * Whether or not this WebSocketManager is currently spawning shards.
     * @type {boolean}
     * @private
     */
    this.spawning = false;

    /**
     * An array of queued events before this WebSocketManager became ready.
     * @type {object[]}
     * @private
     */
    this.packetQueue = [];

    /**
     * The current status of this WebSocketManager.
     * @type {number}
     */
    this.status = Status.IDLE;

    /**
     * The current session limit of the client.
     * @type {?Object}
     * @prop {number} total Total number of identifies available
     * @prop {number} remaining Number of identifies remaining
     * @prop {number} reset_after Number of milliseconds after which the limit resets
     */
    this.sessionStartLimit = null;
  }

  /**
   * The average ping of all WebSocketShards
   * @type {number}
   * @readonly
   */
  get ping() {
    const sum = this.shards.reduce((a, b) => a + b.ping, 0);
    return sum / this.shards.size;
  }

  /**
   * Emits a debug event.
   * @param {string} message Debug message
   * @returns {void}
   * @private
   */
  debug(message) {
    this.client.emit(Events.DEBUG, `[connection] ${message}`);
  }

  /**
   * Handles the session identify rate limit for a shard.
   * @param {WebSocketShard} shard Shard to handle
   * @private
   */
  async _handleSessionLimit(shard) {
    this.sessionStartLimit = await this.client.api.gateway.bot.get().then(r => r.session_start_limit);
    const { remaining, reset_after } = this.sessionStartLimit;
    if (remaining === 0) {
      shard.debug(`Exceeded identify threshold, setting a timeout for ${reset_after} ms`);
      await Util.delayFor(this.sessionStartLimit.reset_after);
    }
    this.spawning = false;
    this.reconnecting = false;
    clearTimeout(this.reconnectTimeout);
    this.spawn();
    this.reconnect();
  }

  onShardReady() {
    return setTimeout(() => this._handleSessionLimit(), 5000);
  }

  /**
   * Used to spawn WebSocketShards.
   * @param {?number} query The WebSocketShards to be spawned
   * @returns {void}
   * @private
   */
  spawn(query) {
    if (!isNaN(query)) {
      this.spawnQueue.push(query);
    }
    if (this.spawning || !this.spawnQueue.length) return;
    this.spawning = true;
    const item = this.spawnQueue.shift();
    const shard = new WebSocketShard(this, item);
    this.shards.set(shard.id, shard);
    shard.on(Events.READY, this.onShardReady.bind(this));
    shard.on(Events.RESUMED, this.onShardReady.bind(this));
  }

  /**
   * Creates a connection to a gateway.
   * @param {string} [gateway=this.gateway] The gateway to connect to
   * @returns {void}
   * @private
   */
  connect(gateway = this.gateway) {
    this.gateway = gateway;

    if (typeof this.client.options.shards === 'number') {
      this.debug('Spawning 1 shard');
      this.spawn(this.client.options.shards);
    } else if (Array.isArray(this.client.options.shards)) {
      this.debug(`Spawning ${this.client.options.shards.length} shards`);
      for (const shard of this.client.options.shards) {
        // Where shard is each shard id, spawn each one
        this.spawn(shard);
      }
    } else {
      this.debug(`Spawning ${this.client.options.shardCount} shards`);
      for (let i = 0; i < this.client.options.shardCount; i++) {
        // Where i is each shard is, spawn each ones
        this.spawn(i);
      }
    }
  }

  /**
   * Processes a packet and queues it if this WebSocketManager is not ready.
   * @param {Object} packet The packet to be handled
   * @param {WebSocketShard} shard The shard that will handle this packet
   * @returns {boolean}
   * @private
   */
  handlePacket(packet, shard) {
    if (packet && this.status !== Status.READY) {
      if (!BeforeReadyWhitelist.includes(packet.t)) {
        this.packetQueue.push({ packet, shardID: shard.id });
        return false;
      }
    }

    if (this.packetQueue.length) {
      const item = this.packetQueue.shift();
      this.client.setImmediate(() => {
        this.handlePacket(item.packet, this.shards.get(item.shardID));
      });
    }

    if (packet && !this.client.options.disabledEvents.includes(packet.t) && PacketHandlers[packet.t]) {
      PacketHandlers[packet.t](this.client, packet, shard);
    }

    return false;
  }

  /**
   * Checks whether the client is ready to be marked as ready.
   * @returns {boolean}
   * @private
   */
  checkReady() {
    if (this.shards.size !== this.client.options.shardCount ||
      this.shards.some(s => s && s.status !== Status.READY)) {
      return false;
    }

    let unavailableGuilds = 0;
    for (const guild of this.client.guilds.values()) {
      if (!guild.available) unavailableGuilds++;
    }
    if (unavailableGuilds === 0) {
      this.status = Status.NEARLY;
      if (!this.client.options.fetchAllMembers) return this.triggerReady();
      // Fetch all members before marking self as ready
      const promises = this.client.guilds.map(g => g.members.fetch());
      Promise.all(promises)
        .then(() => this.triggerReady())
        .catch(e => {
          this.debug(`Failed to fetch all members before ready! ${e}`);
          this.triggerReady();
        });
    }
    return true;
  }

  /**
   * Causes the client to be marked as ready and emits the ready event.
   * @returns {void}
   * @private
   */
  triggerReady() {
    if (this.status === Status.READY) {
      this.debug('Tried to mark self as ready, but already ready');
      return;
    }
    this.status = Status.READY;

    /**
     * Emitted when the client becomes ready to start working.
     * @event Client#ready
     */
    this.client.emit(Events.READY);

    this.handlePacket();
  }

  /**
   * Broadcasts a message to every shard in this WebSocketManager.
   * @param {*} packet The packet to send
   */
  broadcast(packet) {
    for (const shard of this.shards.values()) {
      shard.send(packet);
    }
  }

  /**
   * Destroys all shards.
   * @returns {void}
   * @private
   */
  destroy() {
    this.gateway = undefined;
    // Lock calls to spawn
    this.spawning = true;

    for (const shard of this.shards.values()) {
      shard.destroy();
    }
  }

  /**
   * Adds a shard to the reconnect queue.
   * @param {?WebSocketShard} shard The shard to reconnect
   * @returns {void}
   */
  reconnect(shard) {
    if (shard && !this.reconnectQueue.some(s => s.id === shard.id)) {
      this.reconnectQueue.push(shard);
    }
    if (!this.reconnectQueue.length || this.reconnecting) return;
    this.reconnectTimeout = setTimeout(() => {
      // Called if a shard never received a READY or RESUMED
      this.reconnecting = false;
      this.reconnect(item);
    }, 15000);
    this.reconnecting = true;
    const item = this.reconnectQueue.shift();
    item.connect();
  }
}

module.exports = WebSocketManager;
