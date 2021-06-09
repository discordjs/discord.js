'use strict';

const Base = require('./Base');
const { PrivacyLevels } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents a stage instance.
 * @extends {Base}
 */
class StageInstance extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The ID of this stage instance
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * Whether the stage instance has been deleted
     * @type {boolean}
     */
    this.deleted = false;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The guild ID of the associated stage channel
     * @type {Snowflake}
     */
    this.guildID = data.guild_id;

    /**
     * The ID of the associated stage channel
     * @type {Snowflake}
     */
    this.channelID = data.channel_id;

    /**
     * The topic of the stage instance
     * @type {string}
     */
    this.topic = data.topic;

    /**
     * The privacy level of the stage instance
     * @type {PrivacyLevel}
     */
    this.privacyLevel = PrivacyLevels[data.privacy_level];

    /**
     * Whether or not stage discovery is disabled
     * @type {boolean}
     */
    this.discoverableDisabled = data.discoverable_disabled;
  }

  /**
   * The stage channel associated with this instance
   * @type {?StageChannel}
   * @readonly
   */
  get channel() {
    return this.client.channels.cache.get(this.channelID) ?? null;
  }

  /**
   * The guild this stage instance belongs to
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.channel?.guild ?? null;
  }

  /**
   * Updates this stage instance.
   * @param {UpdateStageInstanceOptions} options The options to update the stage instance
   * @returns {Promise<StageInstance>}
   */
  update(options) {
    return this.guild.stageInstances.update(this.channelID, options);
  }

  /**
   * Deletes this stage instance.
   * @returns {Promise<StageInstance>}
   */
  async delete() {
    await this.guild.stageInstances.delete(this.channelID);
    const clone = this._clone();
    clone.deleted = true;
    return clone;
  }

  /**
   * Sets the topic of this stage instance.
   * @param {string} topic The topic for the stage instance
   * @returns {Promise<StageInstance>}
   */
  setTopic(topic) {
    return this.guild.stageInstances.update(this.channelID, { topic });
  }

  /**
   * The timestamp this stage instances was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
  }

  /**
   * The time this stage instance was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }
}

module.exports = StageInstance;
