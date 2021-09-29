'use strict';

const Base = require('./Base');
const GuildEventEntityMetadata = require('./GuildEventEntityMetadata');
const { PrivacyLevels, GuildScheduledEventEntityTypes, GuildScheduledEventStatuses } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents a scheduled event of a {@link Guild}.
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
    if ('channel_id' in data) {
      /**
       * The id of the channel this guild scheduled event belongs to
       * @type {Snowflake}
       */
      this.channelId = data.channel_id;
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

    if ('image' in data) {
      /**
       * The image of the guild scheduled event
       * @type {string}
       */
      this.image = data.image;
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
    this.privacyLevel = PrivacyLevels[data.privacy_level];

    /**
     * The status of the guild scheduled event
     * @type {GuildScheduledEventStatus}
     */
    this.status = GuildScheduledEventStatuses[data.status];

    /**
     * The entity type of the guild scheduled event
     * @type {GuildScheduledEventEntityType}
     */
    this.entityType = GuildScheduledEventEntityTypes[data.entity_type];

    /**
     * The entity id
     * @type {?Snowflake}
     */
    this.entityId = data.entity_id;

    /**
     * The metadata for the guild scheduled event
     * @type {GuildEventEntityMetadata}
     */
    this.entityMetadata = new GuildEventEntityMetadata(data.entity_metadata);

    /**
     * The sku ids
     * @type {Snowflake[]}
     */
    this.skuIds = data.sku_ids;

    /**
     * The skus
     * TODO: will update this once more info is available
     * @type {Object[]}
     */
    this.skus = data.skus;

    if ('user_count' in data) {
      /**
       * The number of users who are subscribed to this guild scheduled event
       * @type {number}
       */
      this.userCount = data.user_count;
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
}

module.exports = GuildScheduledEvent;
