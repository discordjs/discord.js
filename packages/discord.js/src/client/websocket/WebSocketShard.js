'use strict';

const EventEmitter = require('node:events');
const process = require('node:process');
const { setTimeout, clearTimeout } = require('node:timers');
const { GatewayIntentBits } = require('discord-api-types/v10');
const Status = require('../../util/Status');
const WebSocketShardEvents = require('../../util/WebSocketShardEvents');

let deprecationEmittedForImportant = false;
/**
 * Represents a Shard's WebSocket connection
 * @extends {EventEmitter}
 */
class WebSocketShard extends EventEmitter {
  constructor(manager, id) {
    super();

    /**
     * The WebSocketManager of the shard
     * @type {WebSocketManager}
     */
    this.manager = manager;

    /**
     * The shard's id
     * @type {number}
     */
    this.id = id;

    /**
     * The current status of the shard
     * @type {Status}
     */
    this.status = Status.Idle;

    /**
     * The sequence of the shard after close
     * @type {number}
     * @private
     */
    this.closeSequence = 0;

    /**
     * The previous heartbeat ping of the shard
     * @type {number}
     */
    this.ping = -1;

    /**
     * The last time a ping was sent (a timestamp)
     * @type {number}
     */
    this.lastPingTimestamp = -1;

    /**
     * A set of guild ids this shard expects to receive
     * @name WebSocketShard#expectedGuilds
     * @type {?Set<string>}
     * @private
     */
    Object.defineProperty(this, 'expectedGuilds', { value: null, writable: true });

    /**
     * The ready timeout
     * @name WebSocketShard#readyTimeout
     * @type {?NodeJS.Timeout}
     * @private
     */
    Object.defineProperty(this, 'readyTimeout', { value: null, writable: true });

    /**
     * @external SessionInfo
     * @see {@link https://discord.js.org/docs/packages/ws/stable/SessionInfo:Interface}
     */

    /**
     * The session info used by `@discordjs/ws` package.
     * @name WebSocketShard#sessionInfo
     * @type {?SessionInfo}
     * @private
     */
    Object.defineProperty(this, 'sessionInfo', { value: null, writable: true });
  }

  /**
   * Emits a debug event.
   * @param {string[]} messages The debug message
   * @private
   */
  debug(messages) {
    this.manager.debug(messages, this.id);
  }

  /**
   * @external CloseEvent
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent}
   */

  /**
   * This method is responsible to emit close event for this shard.
   * This method helps the shard reconnect.
   * @param {CloseEvent} [event] Close event that was received
   * @deprecated
   */
  emitClose(
    event = {
      code: 1011,
      reason: 'INTERNAL_ERROR',
      wasClean: false,
    },
  ) {
    this.debug([
      '[CLOSE]',
      `Event Code: ${event.code}`,
      `Clean     : ${event.wasClean}`,
      `Reason    : ${event.reason ?? 'No reason received'}`,
    ]);

    /**
     * Emitted when a shard's WebSocket closes.
     * @private
     * @event WebSocketShard#close
     * @param {CloseEvent} event The received event
     */
    this.emit(WebSocketShardEvents.Close, event);
  }

  /**
   * Called when the shard receives the READY payload.
   * @param {Object} packet The received packet
   * @private
   */
  onReadyPacket(packet) {
    if (!packet) {
      this.debug([`Received broken packet: '${packet}'.`]);
      return;
    }

    /**
     * Emitted when the shard receives the READY payload and is now waiting for guilds
     * @event WebSocketShard#ready
     */
    this.emit(WebSocketShardEvents.Ready);

    this.expectedGuilds = new Set(packet.guilds.map(guild => guild.id));
    this.status = Status.WaitingForGuilds;
  }

  /**
   * Called when a GuildCreate or GuildDelete for this shard was sent after READY payload was received,
   * but before we emitted the READY event.
   * @param {Snowflake} guildId the id of the Guild sent in the payload
   * @private
   */
  gotGuild(guildId) {
    this.expectedGuilds.delete(guildId);
    this.checkReady();
  }

  /**
   * Checks if the shard can be marked as ready
   * @private
   */
  checkReady() {
    // Step 0. Clear the ready timeout, if it exists
    if (this.readyTimeout) {
      clearTimeout(this.readyTimeout);
      this.readyTimeout = null;
    }
    // Step 1. If we don't have any other guilds pending, we are ready
    if (!this.expectedGuilds.size) {
      this.debug(['Shard received all its guilds. Marking as fully ready.']);
      this.status = Status.Ready;

      /**
       * Emitted when the shard is fully ready.
       * This event is emitted if:
       * * all guilds were received by this shard
       * * the ready timeout expired, and some guilds are unavailable
       * @event WebSocketShard#allReady
       * @param {?Set<string>} unavailableGuilds Set of unavailable guilds, if any
       */
      this.emit(WebSocketShardEvents.AllReady);
      return;
    }
    const hasGuildsIntent = this.manager.client.options.intents.has(GatewayIntentBits.Guilds);
    // Step 2. Create a timeout that will mark the shard as ready if there are still unavailable guilds
    // * The timeout is 15 seconds by default
    // * This can be optionally changed in the client options via the `waitGuildTimeout` option
    // * a timeout time of zero will skip this timeout, which potentially could cause the Client to miss guilds.

    const { waitGuildTimeout } = this.manager.client.options;

    this.readyTimeout = setTimeout(
      () => {
        this.debug([
          hasGuildsIntent
            ? `Shard did not receive any guild packets in ${waitGuildTimeout} ms.`
            : 'Shard will not receive anymore guild packets.',
          `Unavailable guild count: ${this.expectedGuilds.size}`,
        ]);

        this.readyTimeout = null;
        this.status = Status.Ready;

        this.emit(WebSocketShardEvents.AllReady, this.expectedGuilds);
      },
      hasGuildsIntent ? waitGuildTimeout : 0,
    ).unref();
  }

  /**
   * Adds a packet to the queue to be sent to the gateway.
   * <warn>If you use this method, make sure you understand that you need to provide
   * a full [Payload](https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-commands).
   * Do not use this method if you don't know what you're doing.</warn>
   * @param {Object} data The full packet to send
   * @param {boolean} [important=false] If this packet should be added first in queue
   * <warn>This parameter is **deprecated**. Important payloads are determined by their opcode instead.</warn>
   */
  send(data, important = false) {
    if (important && !deprecationEmittedForImportant) {
      process.emitWarning(
        'Sending important payloads explicitly is deprecated. They are determined by their opcode implicitly now.',
        'DeprecationWarning',
      );
      deprecationEmittedForImportant = true;
    }
    this.manager._ws.send(this.id, data);
  }
}

module.exports = WebSocketShard;
