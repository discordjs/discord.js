'use strict';

const { Collection } = require('@discordjs/collection');
const CachedManager = require('./CachedManager');
const { TypeError, Error } = require('../errors');
const GuildScheduledEvent = require('../structures/GuildScheduledEvent');
const { PrivacyLevels, GuildScheduledEventEntityTypes, GuildScheduledEventStatuses } = require('../util/Constants');

class GuildScheduledEventManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, GuildScheduledEvent, iterable);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The cache of this manager
   * @type {Collection<Snowflake, GuildScheduledEvent>}
   * @name GuildScheduledEventManager#cache
   */

  /**
   * Data that resolves to give a GuildScheduledEvent object. This can be:
   * * A Snowflake
   * * A GuildScheduledEvent object
   * @typedef {Snowflake|GuildScheduledEvent} GuildScheduledEventResolvable
   */

  /**
   * Options used to create a guild scheduled event.
   * @typedef {Object} GuildScheduledEventCreateOptions
   * @property {string} name The name of the guild scheduled event
   * @property {Date} scheduledStartTime The time to schedule the event at
   * @property {PrivacyLevel|number} privacyLevel The privacy level of the guild scheduled event
   * @property {GuildScheduledEventEntityType|number} entityType The scheduled entity type of the event
   * @property {string} [description] The description of the guild scheduled event
   * @property {GuildChannelResolvable} [channel] The channel of the guild scheduled event
   * @property {UserResolvable[]} [speakers] The speakers of the guild scheduled event
   * @property {string} [location] The location of the guild scheduled event
   */

  /**
   * Creates a new guild scheduled event.
   * @param {GuildScheduledEventCreateOptions} options Options for creating the guild scheduled event
   * @returns {Promise<GuildScheduledEvent>}
   */
  async create(options) {
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    let { privacyLevel, entityType, channel, speakers, location, name, scheduledStartTime, description } = options;

    if (typeof privacyLevel === 'string') privacyLevel = PrivacyLevels[privacyLevel];
    if (typeof entityType === 'string') entityType = GuildScheduledEventEntityTypes[entityType];
    const channelId = this.guild.channels.resolveId(channel);

    speakers = speakers?.map(user => this.client.users.resolveId(user));

    const data = await this.client.api.guilds(this.guild.id, 'scheduled-events').post({
      data: {
        channel_id: channelId,
        name,
        privacy_level: privacyLevel,
        scheduled_start_time: new Date(scheduledStartTime).toISOString(),
        description,
        entity_type: entityType,
        entity_metadata: {
          speakers,
          location,
        },
      },
    });

    return this._add(data);
  }

  /**
   * Options used to fetch a single guild scheduled event from a guild.
   * @typedef {BaseFetchOptions} FetchGuildScheduledEventOptions
   * @property {GuildScheduledEventResolvable} guildScheduledEvent The guild scheduled event to fetch
   */

  /**
   * Options used to fetch multiple guild scheduled events from a guild.
   * @typedef {Object} FetchGuildScheduledEventsOptions
   * @property {boolean} [cache] Whether or not to cache the fetched guild scheduled events
   * @property {boolean} [withUserCounts=true] Whether the number of users subscribed to the guild scheduled event
   * should be returned
   */

  /**
   * Obtains one or more guild scheduled events from Discord, or the guild cache if it's aready available.
   * @param {GuildScheduledEventResolvable|FetchGuildScheduledEventOptions|FetchGuildScheduledEventsOptions} [options]
   * The id of the guild scheduled event or options
   * @returns {Promise<GuildScheduledEvent|Collection<Snowflake, GuildScheduledEvent>>}
   */
  async fetch(options = {}) {
    const id = this.resolveId(options.guildScheduledEvent ?? options);

    if (id) {
      if (!options.force) {
        const existing = this.cache.get(id);
        if (existing) return existing;
      }

      const data = await this.client.api.guilds(this.guild.id, 'scheduled-events', id).get();
      return this._add(data, options.cache);
    }

    const data = await this.client.api
      .guilds(this.guild.id, 'scheduled-events')
      .get({ query: { with_user_counts: options.withUserCounts ?? true } });

    return data.reduce(
      (coll, rawGuildScheduledEventData) =>
        coll.set(
          rawGuildScheduledEventData.id,
          this.guild.scheduledEvents._add(rawGuildScheduledEventData, options.cache),
        ),
      new Collection(),
    );
  }

  /**
   * Options used to edit a guild scheduled event.
   * @typedef {Object} GuildScheduledEventEditOptions
   * @property {string} [name] The name of the guild scheduled event
   * @property {Date} [scheduledStartTime] The time to schedule the event at
   * @property {PrivacyLevel|number} [privacyLevel] The privacy level of the guild scheduled event
   * @property {GuildScheduledEventEntityType|number} [entityType] The scheduled entity type of the event
   * @property {string} [description] The description of the guild scheduled event
   * @property {GuildChannelResolvable} [channel] The channel of the guild scheduled event
   * @property {UserResolvable[]} [speakers] The speakers of the guild scheduled event
   * @property {string} [location] The location of the guild scheduled event
   * @property {GuildScheduledEventStatus|number} [status] The status of the guild scheduled event
   */

  /**
   * Edits a guild scheduled event.
   * @param {GuildScheduledEventResolvable} guildScheduledEvent The guild scheduled event to edit
   * @param {GuildScheduledEventEditOptions} options Options to edit the guild scheduled event
   * @returns {Promise<GuildScheduledEvent>}
   */
  async edit(guildScheduledEvent, options) {
    const guildScheduledEventId = this.resolveId(guildScheduledEvent);
    if (!guildScheduledEventId) throw new Error('GUILD_SCHEDULED_EVENT_RESOLVE');

    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    let { privacyLevel, entityType, channel, speakers, location, status, name, scheduledStartTime, description } =
      options;

    if (typeof privacyLevel === 'string') privacyLevel = PrivacyLevels[privacyLevel];
    if (typeof entityType === 'string') entityType = GuildScheduledEventEntityTypes[entityType];
    if (typeof status === 'string') status = GuildScheduledEventStatuses[status];
    const channelId = this.guild.channels.resolveId(channel);

    speakers = speakers?.map(user => this.client.users.resolveId(user));

    const data = await this.client.api.guilds(this.guild.id, 'scheduled-events', guildScheduledEventId).patch({
      data: {
        channel_id: channelId,
        name,
        privacy_level: privacyLevel,
        scheduled_start_time: new Date(scheduledStartTime).toISOString(),
        description,
        entity_type: entityType,
        status,
        entity_metadata: {
          speakers,
          location,
        },
      },
    });

    return this._add(data);
  }

  /**
   * Deletes a guild scheduled event.
   * @param {GuildScheduledEventResolvable} guildScheduledEvent The guild scheduled event to delete
   * @returns {Promise<void>}
   */
  async delete(guildScheduledEvent) {
    const guildScheduledEventId = this.resolveId(guildScheduledEvent);
    if (!guildScheduledEventId) throw new Error('GUILD_SCHEDULED_EVENT_RESOLVE');

    await this.client.api.guilds(this.guild.id, 'scheduled-events', guildScheduledEventId).delete();
  }

  /**
   * Options used to fetch subscribers of a guild schedule event
   * @typedef {Object} FetchGuildScheduledEventSubscribersOptions
   * @property {number} [limit] The maximum numbers of users to fetch
   * @property {boolean} [withMember] Whether to fetch guild member data of the users
   */

  /**
   * Fetches subscribers of a guild scheduled event.
   * @param {GuildScheduledEventResolvable} guildScheduledEvent The guild scheduled event to fetch subscribers of
   * @param {FetchGuildScheduledEventSubscribersOptions} [options] Options for fetching the subscribers
   * @returns {Promise<Collection<Snowflake, User> | Collection<Snowflkae, GuildMember>>}
   */
  async fetchSubscribers(guildScheduledEvent, options) {
    const guildScheduledEventId = this.resolveId(guildScheduledEvent);
    if (!guildScheduledEventId) throw new Error('GUILD_SCHEDULED_EVENT_RESOLVE');

    const data = await this.client.api.guilds(this.guild.id, 'scheduled-events', guildScheduledEventId).users.get({
      query: { limit: options?.limit, with_member: options?.withMember },
    });

    // TODO: find a way to return collection of members. (Edge case??): some users can be non-members
    // Can't test it rn because setting privacy level to 'PUBLIC' returns error
    // if (options?.withMember) {
    //
    // }

    return data.users.reduce(
      (coll, rawUserData) => coll.set(rawUserData.id, this.client.users._add(rawUserData)),
      new Collection(),
    );
  }
}

module.exports = GuildScheduledEventManager;
