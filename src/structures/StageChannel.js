'use strict';

const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');

/**
 * Represents a guild stage channel on Discord.
 * @extends {BaseGuildVoiceChannel}
 */
class StageChannel extends BaseGuildVoiceChannel {
  _patch(data) {
    super._patch(data);

    if ('topic' in data) {
      /**
       * The topic of the stage channel
       * @type {?string}
       */
      this.topic = data.topic;
    }
  }

  /**
   * The stage instance of this stage channel, if it exists
   * @type {?StageInstance}
   * @readonly
   */
  get stageInstance() {
    return this.guild.stageInstances.cache.find(stageInstance => stageInstance.channelId === this.id) ?? null;
  }

  /**
   * Creates a stage instance associated with this stage channel.
   * @param {StageInstanceCreateOptions} options The options to create the stage instance
   * @returns {Promise<StageInstance>}
   */
  createStageInstance(options) {
    return this.guild.stageInstances.create(this.id, options);
  }

  /**
   * Sets a new topic for the guild channel.
   * @param {?string} topic The new topic for the guild channel
   * @param {string} [reason] Reason for changing the guild channel's topic
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel topic
   * channel.setTopic('needs more rate limiting')
   *   .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
   *   .catch(console.error);
   */
  setTopic(topic, reason) {
    return this.edit({ topic }, reason);
  }
  /**
   * Sets the bitrate of the channel.
   * @name StageChannel#setBitrate
   * @param {number} bitrate The new bitrate
   * @param {string} [reason] Reason for changing the channel's bitrate
   * @returns {Promise<StageChannel>}
   * @example
   * // Set the bitrate of a voice channel
   * stageChannel.setBitrate(48_000)
   *   .then(channel => console.log(`Set bitrate to ${channel.bitrate}bps for ${channel.name}`))
   *   .catch(console.error);
   */

  /**
   * Sets the RTC region of the channel.
   * @name StageChannel#setRTCRegion
   * @param {?string} rtcRegion The new region of the channel. Set to `null` to remove a specific region for the channel
   * @param {string} [reason] The reason for modifying this region.
   * @returns {Promise<StageChannel>}
   * @example
   * // Set the RTC region to sydney
   * stageChannel.setRTCRegion('sydney');
   * @example
   * // Remove a fixed region for this channel - let Discord decide automatically
   * stageChannel.setRTCRegion(null, 'We want to let Discord decide.');
   */

  /**
   * Sets the user limit of the channel.
   * @name StageChannel#setUserLimit
   * @param {number} userLimit The new user limit
   * @param {string} [reason] Reason for changing the user limit
   * @returns {Promise<StageChannel>}
   * @example
   * // Set the user limit of a voice channel
   * stageChannel.setUserLimit(42)
   *   .then(channel => console.log(`Set user limit to ${channel.userLimit} for ${channel.name}`))
   *   .catch(console.error);
   */

  /**
   * Sets the camera video quality mode of the channel.
   * @name StageChannel#setVideoQualityMode
   * @param {VideoQualityMode|number} videoQualityMode The new camera video quality mode.
   * @param {string} [reason] Reason for changing the camera video quality mode.
   * @returns {Promise<StageChannel>}
   */
}

TextBasedChannel.applyToClass(StageChannel, true, ['lastPinAt']);

module.exports = StageChannel;
