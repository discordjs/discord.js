'use strict';

const EventEmitter = require('events');
const { Error: DJSError } = require('../../errors');
const Collection = require('../../util/Collection');
const Util = require('../../util/Util');
const WebSocketShard = require('./WebSocketShard');
const { Events, ShardEvents, Status, WSCodes, WSEvents } = require('../../util/Constants');
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

const UNRECOVERABLE_CLOSE_CODES = [4004, 4010, 4011];

/**
 * The WebSocket manager for this client.
 * <info>This class forwards raw dispatch events,
 * read more about it here {@link https://discordapp.com/developers/docs/topics/gateway}</info>
 * @extends EventEmitter
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
    Object.defineProperty(this, 'client', { value: client });

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
     * @type {Set<WebSocketShard>}
     * @private
     * @name WebSocketManager#shardQueue
     */
    Object.defineProperty(this, 'shardQueue', { value: new Set(), writable: true });

    /**
     * An array of queued events before this WebSocketManager became ready
     * @type {object[]}
     * @private
     * @name WebSocketManager#packetQueue
     */
    Object.defineProperty(this, 'packetQueue', { value: [] });

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
    this.sessionStartLimit = undefined;
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
   * Emits a debug message.
   * @param {string} message The debug message
   * @param {?WebSocketShard} [shard] The shard that emitted this message, if any
   * @private
   */
  debug(message, shard) {
    this.client.emit(Events.DEBUG, `[WS => ${shard ? `Shard ${shard.id}` : 'Manager'}] ${message}`);
  }

  /**
   * Connects this manager to the gateway.
   * @private
   */
  async connect() {
    const invalidToken = new DJSError(WSCodes[4004]);
    const {
      url: gatewayURL,
      shards: recommendedShards,
      session_start_limit: sessionStartLimit,
    } = await this.client.api.gateway.bot.get().catch(error => {
      throw error.httpStatus === 401 ? invalidToken : error;
    });

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

    const { shards } = this.client.options;

    if (Array.isArray(shards)) {
      this.totalShards = shards.length;
      this.debug(`Spawning shards: ${shards.join(', ')}`);
      this.shardQueue = new Set(shards.map(id => new WebSocketShard(this, id)));
    } else {
      this.debug(`Spawning ${this.totalShards} shards`);
      this.shardQueue = new Set(Array.from({ length: this.totalShards }, (_, id) => new WebSocketShard(this, id)));
    }

    await this._handleSessionLimit(remaining, reset_after);

    return this.createShards();
  }

  /**
   * Handles the creation of a shard.
   * @returns {Promise<boolean>}
   * @private
   */
  async createShards() {
    // If we don't have any shards to handle, return
    if (!this.shardQueue.size) return false;

    const [shard] = this.shardQueue;

    this.shardQueue.delete(shard);

    if (!shard.eventsAttached) {
      shard.on(ShardEvents.READY, () => {
        /**
         * Emitted when a shard turns ready.
         * @event Client#shardReady
         * @param {number} id The shard ID that turned ready
         */
        this.client.emit(Events.SHARD_READY, shard.id);

        if (!this.shardQueue.size) this.reconnecting = false;
      });

      shard.on(ShardEvents.CLOSE, event => {
        if (event.code === 1000 ? this.destroyed : UNRECOVERABLE_CLOSE_CODES.includes(event.code)) {
          /**
           * Emitted when a shard's WebSocket disconnects and will no longer reconnect.
           * @event Client#shardDisconnected
           * @param {CloseEvent} event The WebSocket close event
           * @param {number} id The shard ID that disconnected
           */
          this.client.emit(Events.SHARD_DISCONNECTED, event, shard.id);
          this.debug(WSCodes[event.code], shard);
          return;
        }

        if (event.code === 1000 || event.code === 4006) {
          // Any event code in this range cannot be resumed.
          shard.sessionID = undefined;
        }

        /**
         * Emitted when a shard is attempting to reconnect or re-identify.
         * @event Client#shardReconnecting
         * @param {number} id The shard ID that is attempting to reconnect
         */
        this.client.emit(Events.SHARD_RECONNECTING, shard.id);

        if (shard.sessionID) {
          this.debug(`Session ID is present, attempting an immediate reconnect...`, shard);
          shard.connect().catch(() => null);
          return;
        }

        shard.destroy();

        this.shardQueue.add(shard);
        this.reconnect();
      });

      shard.on(ShardEvents.INVALID_SESSION, () => {
        this.client.emit(Events.SHARD_RECONNECTING, shard.id);

        this.shardQueue.add(shard);
        this.reconnect();
      });

      shard.on(ShardEvents.DESTROYED, () => {
        this.debug('Shard was destroyed but no WebSocket connection existed... Reconnecting...', shard);

        this.client.emit(Events.SHARD_RECONNECTING, shard.id);

        this.shardQueue.add(shard);
        this.reconnect();
      });

      shard.eventsAttached = true;
    }

    this.shards.set(shard.id, shard);

    try {
      await shard.connect();
    } catch (error) {
      if (error && error.code && UNRECOVERABLE_CLOSE_CODES.includes(error.code)) {
        throw new DJSError(WSCodes[error.code]);
        // Undefined if session is invalid, error event (or uws' event mimicking it) for regular closes
      } else if (!error || error.code) {
        this.debug('Failed to connect to the gateway, requeueing...', shard);
        this.shardQueue.add(shard);
      } else {
        throw error;
      }
    }
    // If we have more shards, add a 5s delay
    if (this.shardQueue.size) {
      this.debug(`Shard Queue Size: ${this.shardQueue.size}; continuing in 5 seconds...`);
      await Util.delayFor(5000);
      await this._handleSessionLimit();
      return this.createShards();
    }

    return true;
  }

  /**
   * Handles reconnects for this manager.
   * @private
   * @returns {Promise<boolean>}
   */
  async reconnect() {
    if (this.reconnecting || this.status !== Status.READY) return false;
    this.reconnecting = true;
    try {
      await this._handleSessionLimit();
      await this.createShards();
    } catch (error) {
      this.debug(`Couldn't reconnect or fetch information about the gateway. ${error}`);
      if (error.httpStatus !== 401) {
        this.debug(`Possible network error occured. Retrying in 5s...`);
        await Util.delayFor(5000);
        this.reconnecting = false;
        return this.reconnect();
      }
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
    } finally {
      this.reconnecting = false;
    }
    return true;
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
    this.debug(`Manager was destroyed. Called by:\n${new Error('MANAGER_DESTROYED').stack}`);
    this.destroyed = true;
    this.shardQueue.clear();
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
      this.debug(`Session Limit Information
        Total: ${session_start_limit.total}
        Remaining: ${remaining}`);
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

    const unavailableGuilds = this.client.guilds.reduce((acc, guild) => guild.available ? acc : acc + 1, 0);

    // TODO: Rethink implementation for this
    if (unavailableGuilds === 0) {
      this.status = Status.NEARLY;
      if (!this.client.options.fetchAllMembers) return this.triggerReady();
      // Fetch all members before marking self as ready
      const promises = this.client.guilds.map(g => g.members.fetch());
      Promise.all(promises)
        .then(() => this.triggerReady())
        .catch(e => {
          this.debug(`Failed to fetch all members before ready! ${e}\n${e.stack}`);
          this.triggerReady();
        });
    } else {
      this.debug(`There are ${unavailableGuilds} unavailable guilds. Waiting for their GUILD_CREATE packets`);
    }

    return true;
  }

  /**
   * Causes the client to be marked as ready and emits the ready event.
   * @private
   */
  triggerReady() {
    if (this.status === Status.READY) {
      this.debug('Tried to mark self as ready, but already ready');
      return;
    }

    this.status = Status.READY;

    this.client.readyAt = new Date();

    /**
     * Emitted when the client becomes ready to start working.
     * @event Client#ready
     */
    this.client.emit(Events.CLIENT_READY);

    this.handlePacket();
  }
}

module.exports = WebSocketManager;
