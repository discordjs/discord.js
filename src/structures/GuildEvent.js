'use strict';

const Base = require('./Base');
const GuildEventEntityMetadata = require('./GuildEventEntityMetadata');
const { PrivacyLevels, GuildEventEntityTypes, GuildEventStatuses } = require('../util/Constants');

/**
 * Represents an event in a {@link Guild}.
 * @extends {Base}
 */
class GuildEvent extends Base {
  /**
   *
   * @param {Client} client The instantiating client
   * @param {*} data The data for the guild event
   */
  constructor(client, data) {
    super(client);

    /**
     * The guild event's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The id of the guild this event belongs to
     * @type {Snowflake}
     */
    this.guildId = data.guild_id;

    this._patch(data);
  }

  _patch(data) {
    if ('channel_id' in data) {
      /**
       * The id of the stage channel this event belongs to
       */
      this.channelId = data.channel_id;
    }

    /**
     * The name of the guild event
     * @type {string}
     */
    this.name = data.name;

    if ('description' in data) {
      /**
       * The description of the guild event
       * @type {string}
       */
      this.description = data.description;
    }

    if ('image' in data) {
      /**
       * The image of the guild event
       * @type {string}
       */
      this.image = data.image;
    }

    /**
     * The time at which the guild event will start
     * @type {Date}
     */
    this.scheduledStartTime = data.scheduled_start_time;

    /**
     * The time at which the guild event will end, or `null` if the event does not have a scheduled time to end
     * @type {?Date}
     */
    this.scheduledEndTime = data.scheduled_end_time;

    /**
     * The privacy level of the guild event
     * @type {PrivacyLevel}
     */
    this.privacyLevel = PrivacyLevels[data.privacy_level];

    /**
     * The status of the guild event
     * @type {GuildEventStatus}
     */
    this.status = GuildEventStatuses[data.status];

    /**
     * The entity type of the guild event
     * @type {GuildEventEntityType}
     */
    this.entityType = GuildEventEntityTypes[data.entity_type];

    /**
     * The entity id
     * @type {?Snowflake}
     */
    this.entityId = data.entity_id;

    /**
     * The metadata for the guild event
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
     */
    this.skus = data.skus;

    if ('user_count' in data) {
      /**
       * The number of users who are subscribed to this guild event
       * @type {number}
       */
      this.userCount = data.user_count;
    }
  }
}

module.exports = GuildEvent;
