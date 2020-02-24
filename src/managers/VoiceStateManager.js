'use strict';

const BaseManager = require('./BaseManager');
const VoiceState = require('../structures/VoiceState');

/**
 * Manages API methods for VoiceStates and stores their cache.
 * @extends {BaseManager}
 */
class VoiceStateManager extends BaseManager {
  constructor(guild, iterable) {
    super(guild.client, iterable, VoiceState);
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

  add(data, cache = true) {
    const existing = this.cache.get(data.user_id);
    if (existing) return existing._patch(data);

    const entry = new VoiceState(this.guild, data);
    if (cache) this.cache.set(data.user_id, entry);
    return entry;
  }
}

module.exports = VoiceStateManager;
