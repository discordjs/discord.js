'use strict';

const BaseManager = require('./BaseManager');
const StageInstance = require('../structures/StageInstance');
const { PrivacyLevels } = require('../util/Constants');

class StageInstanceManager extends BaseManager {
  constructor(guild, iterable) {
    super(guild.client, iterable, StageInstance);

    /**
     * The guild this manager belongs to
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * Options used to create a stage instance.
   * @typedef {Object} CreateStageInstanceOptions
   * @property {StageChannel|Snowflake} channel The stage channel whose instance is to be created
   * @property {string} topic The topic of the stage instance
   * @property {PrivacyLevel|number} [privacyLevel] The privacy level of the stage instance
   */

  async create(options = {}) {
    let { channel, topic, privacyLevel } = options;
    const channelID = this.guild.channels.resolveID(channel);
    if (privacyLevel) privacyLevel = typeof privacyLevel === 'number' ? privacyLevel : PrivacyLevels[privacyLevel];

    const data = await this.client.api['stage-instances'].post({
      data: {
        channel_id: channelID,
        topic,
        privacy_level: privacyLevel,
      },
    });

    return this.client.actions.StageInstanceCreate.handle(data).stageInstance;
  }
}

module.exports = StageInstanceManager;
