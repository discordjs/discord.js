'use strict';

const { Routes } = require('discord-api-types/v10');
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

  /**
   * Obtains a user's voice state from discord or from the cache if it's already available.
   * @param {GuildMemberResolvable|'@me'} member The member whose voice state is to be fetched
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<VoiceState>}
   * @example
   * // Fetch a member's voice state
   * guild.voiceStates.fetch("66564597481480192")
   *    .then(console.log)
   *    .catch(console.error);
   */
  async fetch(member, { cache = true, force = false } = {}) {
    const id = member === '@me' ? member : this.guild.members.resolveId(member);
    if (!force) {
      const existing = this.cache.get(id === '@me' ? this.client.user.id : id);
      if (existing) return existing;
    }
    const data = await this.client.rest.get(Routes.guildVoiceState(this.guild.id, id));
    return this._add(data, cache);
  }
}

module.exports = VoiceStateManager;
