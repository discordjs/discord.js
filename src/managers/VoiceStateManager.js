'use strict';

const BaseManager = require('./BaseManager');

/**
 * Manages API methods for VoiceStates and stores their cache.
 * @extends {BaseManager}
 */
class VoiceStateManager extends BaseManager {
  constructor(server, iterable) {
    super(server.client, iterable, { name: 'VoiceState' });
    /**
     * The server this manager belongs to
     * @type {Server}
     */
    this.server = server;
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, VoiceState>}
   * @name VoiceStateManager#cache
   */

  add(data, cache = true) {
    const existing = this.cache.get(data.user_id);
    if (existing) return existing._patch(data);

    const entry = new this.holds(this.server, data);
    if (cache) this.cache.set(data.user_id, entry);
    return entry;
  }
}

module.exports = VoiceStateManager;
