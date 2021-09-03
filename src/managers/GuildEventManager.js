'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const { TypeError, Error } = require('../errors');
const GuildEvent = require('../structures/GuildEvent');
const { PrivacyLevels, GuildEventEntityTypes } = require('../util/Constants');

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
   * Options used to create a guild event.
   * @typedef {Object} GuildEventCreateOptions
   * @property {string} name The name of the event
   * @property {Date} scheduledStartTime The time to schedule the event at
   * @property {PrivacyLevel|number} privacyLevel The privacy level of the event
   * @property {GuildEventEntityType|number} entityType The scheduled entity type of the event
   * @property {string} [description] The description of the event
   * @property {GuildChannelResolvable} [channel] The channel of the event
   */

  /**
   * Creates a new guild event.
   * @param {GuildEventCreateOptions} options Options for creating the guild event
   * @returns {Promise<GuildEvent>}
   */
  async create(options) {
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    let { privacyLevel, entityType, channel } = options;

    if (typeof privacyLevel === 'string') privacyLevel = PrivacyLevels[privacyLevel];
    if (typeof entityType === 'string') entityType = GuildEventEntityTypes[entityType];
    const channelId = this.guild.channels.resolveId(channel);

    const data = await this.client.api.guilds(this.guild.id).events.post({
      data: {
        channel_id: channelId,
        name: options.name,
        privacy_level: privacyLevel,
        scheduled_start_time: options.scheduledStartTime,
        description: options.description,
        entity_type: entityType,
      },
    });

    return this._add(data);
  }

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
    const id = this.resolveId(options.guildEvent ?? options);

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

  /**
   * Options used to edit a guild event.
   * @typedef {Object} GuildEventEditOptions
   * @property {string} [name] The name of the event
   * @property {Date} [scheduledStartTime] The time to schedule the event at
   * @property {PrivacyLevel|number} [privacyLevel] The privacy level of the event
   * @property {GuildEventEntityType|number} [entityType] The scheduled entity type of the event
   * @property {string} [description] The description of the event
   * @property {GuildChannelResolvable} [channel] The channel of the event
   */

  /**
   * Edits a guild event.
   * @param {GuildEventResolvable} guildEvent The guild event to edit
   * @param {GuildEventEditOptions} options Options to edit the guild event
   * @returns {Promise<GuildEvent>}
   */
  async edit(guildEvent, options) {
    const guildEventId = this.resolveId(guildEvent);
    if (!guildEventId) throw new Error('GUILD_EVENT_RESOLVE');

    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    let { privacyLevel, entityType, channel } = options;

    if (typeof privacyLevel === 'string') privacyLevel = PrivacyLevels[privacyLevel];
    if (typeof entityType === 'string') entityType = GuildEventEntityTypes[entityType];
    const channelId = this.guild.channels.resolveId(channel);

    const data = await this.client.api('guild-events', guildEventId).patch({
      data: {
        channel_id: channelId,
        name: options.name,
        privacy_level: privacyLevel,
        scheduled_start_time: options.scheduledStartTime,
        description: options.description,
        entity_type: entityType,
      },
    });

    return this._add(data);
  }

  /**
   * Deletes a guild event.
   * @param {GuildEventResolvable} guildEvent The guild event to delete
   * @returns {Promise<void>}
   */
  async delete(guildEvent) {
    const guildEventId = this.resolveId(guildEvent);
    if (!guildEventId) throw new Error('GUILD_EVENT_RESOLVE');

    await this.client.api('guild-events', guildEventId).delete();
  }
}

module.exports = GuildEventManager;
