'use strict';

const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');

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
   * @returns {Promise<StageChannel>}
   * @example
   * // Set a new channel topic
   * stagechannel.setTopic('needs more rate limiting')
   *   .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
   *   .catch(console.error);
   */
  setTopic(topic, reason) {
    return this.edit({ topic, reason });
  }
}

/**
 * Sets the bitrate of the channel.
 * @method setBitrate
 * @memberof StageChannel
 * @instance
 * @param {number} bitrate The new bitrate
 * @param {string} [reason] Reason for changing the channel's bitrate
 * @returns {Promise<StageChannel>}
 * @example
 * // Set the bitrate of a voice channel
 * stageChannel.setBitrate(48_000)
 *   .then(vc => console.log(`Set bitrate to ${vc.bitrate}bps for ${vc.name}`))
 *   .catch(console.error);
 */

/**
 * Sets the RTC region of the channel.
 * @method setRTCRegion
 * @memberof StageChannel
 * @instance
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
 * @method setUserLimit
 * @memberof StageChannel
 * @instance
 * @param {number} userLimit The new user limit
 * @param {string} [reason] Reason for changing the user limit
 * @returns {Promise<StageChannel>}
 * @example
 * // Set the user limit of a voice channel
 * stageChannel.setUserLimit(42)
 *   .then(vc => console.log(`Set user limit to ${vc.userLimit} for ${vc.name}`))
 *   .catch(console.error);
 */

/**
 * Sets the camera video quality mode of the channel.
 * @method setVideoQualityMode
 * @memberof StageChannel
 * @instance
 * @param {VideoQualityMode} videoQualityMode The new camera video quality mode.
 * @param {string} [reason] Reason for changing the camera video quality mode.
 * @returns {Promise<StageChannel>}
 */

module.exports = StageChannel;
