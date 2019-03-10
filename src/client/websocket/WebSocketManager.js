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

}

module.exports = WebSocketManager;
