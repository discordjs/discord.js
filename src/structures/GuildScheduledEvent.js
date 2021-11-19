'use strict';

const Base = require('./Base');
const {
  GuildScheduledEventEntityTypes,
  GuildScheduledEventStatuses,
  GuildScheduledEventPrivacyLevels,
} = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents a scheduled event in a {@link Guild}.
 * @extends {Base}
 */
class GuildScheduledEvent extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the guild scheduled event
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The id of the guild this guild scheduled event belongs to
     * @type {Snowflake}
     */
    this.guildId = data.guild_id;

    /**
     * Whether the guild scheduled event has been deleted
     * @type {boolean}
     */
    this.deleted = false;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The channel id in which the scheduled event will be hosted, or `null` if entity type is `EXTERNAL`
     * @type {?Snowflake}
     */
    this.channelId = data.channel_id;

    /**
     * The id of the user that created this guild scheduled event
     * @type {?Snowflake}
     */
    this.creatorId = data.creator_id;

    /**
     * The name of the guild scheduled event
     * @type {string}
     */
    this.name = data.name;

    if ('description' in data) {
      /**
       * The description of the guild scheduled event
       * @type {?string}
       */
      this.description = data.description;
    } else {
      this.description ??= null;
    }

    /**
     * The timestamp the guild scheduled event will start at
     * @type {number}
     */
    this.scheduledStartTime = data.scheduled_start_time;

    /**
     * The timestamp the guild scheduled event will end at,
     * or `null` if the event does not have a scheduled time to end
     * @type {?number}
     */
    this.scheduledEndTime = data.scheduled_end_time;

    /**
     * The privacy level of the guild scheduled event
     * @type {PrivacyLevel}
     */
    this.privacyLevel = GuildScheduledEventPrivacyLevels[data.privacy_level];

    /**
     * The status of the guild scheduled event
     * @type {GuildScheduledEventStatus}
     */
    this.status = GuildScheduledEventStatuses[data.status];

    /**
     * The type of hosting entity associated with the scheduled event
     * @type {GuildScheduledEventEntityType}
     */
    this.entityType = GuildScheduledEventEntityTypes[data.entity_type];

    /**
     * The id of the hosting entity associated with the scheduled event
     * @type {?Snowflake}
     */
    this.entityId = data.entity_id;

    if ('user_count' in data) {
      /**
       * The number of users who are subscribed to this guild scheduled event
       * @type {?number}
       */
      this.userCount = data.user_count;
    } else {
      this.userCount ??= null;
    }

    if ('creator' in data) {
      /**
       * The user that created this guild scheduled event
       * @type {?User}
       */
      this.creator = this.client.users._add(data.creator);
    } else {
      this.creator ??= this.client.users.resolve(this.creatorId);
    }

    if (data.entity_metadata) {
      if ('location' in data.entity_metadata) {
        /**
         * The location of the event
         * @type {?string}
         */
        this.location = data.entity_metadata.location;
      } else {
        this.location ??= null;
      }
    } else {
      this.location ??= null;
    }
  }

  /**
   * The timestamp the guild scheduled event was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
  }

  /**
   * The time the guild scheduled event was created at
   * @type {Date}
   * @readonly
   */
  get cretedAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the guild scheduled event will start at
   * @type {Date}
   * @readonly
   */
  get scheduledStartAt() {
    return new Date(this.scheduledStartTime);
  }

  /**
   * The time the guild scheduled event will end at,
   * or `null` if the event does not have a scheduled time to end
   * @type {?Date}
   * @readonly
   */
  get scheduledEndAt() {
    return this.scheduledEndTime ? new Date(this.scheduledEndTime) : null;
  }

  /**
   * The channel associated with this scheduled event
   * @type {?(VoiceChannel|StageChannel)}
   * @readonly
   */
  get channel() {
    return this.client.channels.resolve(this.channelId);
  }

  /**
   * The guild this scheduled event belongs to
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildId);
  }

  /**
   * Edits this guild scheduled event.
   * @param {GuildScheduledEventEditOptions} options The options to edit the guild scheduled event
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Edit a guild scheduled event
   * guildScheduledEvent.edit({ name: 'Party' })
   *  .then(guildScheduledEvent => console.log(guildScheduledEvent))
   *  .catch(console.error);
   */
  edit(options) {
    return this.guild.scheduledEvents.edit(this.id, options);
  }

  /**
   * Deletes this guild scheduled event.
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Delete a guild scheduled event
   * guildScheduledEvent.delete()
   *  .then(guildScheduledEvent => console.log(guildScheduledEvent))
   *  .catch(console.error);
   */
  async delete() {
    await this.guild.scheduledEvents.delete(this.id);
    const clone = this._clone();
    clone.deleted = true;
    return clone;
  }

  /**
   * Sets a new name for the guild scheduled event.
   * @param {string} name The new name of the guild scheduled event
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set name of a guild scheduled event
   * guildScheduledEvent.setName('Birthday Party')
   *  .then(guildScheduledEvent => console.log(`Set the name to: ${guildScheduledEvent.name}`))
   *  .catch(console.error);
   */
  setName(name) {
    return this.edit({ name });
  }

  /**
   * Sets a new time to schedule the event at.
   * @param {DateResolvable} scheduledStartTime The time to schedule the event at
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set start time of a guild scheduled event
   * guildScheduledEvent.setScheduledStartTime('September 24, 2022'))
   *  .then(guildScheduledEvent => console.log(`Set the start time to: ${guildScheduledEvent.scheduledStartTime}`))
   *  .catch(console.error);
   */
  setScheduledStartTime(scheduledStartTime) {
    return this.edit({ scheduledStartTime });
  }

  /**
   * Sets the new description of the guild scheduled event.
   * @param {string} description The description of the guild scheduled event
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set description of a guild scheduled event
   * guildScheduledEvent.setDescription('A virtual birthday party')
   *  .then(guildScheduledEvent => console.log(`Set the description to: ${guildScheduledEvent.description}`))
   *  .catch(console.error);
   */
  setDescription(description) {
    return this.edit({ description });
  }

  /**
   * Sets the new status of the guild scheduled event.
   * @param {GuildScheduledEventStatus|number} status The status of the guild scheduled event
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set status of a guild scheduled event
   * guildScheduledEvent.setStatus('ACTIVE')
   *  .then(guildScheduledEvent => console.log(`Set the status to: ${guildScheduledEvent.status}`))
   *  .catch(console.error);
   */
  setStatus(status) {
    return this.edit({ status });
  }

  /**
   * Sets the new location of the guild scheduled event.
   * @param {string} location The location of the guild scheduled event
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set location of a guild scheduled event
   * guildScheduledEvent.setLocation('Earth')
   *  .then(guildScheduledEvent => console.log(`Set the location to: ${guildScheduledEvent.location}`))
   *  .catch(console.error);
   */
  setLocation(location) {
    return this.edit({ location });
  }

  /**
   * Fetches subscribers of this guild scheduled event.
   * @param {FetchGuildScheduledEventSubscribersOptions} [options] Options for fetching the subscribers
   * @returns {Promise<Collection<Snowflake, User> | Collection<Snowflake, GuildMember>>}
   */
  fetchSubscribers(options) {
    return this.guild.scheduledEvents.fetchSubscribers(this.id, options);
  }
}

module.exports = GuildScheduledEvent;

/**
 * @external APIGuildScheduledEvent
 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object}
 */
