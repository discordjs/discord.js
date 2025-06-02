'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const { GuildScheduledEventStatus, GuildScheduledEventEntityType, RouteBases } = require('discord-api-types/v10');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');
const { Base } = require('./Base.js');

/**
 * Represents a scheduled event in a {@link Guild}.
 *
 * @extends {Base}
 */
class GuildScheduledEvent extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the guild scheduled event
     *
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The id of the guild this guild scheduled event belongs to
     *
     * @type {Snowflake}
     */
    this.guildId = data.guild_id;

    this._patch(data);
  }

  _patch(data) {
    if ('channel_id' in data) {
      /**
       * The channel id in which the scheduled event will be hosted,
       * or `null` if entity type is {@link GuildScheduledEventEntityType.External}
       *
       * @type {?Snowflake}
       */
      this.channelId = data.channel_id;
    } else {
      this.channelId ??= null;
    }

    if ('creator_id' in data) {
      /**
       * The id of the user that created this guild scheduled event
       *
       * @type {?Snowflake}
       */
      this.creatorId = data.creator_id;
    } else {
      this.creatorId ??= null;
    }

    if ('name' in data) {
      /**
       * The name of the guild scheduled event
       *
       * @type {?string}
       */
      this.name = data.name;
    } else {
      // Only if partial.
      this.name ??= null;
    }

    if ('description' in data) {
      /**
       * The description of the guild scheduled event
       *
       * @type {?string}
       */
      this.description = data.description;
    } else {
      this.description ??= null;
    }

    if ('scheduled_start_time' in data) {
      /**
       * The timestamp the guild scheduled event will start at
       *
       * @type {?number}
       */
      this.scheduledStartTimestamp = Date.parse(data.scheduled_start_time);
    } else {
      this.scheduledStartTimestamp ??= null;
    }

    if ('scheduled_end_time' in data) {
      /**
       * The timestamp the guild scheduled event will end at
       * or `null` if the event does not have a scheduled time to end
       *
       * @type {?number}
       */
      this.scheduledEndTimestamp = data.scheduled_end_time ? Date.parse(data.scheduled_end_time) : null;
    } else {
      this.scheduledEndTimestamp ??= null;
    }

    if ('privacy_level' in data) {
      /**
       * The privacy level of the guild scheduled event
       *
       * @type {?GuildScheduledEventPrivacyLevel}
       */
      this.privacyLevel = data.privacy_level;
    } else {
      // Only if partial.
      this.privacyLevel ??= null;
    }

    if ('status' in data) {
      /**
       * The status of the guild scheduled event
       *
       * @type {?GuildScheduledEventStatus}
       */
      this.status = data.status;
    } else {
      // Only if partial.
      this.status ??= null;
    }

    if ('entity_type' in data) {
      /**
       * The type of hosting entity associated with the scheduled event
       *
       * @type {?GuildScheduledEventEntityType}
       */
      this.entityType = data.entity_type;
    } else {
      // Only if partial.
      this.entityType ??= null;
    }

    if ('entity_id' in data) {
      /**
       * The id of the hosting entity associated with the scheduled event
       *
       * @type {?Snowflake}
       */
      this.entityId = data.entity_id;
    } else {
      this.entityId ??= null;
    }

    if ('user_count' in data) {
      /**
       * The number of users who are subscribed to this guild scheduled event
       *
       * @type {?number}
       */
      this.userCount = data.user_count;
    } else {
      this.userCount ??= null;
    }

    if ('creator' in data) {
      /**
       * The user that created this guild scheduled event
       *
       * @type {?User}
       */
      this.creator = this.client.users._add(data.creator);
    } else {
      this.creator ??= this.client.users.resolve(this.creatorId);
    }

    /**
     * Represents the additional metadata for a {@link GuildScheduledEvent}
     *
     * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-metadata}
     * @typedef {Object} GuildScheduledEventEntityMetadata
     * @property {?string} location The location of the guild scheduled event
     */

    if ('entity_metadata' in data) {
      if (data.entity_metadata) {
        /**
         * Additional metadata
         *
         * @type {?GuildScheduledEventEntityMetadata}
         */
        this.entityMetadata = {
          location: data.entity_metadata.location ?? this.entityMetadata?.location ?? null,
        };
      } else {
        this.entityMetadata = null;
      }
    } else {
      this.entityMetadata ??= null;
    }

    if ('image' in data) {
      /**
       * The cover image hash for this scheduled event
       *
       * @type {?string}
       */
      this.image = data.image;
    } else {
      this.image ??= null;
    }

    /**
     * Represents the recurrence rule for a {@link GuildScheduledEvent}.
     *
     * @typedef {Object} GuildScheduledEventRecurrenceRule
     * @property {number} startTimestamp The timestamp the recurrence rule interval starts at
     * @property {Date} startAt The time the recurrence rule interval starts at
     * @property {?number} endTimestamp The timestamp the recurrence rule interval ends at
     * @property {?Date} endAt The time the recurrence rule interval ends at
     * @property {GuildScheduledEventRecurrenceRuleFrequency} frequency How often the event occurs
     * @property {number} interval The spacing between the events
     * @property {?GuildScheduledEventRecurrenceRuleWeekday[]} byWeekday The days within a week to recur on
     * @property {?GuildScheduledEventRecurrenceRuleNWeekday[]} byNWeekday The days within a week to recur on
     * @property {?GuildScheduledEventRecurrenceRuleMonth[]} byMonth The months to recur on
     * @property {?number[]} byMonthDay The days within a month to recur on
     * @property {?number[]} byYearDay The days within a year to recur on
     * @property {?number} count The total amount of times the event is allowed to recur before stopping
     */

    /**
     * @typedef {Object} GuildScheduledEventRecurrenceRuleNWeekday
     * @property {number} n The week to recur on
     * @property {GuildScheduledEventRecurrenceRuleWeekday} day The day within the week to recur on
     */

    if ('recurrence_rule' in data) {
      /**
       * The recurrence rule for this scheduled event
       *
       * @type {?GuildScheduledEventRecurrenceRule}
       */
      this.recurrenceRule = data.recurrence_rule && {
        startTimestamp: Date.parse(data.recurrence_rule.start),
        get startAt() {
          return new Date(this.startTimestamp);
        },
        endTimestamp: data.recurrence_rule.end && Date.parse(data.recurrence_rule.end),
        get endAt() {
          return this.endTimestamp && new Date(this.endTimestamp);
        },
        frequency: data.recurrence_rule.frequency,
        interval: data.recurrence_rule.interval,
        byWeekday: data.recurrence_rule.by_weekday,
        byNWeekday: data.recurrence_rule.by_n_weekday,
        byMonth: data.recurrence_rule.by_month,
        byMonthDay: data.recurrence_rule.by_month_day,
        byYearDay: data.recurrence_rule.by_year_day,
        count: data.recurrence_rule.count,
      };
    } else {
      this.recurrenceRule ??= null;
    }
  }

  /**
   * Whether this guild scheduled event is partial.
   *
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return this.name === null;
  }

  /**
   * The URL of this scheduled event's cover image
   *
   * @param {BaseImageURLOptions} [options={}] Options for image URL
   * @returns {?string}
   */
  coverImageURL(options = {}) {
    return this.image && this.client.rest.cdn.guildScheduledEventCover(this.id, this.image, options);
  }

  /**
   * The timestamp the guild scheduled event was created at
   *
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the guild scheduled event was created at
   *
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the guild scheduled event will start at
   * <info>This can be potentially `null` only when it's an {@link GuildAuditLogsEntry#target}</info>
   *
   * @type {?Date}
   * @readonly
   */
  get scheduledStartAt() {
    return this.scheduledStartTimestamp && new Date(this.scheduledStartTimestamp);
  }

  /**
   * The time the guild scheduled event will end at,
   * or `null` if the event does not have a scheduled time to end
   *
   * @type {?Date}
   * @readonly
   */
  get scheduledEndAt() {
    return this.scheduledEndTimestamp && new Date(this.scheduledEndTimestamp);
  }

  /**
   * The channel associated with this scheduled event
   *
   * @type {?(VoiceChannel|StageChannel)}
   * @readonly
   */
  get channel() {
    return this.client.channels.resolve(this.channelId);
  }

  /**
   * The guild this scheduled event belongs to
   *
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.resolve(this.guildId);
  }

  /**
   * The URL to the guild scheduled event
   *
   * @type {string}
   * @readonly
   */
  get url() {
    return `${RouteBases.scheduledEvent}/${this.guildId}/${this.id}`;
  }

  /**
   * Options used to create an invite URL to a {@link GuildScheduledEvent}
   *
   * @typedef {InviteCreateOptions} GuildScheduledEventInviteURLCreateOptions
   * @property {GuildInvitableChannelResolvable} [channel] The channel to create the invite in.
   * <warn>This is required when the `entityType` of `GuildScheduledEvent` is
   * {@link GuildScheduledEventEntityType.External}, gets ignored otherwise</warn>
   */

  /**
   * Creates an invite URL to this guild scheduled event.
   *
   * @param {GuildScheduledEventInviteURLCreateOptions} [options] The options to create the invite
   * @returns {Promise<string>}
   */
  async createInviteURL(options) {
    let channelId = this.channelId;
    if (this.entityType === GuildScheduledEventEntityType.External) {
      if (!options?.channel) throw new DiscordjsError(ErrorCodes.InviteOptionsMissingChannel);
      channelId = this.guild.channels.resolveId(options.channel);
      if (!channelId) throw new DiscordjsError(ErrorCodes.GuildChannelResolve);
    }

    const invite = await this.guild.invites.create(channelId, options);
    return `${RouteBases.invite}/${invite.code}?event=${this.id}`;
  }

  /**
   * Edits this guild scheduled event.
   *
   * @param {GuildScheduledEventEditOptions} options The options to edit the guild scheduled event
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Edit a guild scheduled event
   * guildScheduledEvent.edit({ name: 'Party' })
   *  .then(guildScheduledEvent => console.log(guildScheduledEvent))
   *  .catch(console.error);
   */
  async edit(options) {
    return this.guild.scheduledEvents.edit(this.id, options);
  }

  /**
   * Fetches this guild scheduled event.
   *
   * @param {boolean} [force=true] Whether to skip the cache check and request the API
   * @returns {Promise<GuildScheduledEvent>}
   */
  async fetch(force = true) {
    return this.guild.scheduledEvents.fetch({ guildScheduledEvent: this.id, force });
  }

  /**
   * Deletes this guild scheduled event.
   *
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Delete a guild scheduled event
   * guildScheduledEvent.delete()
   *  .then(guildScheduledEvent => console.log(guildScheduledEvent))
   *  .catch(console.error);
   */
  async delete() {
    await this.guild.scheduledEvents.delete(this.id);
    return this;
  }

  /**
   * Sets a new name for the guild scheduled event.
   *
   * @param {string} name The new name of the guild scheduled event
   * @param {string} [reason] The reason for changing the name
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set name of a guild scheduled event
   * guildScheduledEvent.setName('Birthday Party')
   *  .then(guildScheduledEvent => console.log(`Set the name to: ${guildScheduledEvent.name}`))
   *  .catch(console.error);
   */
  async setName(name, reason) {
    return this.edit({ name, reason });
  }

  /**
   * Sets a new time to schedule the event at.
   *
   * @param {DateResolvable} scheduledStartTime The time to schedule the event at
   * @param {string} [reason] The reason for changing the scheduled start time
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set start time of a guild scheduled event
   * guildScheduledEvent.setScheduledStartTime('2022-09-24T00:00:00+05:30')
   *  .then(guildScheduledEvent => console.log(`Set the start time to: ${guildScheduledEvent.scheduledStartTime}`))
   *  .catch(console.error);
   */
  async setScheduledStartTime(scheduledStartTime, reason) {
    return this.edit({ scheduledStartTime, reason });
  }

  // TODO: scheduledEndTime gets reset on passing null but it hasn't been documented
  /**
   * Sets a new time to end the event at.
   *
   * @param {DateResolvable} scheduledEndTime The time to end the event at
   * @param {string} [reason] The reason for changing the scheduled end time
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set end time of a guild scheduled event
   * guildScheduledEvent.setScheduledEndTime('2022-09-25T00:00:00+05:30')
   *  .then(guildScheduledEvent => console.log(`Set the end time to: ${guildScheduledEvent.scheduledEndTime}`))
   *  .catch(console.error);
   */
  async setScheduledEndTime(scheduledEndTime, reason) {
    return this.edit({ scheduledEndTime, reason });
  }

  /**
   * Sets the new description of the guild scheduled event.
   *
   * @param {string} description The description of the guild scheduled event
   * @param {string} [reason] The reason for changing the description
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set description of a guild scheduled event
   * guildScheduledEvent.setDescription('A virtual birthday party')
   *  .then(guildScheduledEvent => console.log(`Set the description to: ${guildScheduledEvent.description}`))
   *  .catch(console.error);
   */
  async setDescription(description, reason) {
    return this.edit({ description, reason });
  }

  /**
   * Sets the new status of the guild scheduled event.
   * <info>If you're working with TypeScript, use this method in conjunction with status type-guards
   * like {@link GuildScheduledEvent#isScheduled} to get only valid status as suggestion</info>
   *
   * @param {GuildScheduledEventStatus} status The status of the guild scheduled event
   * @param {string} [reason] The reason for changing the status
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set status of a guild scheduled event
   * guildScheduledEvent.setStatus(GuildScheduledEventStatus.Active)
   *  .then(guildScheduledEvent => console.log(`Set the status to: ${guildScheduledEvent.status}`))
   *  .catch(console.error);
   */
  async setStatus(status, reason) {
    return this.edit({ status, reason });
  }

  /**
   * Sets the new location of the guild scheduled event.
   *
   * @param {string} location The location of the guild scheduled event
   * @param {string} [reason] The reason for changing the location
   * @returns {Promise<GuildScheduledEvent>}
   * @example
   * // Set location of a guild scheduled event
   * guildScheduledEvent.setLocation('Earth')
   *  .then(guildScheduledEvent => console.log(`Set the location to: ${guildScheduledEvent.entityMetadata.location}`))
   *  .catch(console.error);
   */
  async setLocation(location, reason) {
    return this.edit({ entityMetadata: { location }, reason });
  }

  /**
   * Fetches subscribers of this guild scheduled event.
   *
   * @param {FetchGuildScheduledEventSubscribersOptions} [options] Options for fetching the subscribers
   * @returns {Promise<Collection<Snowflake, GuildScheduledEventUser>>}
   */
  async fetchSubscribers(options) {
    return this.guild.scheduledEvents.fetchSubscribers(this.id, options);
  }

  /**
   * When concatenated with a string, this automatically concatenates the event's URL instead of the object.
   *
   * @returns {string}
   * @example
   * // Logs: Event: https://discord.com/events/412345678901234567/499876543211234567
   * console.log(`Event: ${guildScheduledEvent}`);
   */
  toString() {
    return this.url;
  }

  /**
   * Indicates whether this guild scheduled event has an {@link GuildScheduledEventStatus.Active} status.
   *
   * @returns {boolean}
   */
  isActive() {
    return this.status === GuildScheduledEventStatus.Active;
  }

  /**
   * Indicates whether this guild scheduled event has a {@link GuildScheduledEventStatus.Canceled} status.
   *
   * @returns {boolean}
   */
  isCanceled() {
    return this.status === GuildScheduledEventStatus.Canceled;
  }

  /**
   * Indicates whether this guild scheduled event has a {@link GuildScheduledEventStatus.Completed} status.
   *
   * @returns {boolean}
   */
  isCompleted() {
    return this.status === GuildScheduledEventStatus.Completed;
  }

  /**
   * Indicates whether this guild scheduled event has a {@link GuildScheduledEventStatus.Scheduled} status.
   *
   * @returns {boolean}
   */
  isScheduled() {
    return this.status === GuildScheduledEventStatus.Scheduled;
  }
}

exports.GuildScheduledEvent = GuildScheduledEvent;
