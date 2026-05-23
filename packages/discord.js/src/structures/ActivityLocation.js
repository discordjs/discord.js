'use strict';

const { Base } = require('./Base.js');

/**
 * Represents the location of an activity instance.
 *
 * @extends {Base}
 */
class ActivityLocation extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The unique identifier for the location
     *
     * @type {string}
     */
    this.id = data.id;

    /**
     * The kind of location
     *
     * @type {ActivityLocationKind}
     */
    this.kind = data.kind;

    /**
     * The id of the channel
     *
     * @type {Snowflake}
     */
    this.channelId = data.channel_id;

    /**
     * The id of the guild
     *
     * @type {?Snowflake}
     */
    this.guildId = data.guild_id ?? null;
  }

  /**
   * The channel of this activity location
   *
   * @type {?Channel}
   * @readonly
   */
  get channel() {
    return this.client.channels.cache.get(this.channelId) ?? null;
  }

  /**
   * The guild of this activity location
   *
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    if (!this.guildId) return null;
    return this.client.guilds.cache.get(this.guildId) ?? null;
  }
}

exports.ActivityLocation = ActivityLocation;
