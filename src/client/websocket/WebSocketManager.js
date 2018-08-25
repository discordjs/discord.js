const WebSocketShard = require('./WebSocketShard');
const { Events, Status, WSEvents } = require('../../util/Constants');
const PacketHandlers = require('./handlers');

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
  constructor(client, sessionStartLimit) {
    /**
     * The client that instantiated this WebSocketManager
     * @type {Client}
     */
    this.client = client;

    /**
     * The gateway this WebSocketManager uses.
     * @type {string}
     */
    this.gateway = undefined;

    /**
     * An array of shards spawned by this WebSocketManager.
     * @type {WebSocketShard[]}
     */
    this.shards = [];

    /**
     * An array of queued shards to be spawned by this WebSocketManager.
     * @type {WebSocketShard[]}
     */
    this.spawnQueue = [];

    /**
     * Whether or not this WebSocketManager is currently spawning shards.
     * @type {boolean}
     */
    this.spawning = false;

    /**
     * An array of queued events before this WebSocketManager became ready.
     * @type {Immediate[]}
     */
    this.packetQueue = [];

    /**
     * The current status of this WebSocketManager.
     * @type {number}
     */
    this.status = Status.IDLE;

    /**
     * The current session limit of the client.
     * @type {object}
     */
    this.sessionStartLimit = sessionStartLimit;
  }

  /**
   * The average ping of all WebSocket shards
   * @type {number}
   * @readonly
   */
  get ping() {
    const sum = this.shards.reduce((a, b) => a + b.ping, 0);
    return sum / this.shards.length;
  }

  /**
   * Emits a debug event.
   * @param {string} message Debug message
   * @returns {void}
   */
  debug(message) {
    this.client.emit(Events.DEBUG, `[connection] ${message}`);
  }

  async _handleSessionLimit(shard) {
    if (!this.sessionStartLimit && this.spawnQueue.length) {
      this.spawn();
    } else if (this.sessionStartLimit) {
      this.sessionStartLimit = await this.client.api.gateway.bot.get().then(r => r.session_start_limit);
      const { remaining, reset_after } = this.sessionStartLimit;
      if (remaining !== 0) {
        this.spawn();
      } else {
        shard.debug(`Exceeded identify threshold, setting a timeout for ${reset_after} ms`);
        setTimeout(() => this.spawn(), this.sessionStartLimit.reset_after);
      }
    }
  }

  /**
   * Used to spawn WebSocketShards.
   * @param {WebSocketShard|WebSocketShard[]} query The WebSocketShards to be spawned
   */
  spawn(query) {
    if (query !== undefined) {
      if (Array.isArray(query)) {
        for (const item of query) {
          if (!this.spawnQueue.includes(item)) this.spawnQueue.push(item);
        }
      } else if (!this.spawnQueue.includes(query)) {
        this.spawnQueue.push(query);
      }
    }
    if (this.spawning) return;
    this.spawning = true;
    let item = this.spawnQueue.shift();
    if (item === undefined) {
      this.spawning = false;
      return;
    }
    if (typeof item === 'string' && !isNaN(item)) item = Number(item);
    if (typeof item === 'number') {
      const shard = new WebSocketShard(this, item, this.shards[item]);
      this.shards[item] = shard;
      shard.once(Events.READY, () => {
        this.spawning = false;
        this.client.setTimeout(() => this._handleSessionLimit(shard), 5000);
      });
      shard.once('invalidated', () => {
        this.spawning = false;
      });
    } else if (item instanceof WebSocketShard) {
      item.reconnect();
    }
  }

  /**
   * Creates a connection to a gateway.
   * @param {string} [gateway] The gateway to connect to
   * @returns {void}
   */
  connect(gateway = this.gateway) {
    this.gateway = gateway;

    if (typeof this.client.options.shards === 'number') {
      this.debug('Spawning 1 shard');
      this.spawn(this.client.options.shards);
    } else if (Array.isArray(this.client.options.shards)) {
      this.debug(`Spawning ${this.client.options.shards.length} shards`);
      for (let i = 0; i < this.client.options.shards.length; i++) {
        this.spawn(this.client.options.shards[i]);
      }
    } else {
      this.debug(`Spawning ${this.client.options.shardCount} shards`);
      for (let i = 0; i < this.client.options.shardCount; i++) {
        this.spawn(i);
      }
    }
  }

  /**
   * Processes a packet and queues it if this WebSocketManager is not ready.
   * @param {Object} packet The packet to be handled
   * @param {WebSocketShard} shard The shard that will handle this packet
   * @returns {boolean}
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
        this.handlePacket(item.packet, this.shards[item.shardID]);
      });
    }

    if (packet && PacketHandlers[packet.t]) {
      PacketHandlers[packet.t](this.client, packet, shard);
    }

    return false;
  }

  /**
   * Checks whether the client is ready to be marked as ready.
   * @returns {void}
   */
  checkReady() {
    if (!(this.shards.filter(s => s).length === this.client.options.actualShardCount) ||
      !this.shards.filter(s => s).every(s => s.status === Status.READY)) {
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
   */
  triggerReady() {
    if (this.status === Status.READY) {
      this.debug('Tried to mark self as ready, but already ready');
      return;
    }
    /**
     * Emitted when the client becomes ready to start working.
     * @event Client#ready
     */
    this.status = Status.READY;
    this.client.emit(Events.READY);
    this.handlePacket();
  }

  /*
   * Broadcasts a message to every shard in this WebSocketManager.
   * @param {*} packet The packet to send
   */
  broadcast(packet) {
    for (const shard of this.shards) {
      shard.send(packet);
    }
  }

  destroy() {
    this.gateway = undefined;
    // lock calls to spawn
    this.spawning = true;

    // Destroy all shards
    for (const shard of this.shards) {
      if (!shard) continue;
      shard.destroy();
    }
  }
}

module.exports = WebSocketManager;
