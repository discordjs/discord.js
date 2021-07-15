'use strict';

const CachedManager = require('./CachedManager');
const VoiceState = require('../structures/VoiceState');

/**
 * Manages API methods for VoiceStates and stores their cache.
 * @extends {CachedManager}
 */
class VoiceStateManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, VoiceState, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, VoiceState>}
   * @name VoiceStateManager#cache
   */

  _add(data, cache = true) {
    const existing = this.cache.get(data.user_id);
    if (existing) return existing._patch(data);

    const entry = new this.holds(this.guild, data);
    if (cache) this.cache.set(data.user_id, entry);
    return entry;
  }
}

module.exports = VoiceStateManager;
