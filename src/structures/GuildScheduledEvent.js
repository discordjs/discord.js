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
  /**
   * @param {Client} client The instantiating client
   * @param {APIGuildScheduledEvent} data The data for the guild scheduled event
   */
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

    if ('creator_id' in data) {
      /**
       * The id of the user that created this guild scheduled event
       * @type {Snowflake}
       */
      this.creatorId = data.creator_id;
    }

    /**
     * The name of the guild scheduled event
     * @type {string}
     */
    this.name = data.name;

    if ('description' in data) {
      /**
       * The description of the guild scheduled event
       * @type {string}
       */
      this.description = data.description;
    }

    /**
     * The image of the guild scheduled event
     * @type {?string}
     */
    this.image = data.image;

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

    if ('speaker_ids' in data.entity_metadata) {
      /**
       * The ids of the users who are speakers of the stage channel
       * @type {Snowflake[]}
       */
      this.speakerIds = data.entity_metadata.speaker_ids;
    }

    if ('location' in data.entity_metadata) {
      /**
       * The location of the event
       * @type {string}
       */
      this.location = data.entity_metadata.location;
    }

    if ('user_count' in data) {
      /**
       * The number of users who are subscribed to this guild scheduled event
       * @type {number}
       */
      this.userCount = data.user_count;
    }

    if ('creator' in data) {
      /**
       * The user who created this guild scheduled event
       * @type {User}
       */
      this.creator = this.client.users._add(data.creator);
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

  // TODO: Add shortcut methods for editing specific properties
}

module.exports = GuildScheduledEvent;
