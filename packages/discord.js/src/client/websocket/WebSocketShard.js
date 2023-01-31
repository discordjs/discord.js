'use strict';

const EventEmitter = require('node:events');
const process = require('node:process');
const { setTimeout, clearTimeout } = require('node:timers');
const { WebSocketShardStatus } = require('@discordjs/ws');
const { GatewayIntentBits } = require('discord-api-types/v10');
const Status = require('../../util/Status');
const WebSocketShardEvents = require('../../util/WebSocketShardEvents');

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
  }

  /**
   * Syncronizes the status property with the `@discordjs/ws` implementation.
   */
  async setStatus() {
    if (this.readyTimeout) {
      this.status = Status.WaitingForGuilds;
    } else {
      const status = (await this.manager._ws.fetchStatus()).get(this.id);
      this.status = Status[WebSocketShardStatus[status]];
    }
  }

  /**
   * Emits a debug event.
   * @param {string} message The debug message
   * @private
   */
  debug(message) {
    this.manager.debug(message, this.id);
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
    this.debug(`[CLOSE]
    Event Code: ${event.code}
    Clean     : ${event.wasClean}
    Reason    : ${event.reason ?? 'No reason received'}`);
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
      this.debug(`Received broken packet: '${packet}'.`);
      return;
    }

    /**
     * Emitted when the shard receives the READY payload and is now waiting for guilds
     * @event WebSocketShard#ready
     */
    this.emit(WebSocketShardEvents.Ready);

    this.expectedGuilds = new Set(packet.guilds.map(d => d.id));
  }

  /**
   * Called when a GuildCreate for this shard was sent after READY payload was received,
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
  async checkReady() {
    // Step 0. Clear the ready timeout, if it exists
    if (this.readyTimeout) {
      clearTimeout(this.readyTimeout);
      this.readyTimeout = null;
    }
    // Step 1. If we don't have any other guilds pending, we are ready
    if (!this.expectedGuilds.size) {
      this.debug('Shard received all its guilds. Marking as fully ready.');
      await this.setStatus();

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
      async () => {
        this.debug(
          `Shard ${hasGuildsIntent ? 'did' : 'will'} not receive any more guild packets` +
            `${hasGuildsIntent ? ` in ${waitGuildTimeout} ms` : ''}.\nUnavailable guild count: ${
              this.expectedGuilds.size
            }`,
        );

        this.readyTimeout = null;
        await this.setStatus();

        this.emit(WebSocketShardEvents.AllReady, this.expectedGuilds);
      },
      hasGuildsIntent ? waitGuildTimeout : 0,
    ).unref();
    await this.setStatus();
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
    if (important) {
      process.emitWarning(
        'Sending important payloads explicitly is deprecated. They are determined by their opcode implicitly now.',
        'DeprecationWarning',
      );
    }
    this.manager._ws.send(this.id, data);
  }
}

module.exports = WebSocketShard;
