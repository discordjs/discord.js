'use strict';

const BaseManager = require('./BaseManager');
const { TypeError, Error } = require('../errors');
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
   * The cache of this Manager
   * @type {Collection<Snowflake, StageInstance>}
   * @name StageInstanceManager#cache
   */

  add(data, channel, cache) {
    return super.add(data, cache, { extras: [channel] });
  }

  /**
   * Options used to create a stage instance.
   * @typedef {Object} CreateStageInstanceOptions
   * @property {StageChannel|Snowflake} channel The stage channel whose instance is to be created
   * @property {string} topic The topic of the stage instance
   * @property {PrivacyLevel|number} [privacyLevel] The privacy level of the stage instance
   */

  /**
   * Creates a new stage instance.
   * @param {CreateStageInstanceOptions} options The options to create the stage instance
   * @returns {Promise<StageInstance>}
   */
  async create(options) {
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    let { channel, topic, privacyLevel } = options;
    const channelID = this.guild.channels.resolveID(channel);
    if (!channelID) throw new Error('STAGE_CHANNEL_RESOLVE');

    if (privacyLevel) privacyLevel = typeof privacyLevel === 'number' ? privacyLevel : PrivacyLevels[privacyLevel];

    const data = await this.client.api['stage-instances'].post({
      data: {
        channel_id: channelID,
        topic,
        privacy_level: privacyLevel,
      },
    });

    return this.add(data);
  }

  /**
   * Options used to fetch a stage instance.
   * @typedef {Object} FetchStageInstanceOptions
   * @property {StageChannel|Snowflake} channel The stage channel whose instance is to be fetched
   * @property {boolean} [cache=true] Whether or not to cache the fetched stage instance
   * @property {boolean} [force=false] Whether to skip the cache check and request the API
   */

  /**
   * Fetches the stage instance associated with a stage channel, if it exists.
   * @param {FetchStageInstanceOptions} options The options to fetch the stage instance
   * @returns {Promise<StageInstance>}
   */
  async fetch(options) {
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    const channelID = this.guild.channels.resolveID(options.channel);
    if (!channelID) throw new Error('STAGE_CHANNEL_RESOLVE');

    if (!options.force) {
      const existing = this.cache.find(stageInstance => stageInstance.channelID === channelID);
      if (existing) return existing;
    }

    const data = await this.client.api('stage-instances', channelID).get();
    return this.add(data, options.cache);
  }

  /**
   * Options used to update an existing stage instance.
   * @typedef {Object} UpdateStageInstanceOptions
   * @property {string} topic The new topic of the stage instance
   * @property {PrivacyLevel|number} privacyLevel The new privacy level of the stage instance
   */

  /**
   * Updates an existing stage instance.
   * @param {StageChannel|Snowflake} channel The stage channel whose instance is to be updated
   * @param {UpdateStageInstanceOptions} options The options to update the stage instance
   * @returns {Promise<StageInstance>}
   */
  async update(channel, options) {
    if (typeof options !== 'object') throw new TypeError('INVALID_TYPE', 'options', 'object', true);
    const channelID = this.guild.channels.resolveID(channel);
    if (!channelID) throw new Error('STAGE_CHANNEL_RESOLVE');

    let { topic, privacyLevel } = options;

    if (privacyLevel) privacyLevel = typeof privacyLevel === 'number' ? privacyLevel : PrivacyLevels[privacyLevel];

    const data = await this.client.api('stage-instances', channelID).patch({
      data: {
        topic,
        privacy_level: privacyLevel,
      },
    });

    return this.add(data);
  }

  /**
   * Deletes an existing stage instance.
   * @param {StageChannel|Snowflake} channel The stage channel whose instance is to be deleted
   * @returns {Promise<void>}
   */
  async delete(channel) {
    const channelID = this.guild.channels.resolveID(channel);
    if (!channelID) throw new Error('STAGE_CHANNEL_RESOLVE');

    await this.client.api('stage-instances', channelID).delete();
  }
}

module.exports = StageInstanceManager;
