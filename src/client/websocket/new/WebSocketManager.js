'use strict';

const EventEmitter = require('events');
const { Error } = require('../../../errors');
const Collection = require('../../../util/Collection');
const Util = require('../../../util/Util');
const WebSocketShard = require('./WebSocketShard');
const { Events, Status, WSCodes, WSEvents } = require('../../../util/Constants');
const PacketHandlers = require('../handlers');

const BeforeReadyWhitelist = [
  WSEvents.READY,
  WSEvents.RESUMED,
  WSEvents.GUILD_CREATE,
  WSEvents.GUILD_DELETE,
  WSEvents.GUILD_MEMBERS_CHUNK,
  WSEvents.GUILD_MEMBER_ADD,
  WSEvents.GUILD_MEMBER_REMOVE,
];

const UNRECOVERABLE_CLOSE_CODES = [4004, 4010, 4011];

/**
 * The WebSocket manager for this client.
 */
class WebSocketManager extends EventEmitter {
  constructor(client) {
    super();

    /**
     * The client that instantiated this WebSocketManager
     * @type {Client}
     * @readonly
     * @name WebSocketManager#client
     */
    this.client = client;

    /**
     * The gateway this manager uses
     * @type {?string}
     */
    this.gateway = undefined;

    /**
     * The amount of shards this manager handles
     * @private
     * @type {number|string}
     */
    this.totalShards = this.client.options.shardCount;

    /**
     * A collection of all shards this manager handles
     * @type {Collection<number, WebSocketShard>}
     */
    this.shards = new Collection();

    /**
     * An array of shards to be connected or that need to reconnect
     * @type {Array<WebSocketShard>}
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
     * If this manager was destroyed. It will prevent shards from reconnecting
     * @type {boolean}
     * @private
     */
    this.destroyed = false;

    /**
     * If this manager is currently reconnecting one or multiple shards
     * @type {boolean}
     * @private
     */
    this.reconnecting = false;

    /**
     * The current session limit of the client
     * @private
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
   * Emits a shard debug message.
   * @param {string} message The debug message
   * @param {?WebSocketShard} [shard] The shard that emitted this message
   */
  debug(message, shard) {
    this.client.emit(Events.DEBUG, `[WS => ${shard ? `Shard ${shard.id}` : 'Manager'}] ${message}`);
  }

  /**
   * Connects this manager to the gateway.
   * @private
   */
  async connect() {
    const invalidToken = new Error(WSCodes[4004]);
    const {
      url: gatewayURL,
      shards: recommendedShards,
      session_start_limit: sessionStartLimit,
    } = await this.client.api.gateway.bot.get().catch(() => { throw invalidToken; });

    this.sessionStartLimit = sessionStartLimit;

    const { total, remaining, reset_after } = sessionStartLimit;

    this.debug(`Fetched Gateway Information
      URL: ${gatewayURL}
      Recommended Shards: ${recommendedShards}`);

    this.debug(`Session Limit Information
      Total: ${total}
      Remaining: ${remaining}`);

    this.gateway = `${gatewayURL}/`;

    if (this.totalShards === 'auto') {
      this.debug(`Using the recommended shard count provided by Discord: ${recommendedShards}`);
      this.totalShards = this.client.options.shardCount = this.client.options.totalShardCount = recommendedShards;
      if (typeof this.client.options.shards === 'undefined' || !this.client.options.shards.length) {
        this.client.options.shards = Array.from({ length: recommendedShards }, (_, i) => i);
      }
    }

    if (this.client.options.shards instanceof Array) {
      this.debug(`Spawning shards ${this.client.options.shards.join(', ')}`);
      this.shardQueue = this.client.options.shards.map(id => new WebSocketShard(this, id));
    } else {
      this.debug(`Spawning ${this.totalShards} shards`);
      this.shardQueue = Array.from({ length: recommendedShards }, (_, id) => new WebSocketShard(this, id));
    }

    await this._handleSessionLimit(remaining, reset_after);

    return this.createShards();
  }

  // Step 3: Call create, iterate through each, await connect on them
  // Step 3.1: If they error at start, throw an error based on the reason they closed

  /**
   * Handles the creation of a shard.
   * @private
   */
  async createShards() {
    // If we don't have any shards to handle, return
    if (!this.shardQueue.length) return false;

    const shard = this.shardQueue.shift();

    if (!shard.eventsAttached) {
      // Attach all events and their handlers
      shard.eventsAttached = true;
    }

    try {
      await shard.connect();
      this.shards.set(shard.id, shard);
    } catch (error) {
      if (!error) {
        this.debug(`Shard ${shard.id} received an invalid session, will requeue..`);
        this.shardQueue.push(shard);
      } else if (error.code && UNRECOVERABLE_CLOSE_CODES.includes(error.code)) {
        throw new Error(WSCodes[error.code]);
      }
      /**
       * VLAD: If we get an invalid session, emit the close event which will reject the promise.
       * if we don't have an error, it means we just have to identify when the shard comes.
       * Thereby, just push to the end of the queue, and continue handling with the 5 second delay between shards. Adapt
       * shard#connect to check if a ws is present. if it is, just send identify, with the promise of course. Otherwise,
       * well fuck.
       */
      console.log(error);
    }
    // If we have more shards, add a 5s delay
    if (this.shardQueue.length) await Util.delayFor(5000);
    return this.createShards();
  }

  /**
   * Handles reconnects for this manager.
   * @private
   */
  async reconnect() {
    if (this.reconnecting) return;
    this.reconnecting = true;
    try {
      await this._handleSessionLimit();
      await this.createShards();
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
   * Broadcasts a packet to every shard this manager handles.
   * @param {Object} packet The packet to send
   * @private
   */
  broadcast(packet) {
    for (const shard of this.shards.values()) shard.send(packet);
  }

  /**
   * Destroys this manager and all its shards.
   * @private
   */
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.shardQueue.length = 0;
    for (const shard of this.shards.values()) shard.destroy();
  }

  /**
   * Handles the timeout required if we cannot identify anymore.
   * @param {number} [remaining] The amount of remaining identify sessions that can be done today
   * @param {number} [resetAfter] The amount of time in which the identify counter resets
   * @private
   */
  async _handleSessionLimit(remaining, resetAfter) {
    if (typeof remaining === 'undefined' && typeof resetAfter === 'undefined') {
      const { session_start_limit } = await this.client.api.gateway.bot.get();
      this.sessionStartLimit = session_start_limit;
      remaining = session_start_limit.remaining;
      resetAfter = session_start_limit.reset_after;
    }
    if (!remaining) {
      this.debug(`Exceeded identify threshold. Will attempt a connection in ${resetAfter}ms`);
      await Util.delayFor(resetAfter);
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
    if (this.shards.size !== this.totalShards || this.shards.some(s => s.status !== Status.READY)) {
      return false;
    }

    let unavailableGuilds = 0;
    for (const guild of this.client.guilds.values()) {
      if (!guild.available) unavailableGuilds++;
    }

    // TODO: Rethink implementation for this
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
    } else {
      this.debug(`There are currently ${unavailableGuilds} guilds. Waiting for their respective GUILD_CREATE packets`);
    }

    return true;
  }
}

module.exports = WebSocketManager;
