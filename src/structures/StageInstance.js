'use strict';

const Base = require('./Base');

/**
 * Represents a stage instance.
 * @extends {Base}
 */
class StageInstance extends Base {
  constructor(client, data) {
    super(client);

    this.id = data.id;

    this.guildID = data.guild_id;

    this.channelID = data.channel_id;

    this.topic = data.topic;

    this.privacyLevel = data.privacy_level;

    this.discoverableDisabled = data.discoverable_disabled;
  }
}

module.exports = StageInstance;
