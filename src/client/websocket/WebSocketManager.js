'use strict';

const Collection = require('../../util/Collection');
const Util = require('../../util/Util');
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
 * The WebSocket manager for this client.
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
     * The gateway this manager uses
     * @type {?string}
     */
    this.gateway = undefined;

    /**
     * A collection of all shards this manager handles
     * @type {Collection<number, WebSocketShard>}
     */
    this.shards = new Collection();

    /**
     * An array of shards to be spawned or reconnected
     * @type {Array<number|WebSocketShard>}
     * @private
     */
    this.shardQueue = [];

    /**
     * An array of queued events before this WebSocketManager became ready
     * @type {object[]}
     * @private
     */
    this.packetQueue = [];

    /**
     * The current status of this WebSocketManager
     * @type {number}
     */
    this.status = Status.IDLE;

    /**
     * If this manager is expected to close
     * @type {boolean}
     * @private
     */
    this.expectingClose = false;

    /**
     * The current session limit of the client
     * @type {?Object}
     * @private
     * @prop {number} total Total number of identifies available
     * @prop {number} remaining Number of identifies remaining
     * @prop {number} reset_after Number of milliseconds after which the limit resets
     */
    this.sessionStartLimit = null;

    /**
     * If the manager is currently reconnecting shards
     * @type {boolean}
     * @private
     */
    this.isReconnectingShards = false;
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
   * @private
   */
  debug(message) {
    this.client.emit(Events.DEBUG, message);
  }

  /**
   * Checks if a new identify payload can be sent.
   * @private
   * @returns {Promise<boolean|number>}
   */
  async _checkSessionLimit() {
    this.sessionStartLimit = await this.client.api.gateway.bot.get().then(r => r.session_start_limit);
    const { remaining, reset_after } = this.sessionStartLimit;
    if (remaining !== 0) return true;
    return reset_after;
  }

  /**
   * Handles the session identify rate limit for creating a shard.
   * @private
   */
  async _handleSessionLimit() {
    const canSpawn = await this._checkSessionLimit();
    if (typeof canSpawn === 'number') {
      this.debug(`Exceeded identify threshold, setting a timeout for ${canSpawn}ms`);
      await Util.delayFor(canSpawn);
    }
    this.create();
  }

  /**
   * Creates a connection to a gateway.
   * @param {string} [gateway=this.gateway] The gateway to connect to
   * @private
   */
  connect(gateway = this.gateway) {
    this.gateway = gateway;

    if (typeof this.client.options.shards === 'number') {
      this.debug(`Spawning shard with ID ${this.client.options.shards}`);
      this.shardQueue.push(this.client.options.shards);
    } else if (Array.isArray(this.client.options.shards)) {
      this.debug(`Spawning ${this.client.options.shards.length} shards`);
      this.shardQueue.push(...this.client.options.shards);
    } else {
      this.debug(`Spawning ${this.client.options.shardCount} shards`);
      this.shardQueue.push(...Array.from({ length: this.client.options.shardCount }, (_, index) => index));
    }
    this.create();
  }

  /**
   * Creates or reconnects a shard.
   * @private
   */
  create() {
    // Nothing to create
    if (!this.shardQueue.length) return;

    let item = this.shardQueue.shift();
    if (typeof item === 'string' && !isNaN(item)) item = Number(item);

    if (item instanceof WebSocketShard) {
      const timeout = setTimeout(() => {
        this.debug(`[Shard ${item.id}] Failed to connect in 15s... Destroying and trying again`);
        item.destroy();
        if (!this.shardQueue.includes(item)) this.shardQueue.push(item);
        this.reconnect(true);
      }, 15000);
      item.once(Events.READY, this._shardReady.bind(this, timeout));
      item.once(Events.RESUMED, this._shardReady.bind(this, timeout));
      item.connect();
      return;
    }

    const shard = new WebSocketShard(this, item);
    this.shards.set(item, shard);
    shard.once(Events.READY, this._shardReady.bind(this));
  }

  /**
   * Shared handler for shards turning ready or resuming.
   * @param {Timeout} [timeout=null] Optional timeout to clear if shard didn't turn ready in time
   * @private
   */
  _shardReady(timeout = null) {
    if (timeout) clearTimeout(timeout);
    if (this.shardQueue.length) {
      this.client.setTimeout(this._handleSessionLimit.bind(this), 5000);
    } else {
      this.isReconnectingShards = false;
    }
  }

  /**
   * Handles the reconnect of a shard.
   * @param {WebSocketShard|boolean} shard The shard to reconnect, or a boolean to indicate an immediate reconnect
   * @private
   */
  async reconnect(shard) {
    // If the item is a shard, add it to the queue
    if (shard instanceof WebSocketShard) this.shardQueue.push(shard);
    if (typeof shard === 'boolean') {
      // If a boolean is passed, force a reconnect right now
    } else if (this.isReconnectingShards) {
      // If we're already reconnecting shards, and no boolean was provided, return
      return;
    }
    this.isReconnectingShards = true;
    try {
      await this._handleSessionLimit();
    } catch (error) {
      // If we get an error at this point, it means we cannot reconnect anymore
      if (this.client.listenerCount(Events.INVALIDATED)) {
        /**
         * Emitted when the client's session becomes invalidated.
         * You are expected to handle closing the process gracefully and preventing a boot loop
         * if you are listening to this event.
         * @event Client#invalidated
         */
        this.client.emit(Events.INVALIDATED);
        // Destroy just the shards. This means you have to handle the cleanup yourself
        this.destroy();
      } else {
        this.client.destroy();
      }
    }
  }

  /**
   * Processes a packet and queues it if this WebSocketManager is not ready.
   * @param {Object} [packet] The packet to be handled
   * @param {WebSocketShard} [shard] The shard that will handle this packet
   * @returns {boolean}
   * @private
   */
  handlePacket(packet, shard) {
    if (packet && this.status !== Status.READY) {
      if (!BeforeReadyWhitelist.includes(packet.t)) {
        this.packetQueue.push({ packet, shard });
        return false;
      }
    }

    if (this.packetQueue.length) {
      const item = this.packetQueue.shift();
      this.client.setImmediate(() => {
        this.handlePacket(item.packet, item.shard);
      });
    }

    if (packet && !this.client.options.disabledEvents.includes(packet.t) && PacketHandlers[packet.t]) {
      PacketHandlers[packet.t](this.client, packet, shard);
    }

    return true;
  }

  /**
   * Checks whether the client is ready to be marked as ready.
   * @returns {boolean}
   * @private
   */
  checkReady() {
    if (this.shards.size !== this.client.options.shardCount ||
      this.shards.some(s => s.status !== Status.READY)) {
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
   * @private
   */
  broadcast(packet) {
    for (const shard of this.shards.values()) shard.send(packet);
  }

  /**
   * Destroys all shards.
   * @private
   */
  destroy() {
    if (this.expectingClose) return;
    this.expectingClose = true;
    this.isReconnectingShards = false;
    this.shardQueue.length = 0;
    for (const shard of this.shards.values()) shard.destroy();
  }
}

module.exports = WebSocketManager;
