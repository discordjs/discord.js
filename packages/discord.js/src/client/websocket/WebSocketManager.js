'use strict';

const EventEmitter = require('node:events');
const process = require('node:process');
const { setImmediate } = require('node:timers');
const { Collection } = require('@discordjs/collection');
const {
  WebSocketManager: WSWebSocketManager,
  WebSocketShardEvents: WSWebSocketShardEvents,
  CompressionMethod,
  CloseCodes,
} = require('@discordjs/ws');
const { GatewayCloseCodes, GatewayDispatchEvents } = require('discord-api-types/v10');
const WebSocketShard = require('./WebSocketShard');
const PacketHandlers = require('./handlers');
const { DiscordjsError, ErrorCodes } = require('../../errors');
const Events = require('../../util/Events');
const Status = require('../../util/Status');
const WebSocketShardEvents = require('../../util/WebSocketShardEvents');

let zlib;

try {
  zlib = require('zlib-sync');
} catch {} // eslint-disable-line no-empty

const BeforeReadyWhitelist = [
  GatewayDispatchEvents.Ready,
  GatewayDispatchEvents.Resumed,
  GatewayDispatchEvents.GuildCreate,
  GatewayDispatchEvents.GuildDelete,
  GatewayDispatchEvents.GuildMembersChunk,
  GatewayDispatchEvents.GuildMemberAdd,
  GatewayDispatchEvents.GuildMemberRemove,
];

const WaitingForGuildEvents = [GatewayDispatchEvents.GuildCreate, GatewayDispatchEvents.GuildDelete];

const UNRESUMABLE_CLOSE_CODES = [
  CloseCodes.Normal,
  GatewayCloseCodes.AlreadyAuthenticated,
  GatewayCloseCodes.InvalidSeq,
];

const reasonIsDeprecated = 'the reason property is deprecated, use the code property to determine the reason';
let deprecationEmittedForInvalidSessionEvent = false;
let deprecationEmittedForDestroyedEvent = false;

/**
 * The WebSocket manager for this client.
 * <info>This class forwards raw dispatch events,
 * read more about it here {@link https://discord.com/developers/docs/topics/gateway}</info>
 * @extends {EventEmitter}
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
     * A collection of all shards this manager handles
     * @type {Collection<number, WebSocketShard>}
     */
    this.shards = new Collection();

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
     * The internal WebSocketManager from `@discordjs/ws`.
     * @type {WSWebSocketManager}
     * @private
     */
    this._ws = null;
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
   * @param {?number} [shardId] The id of the shard that emitted this message, if any
   * @private
   */
  debug(message, shardId) {
    this.client.emit(
      Events.Debug,
      `[WS => ${typeof shardId === 'number' ? `Shard ${shardId}` : 'Manager'}] ${message}`,
    );
  }

  /**
   * Connects this manager to the gateway.
   * @private
   */
  async connect() {
    const invalidToken = new DiscordjsError(ErrorCodes.TokenInvalid);
    const { shards, shardCount, intents, ws } = this.client.options;
    if (this._ws && this._ws.options.token !== this.client.token) {
      await this._ws.destroy({ code: CloseCodes.Normal, reason: 'Login with differing token requested' });
      this._ws = null;
    }
    if (!this._ws) {
      const wsOptions = {
        intents: intents.bitfield,
        rest: this.client.rest,
        token: this.client.token,
        largeThreshold: ws.large_threshold,
        version: ws.version,
        shardIds: shards === 'auto' ? null : shards,
        shardCount: shards === 'auto' ? null : shardCount,
        initialPresence: ws.presence,
        retrieveSessionInfo: shardId => this.shards.get(shardId).sessionInfo,
        updateSessionInfo: (shardId, sessionInfo) => {
          this.shards.get(shardId).sessionInfo = sessionInfo;
        },
        compression: zlib ? CompressionMethod.ZlibStream : null,
      };
      if (ws.buildStrategy) wsOptions.buildStrategy = ws.buildStrategy;
      this._ws = new WSWebSocketManager(wsOptions);
      this.attachEvents();
    }

    const {
      url: gatewayURL,
      shards: recommendedShards,
      session_start_limit: sessionStartLimit,
    } = await this._ws.fetchGatewayInformation().catch(error => {
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

    this.client.options.shardCount = await this._ws.getShardCount();
    this.client.options.shards = await this._ws.getShardIds();
    this.totalShards = this.client.options.shards.length;
    for (const id of this.client.options.shards) {
      if (!this.shards.has(id)) {
        const shard = new WebSocketShard(this, id);
        this.shards.set(id, shard);

        shard.on(WebSocketShardEvents.AllReady, unavailableGuilds => {
          /**
           * Emitted when a shard turns ready.
           * @event Client#shardReady
           * @param {number} id The shard id that turned ready
           * @param {?Set<Snowflake>} unavailableGuilds Set of unavailable guild ids, if any
           */
          this.client.emit(Events.ShardReady, shard.id, unavailableGuilds);

          this.checkShardsReady();
        });
        shard.status = Status.Connecting;
      }
    }

    await this._ws.connect();

    this.shards.forEach(shard => {
      if (shard.listenerCount(WebSocketShardEvents.InvalidSession) > 0 && !deprecationEmittedForInvalidSessionEvent) {
        process.emitWarning(
          'The WebSocketShard#invalidSession event is deprecated and will never emit.',
          'DeprecationWarning',
        );

        deprecationEmittedForInvalidSessionEvent = true;
      }
      if (shard.listenerCount(WebSocketShardEvents.Destroyed) > 0 && !deprecationEmittedForDestroyedEvent) {
        process.emitWarning(
          'The WebSocketShard#destroyed event is deprecated and will never emit.',
          'DeprecationWarning',
        );

        deprecationEmittedForDestroyedEvent = true;
      }
    });
  }

  /**
   * Attaches event handlers to the internal WebSocketShardManager from `@discordjs/ws`.
   * @private
   */
  attachEvents() {
    this._ws.on(WSWebSocketShardEvents.Debug, ({ message, shardId }) => this.debug(message, shardId));
    this._ws.on(WSWebSocketShardEvents.Dispatch, ({ data, shardId }) => {
      this.client.emit(Events.Raw, data, shardId);
      this.emit(data.t, data.d, shardId);
      const shard = this.shards.get(shardId);
      this.handlePacket(data, shard);
      if (shard.status === Status.WaitingForGuilds && WaitingForGuildEvents.includes(data.t)) {
        shard.gotGuild(data.d.id);
      }
    });

    this._ws.on(WSWebSocketShardEvents.Ready, ({ data, shardId }) => {
      this.shards.get(shardId).onReadyPacket(data);
    });

    this._ws.on(WSWebSocketShardEvents.Closed, ({ code, shardId }) => {
      const shard = this.shards.get(shardId);
      shard.emit(WebSocketShardEvents.Close, { code, reason: reasonIsDeprecated, wasClean: true });
      if (UNRESUMABLE_CLOSE_CODES.includes(code) && this.destroyed) {
        shard.status = Status.Disconnected;
        /**
         * Emitted when a shard's WebSocket disconnects and will no longer reconnect.
         * @event Client#shardDisconnect
         * @param {CloseEvent} event The WebSocket close event
         * @param {number} id The shard id that disconnected
         */
        this.client.emit(Events.ShardDisconnect, { code, reason: reasonIsDeprecated, wasClean: true }, shardId);
        this.debug(GatewayCloseCodes[code], shardId);
        return;
      }

      this.shards.get(shardId).status = Status.Connecting;
      /**
       * Emitted when a shard is attempting to reconnect or re-identify.
       * @event Client#shardReconnecting
       * @param {number} id The shard id that is attempting to reconnect
       */
      this.client.emit(Events.ShardReconnecting, shardId);
    });
    this._ws.on(WSWebSocketShardEvents.Hello, ({ shardId }) => {
      const shard = this.shards.get(shardId);
      if (shard.sessionInfo) {
        shard.closeSequence = shard.sessionInfo.sequence;
        shard.status = Status.Resuming;
      } else {
        shard.status = Status.Identifying;
      }
    });

    this._ws.on(WSWebSocketShardEvents.Resumed, ({ shardId }) => {
      const shard = this.shards.get(shardId);
      shard.status = Status.Ready;
      /**
       * Emitted when the shard resumes successfully
       * @event WebSocketShard#resumed
       */
      shard.emit(WebSocketShardEvents.Resumed);
    });

    this._ws.on(WSWebSocketShardEvents.HeartbeatComplete, ({ heartbeatAt, latency, shardId }) => {
      this.debug(`Heartbeat acknowledged, latency of ${latency}ms.`, shardId);
      const shard = this.shards.get(shardId);
      shard.lastPingTimestamp = heartbeatAt;
      shard.ping = latency;
    });

    this._ws.on(WSWebSocketShardEvents.Error, ({ error, shardId }) => {
      /**
       * Emitted whenever a shard's WebSocket encounters a connection error.
       * @event Client#shardError
       * @param {Error} error The encountered error
       * @param {number} shardId The shard that encountered this error
       */
      this.client.emit(Events.ShardError, error, shardId);
    });
  }

  /**
   * Broadcasts a packet to every shard this manager handles.
   * @param {Object} packet The packet to send
   * @private
   */
  broadcast(packet) {
    for (const shardId of this.shards.keys()) this._ws.send(shardId, packet);
  }

  /**
   * Destroys this manager and all its shards.
   * @private
   */
  destroy() {
    if (this.destroyed) return;
    // TODO: Make a util for getting a stack
    this.debug(`Manager was destroyed. Called by:\n${new Error().stack}`);
    this.destroyed = true;
    this._ws?.destroy({ code: CloseCodes.Normal });
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
