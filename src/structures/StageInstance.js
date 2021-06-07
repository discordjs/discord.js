'use strict';

const Base = require('./Base');
const { PrivacyLevels } = require('../util/Constants');

/**
 * Represents a stage instance.
 * @extends {Base}
 */
class StageInstance extends Base {
  constructor(client, data, channel) {
    super(client);

    /**
     * The ID of this stage instance
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The stage channel associated with this instance
     * @type {StageChannel}
     */
    this.channel = channel;

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
   * The guild this stage instance belongs to
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.channel.guild || null;
  }

  /**
   * Updates this stage instance.
   * @param {UpdateStageInstanceOptions} options The options to update the stage instance
   * @returns {Promise<StageInstance>}
   */
  update(options) {
    return this.guild.stageInstances.update(this.channelID, options);
  }
}

module.exports = StageInstance;
