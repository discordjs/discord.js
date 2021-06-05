'use strict';

const Base = require('./Base');
const { PrivacyLevels } = require('../util/Constants');

/**
 * Represents a stage instance.
 * @extends {Base}
 */
class StageInstance extends Base {
  constructor(guild, data) {
    super(guild.client);

    /**
     * The ID of this stage instance
     * @type {Snowflake}
     */
    this.id = data.id;

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
}

module.exports = StageInstance;
