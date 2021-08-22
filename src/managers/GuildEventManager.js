'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const GuildEvent = require('../structures/GuildEvent');

class GuildEventManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, GuildEvent, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, GuildEvent>}
   * @name GuildEventManager#cache
   */

  /**
   * Data that resolves to give a GuildEvent object. This can be:
   * * A GuildEvent object
   * * A Snowflake
   * @typedef {GuildEvent|Snowflake} GuildEventResolvable
   */

  /**
   * Options used to fetch a single guild event from a guild.
   * @typedef {BaseFetchOptions} FetchGuildEventOptions
   * @property {GuildEventResolvable} guildEvent The guild event to fetch
   */

  /**
   * Options used to fetch multiple guild events from a guild.
   * @typedef {Object} FetchGuildEventsOptions
   * @property {boolean} [withUserCounts=true] Whether the number of users subscribed to the guild event
   * should be returned
   */

  /**
   * Obtains one or multiple guild events from Discord, or the guild cache if it's aready available.
   * @param {GuildEventResolvable|FetchGuildEventOptions|FetchGuildEventsOptions} [options] The id of the guild event or
   * options
   * @returns {Promise<GuildEvent|Collection<Snowflake, GuildEvent>>}
   */
  async fetch(options = {}) {
    const id = this.resolveId(options) ?? this.resolveId(options.guildEvent);

    if (id) {
      if (!options.force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }

      const data = await this.client.api('guild-events', id).get();
      return this._add(data, options.cache);
    }

    const data = await this.client.api
      .guilds(this.guild.id)
      .events.get({ query: { with_user_counts: options.withUserCounts ?? true } });
    return data.reduce(
      (coll, guildEvent) => coll.set(guildEvent.id, new GuildEvent(this.client, guildEvent)),
      new Collection(),
    );
  }
}

module.exports = GuildEventManager;
