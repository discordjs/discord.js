'use strict';

const EventEmitter = require('node:events');
const { setImmediate } = require('node:timers');
const { setTimeout: sleep } = require('node:timers/promises');
const { Collection } = require('@discordjs/collection');
const { GatewayCloseCodes, GatewayDispatchEvents, Routes } = require('discord-api-types/v10');
const WebSocketShard = require('./WebSocketShard');
const PacketHandlers = require('./handlers');
const { Error } = require('../../errors');
const Events = require('../../util/Events');
const ShardEvents = require('../../util/ShardEvents');
const Status = require('../../util/Status');

const BeforeReadyWhitelist = [
  GatewayDispatchEvents.Ready,
  GatewayDispatchEvents.Resumed,
  GatewayDispatchEvents.GuildCreate,
  GatewayDispatchEvents.GuildDelete,
  GatewayDispatchEvents.GuildMembersChunk,
  GatewayDispatchEvents.GuildMemberAdd,
  GatewayDispatchEvents.GuildMemberRemove,
];

const UNRECOVERABLE_CLOSE_CODES = [
  GatewayCloseCodes.AuthenticationFailed,
  GatewayCloseCodes.InvalidShard,
  GatewayCloseCodes.ShardingRequired,
  GatewayCloseCodes.InvalidIntents,
  GatewayCloseCodes.DisallowedIntents,
];
const UNRESUMABLE_CLOSE_CODES = [1000, GatewayCloseCodes.AlreadyAuthenticated, GatewayCloseCodes.InvalidSeq];

/**
 * The WebSocket manager for this client.
 * <info>This class forwards raw dispatch events,
 * read more about it here {@link https://discord.com/developers/docs/topics/gateway}</info>
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
    this.gateway = null;

    /**
     * The amount of shards this manager handles
     * @private
     * @type {number}
     */
    this.totalShards = this.client.options.shards.length;

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
     * @type {Object[]}
     * @private
     * @name WebSocketManager#packetQueue
     */
    Object.defineProperty(this, 'packetQueue', { value: [] });

    /**
     * The current status of this WebSocketManager
     * @type {Status}
     */
    this.status = Status.Idle;

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
    this.client.emit(Events.Debug, `[WS => ${shard ? `Shard ${shard.id}` : 'Manager'}] ${message}`);
  }

  /**
   * Connects this manager to the gateway.
   * @private
   */
  async connect() {
    const invalidToken = new Error(GatewayCloseCodes[GatewayCloseCodes.AuthenticationFailed]);
    const {
      url: gatewayURL,
      shards: recommendedShards,
      session_start_limit: sessionStartLimit,
    } = await this.client.rest.get(Routes.gatewayBot()).catch(error => {
      throw error.status === 401 ? invalidToken : error;
    });

    const { total, remaining } = sessionStartLimit;

    this.debug(`Fetched Gateway Information
    URL: ${gatewayURL}
    Recommended Shards: ${recommendedShards}`);

    this.debug(`Session Limit Information
    Total: ${total}
    Remaining: ${remaining}`);

    this.gateway = `${gatewayURL}/`;

    let { shards } = this.client.options;

    if (shards === 'auto') {
      this.debug(`Using the recommended shard count provided by Discord: ${recommendedShards}`);
      this.totalShards = this.client.options.shardCount = recommendedShards;
      shards = this.client.options.shards = Array.from({ length: recommendedShards }, (_, i) => i);
    }

    this.totalShards = shards.length;
    this.debug(`Spawning shards: ${shards.join(', ')}`);
    this.shardQueue = new Set(shards.map(id => new WebSocketShard(this, id)));

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
      shard.on(ShardEvents.AllReady, unavailableGuilds => {
        /**
         * Emitted when a shard turns ready.
         * @event Client#shardReady
         * @param {number} id The shard id that turned ready
         * @param {?Set<Snowflake>} unavailableGuilds Set of unavailable guild ids, if any
         */
        this.client.emit(Events.ShardReady, shard.id, unavailableGuilds);

        if (!this.shardQueue.size) this.reconnecting = false;
        this.checkShardsReady();
      });

      shard.on(ShardEvents.Close, event => {
        if (event.code === 1_000 ? this.destroyed : UNRECOVERABLE_CLOSE_CODES.includes(event.code)) {
          /**
           * Emitted when a shard's WebSocket disconnects and will no longer reconnect.
           * @event Client#shardDisconnect
           * @param {CloseEvent} event The WebSocket close event
           * @param {number} id The shard id that disconnected
           */
          this.client.emit(Events.ShardDisconnect, event, shard.id);
          this.debug(GatewayCloseCodes[event.code], shard);
          return;
        }

        if (UNRESUMABLE_CLOSE_CODES.includes(event.code)) {
          // These event codes cannot be resumed
          shard.sessionId = null;
        }

        /**
         * Emitted when a shard is attempting to reconnect or re-identify.
         * @event Client#shardReconnecting
         * @param {number} id The shard id that is attempting to reconnect
         */
        this.client.emit(Events.ShardReconnecting, shard.id);

        this.shardQueue.add(shard);

        if (shard.sessionId) this.debug(`Session id is present, attempting an immediate reconnect...`, shard);
        this.reconnect();
      });

      shard.on(ShardEvents.InvalidSession, () => {
        this.client.emit(Events.ShardReconnecting, shard.id);
      });

      shard.on(ShardEvents.Destroyed, () => {
        this.debug('Shard was destroyed but no WebSocket connection was present! Reconnecting...', shard);

        this.client.emit(Events.ShardReconnecting, shard.id);

        this.shardQueue.add(shard);
        this.reconnect();
      });

      shard.eventsAttached = true;
    }

    this.shards.set(shard.id, shard);

    try {
      await shard.connect();
    } catch (error) {
      if (error?.code && UNRECOVERABLE_CLOSE_CODES.includes(error.code)) {
        throw new Error(GatewayCloseCodes[error.code]);
        // Undefined if session is invalid, error event for regular closes
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
      await sleep(5_000);
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
    if (this.reconnecting || this.status !== Status.Ready) return false;
    this.reconnecting = true;
    try {
      await this.createShards();
    } catch (error) {
      this.debug(`Couldn't reconnect or fetch information about the gateway. ${error}`);
      if (error.httpStatus !== 401) {
        this.debug(`Possible network error occurred. Retrying in 5s...`);
        await sleep(5_000);
        this.reconnecting = false;
        return this.reconnect();
      }
      // If we get an error at this point, it means we cannot reconnect anymore
      if (this.client.listenerCount(Events.Invalidated)) {
        /**
         * Emitted when the client's session becomes invalidated.
         * You are expected to handle closing the process gracefully and preventing a boot loop
         * if you are listening to this event.
         * @event Client#invalidated
         */
        this.client.emit(Events.Invalidated);
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
    for (const shard of this.shards.values()) shard.destroy({ closeCode: 1_000, reset: true, emit: false, log: false });
  }

  /**
   * Processes a packet and queues it if this WebSocketManager is not ready.
   * @param {Object} [packet] The packet to be handled
   * @param {WebSocketShard} [shard] The shard that will handle this packet
   * @returns {boolean}
   * @private
   */
  handlePacket(packet, shard) {
    if (packet && this.status !== Status.Ready) {
      if (!BeforeReadyWhitelist.includes(packet.t)) {
        this.packetQueue.push({ packet, shard });
        return false;
      }
    }

    if (this.packetQueue.length) {
      const item = this.packetQueue.shift();
      setImmediate(() => {
        this.handlePacket(item.packet, item.shard);
      }).unref();
    }

    if (packet && PacketHandlers[packet.t]) {
      PacketHandlers[packet.t](this.client, packet, shard);
    }

    return true;
  }

  /**
   * Checks whether the client is ready to be marked as ready.
   * @private
   */
  checkShardsReady() {
    if (this.status === Status.Ready) return;
    if (this.shards.size !== this.totalShards || this.shards.some(s => s.status !== Status.Ready)) {
      return;
    }

    this.triggerClientReady();
  }

  /**
   * Causes the client to be marked as ready and emits the ready event.
   * @private
   */
  triggerClientReady() {
    this.status = Status.Ready;

    this.client.readyTimestamp = Date.now();

    /**
     * Emitted when the client becomes ready to start working.
     * @event Client#ready
     * @param {Client} client The client
     */
    this.client.emit(Events.ClientReady, this.client);

    this.handlePacket();
  }
}

module.exports = WebSocketManager;
