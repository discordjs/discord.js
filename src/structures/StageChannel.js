'use strict';

const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');

/**
 * Represents a guild stage channel on Discord.
 * @extends {GuildChannel}
 */
class StageChannel extends BaseGuildVoiceChannel {
  _patch(data) {
    super._patch(data);

    /**
     * The topic of the stage channel
     * @type {?string}
     */
    this.topic = data.topic;
  }

  /**
   * Sets the RTC region of the channel.
   * @param {?string} region The new region of the channel. Set to `null` to remove a specific region for the channel
   * @returns {Promise<StageChannel>}
   * @example
   * // Set the RTC region to europe
   * voice-basedChannel.setRTCRegion('europe');
   * @example
   * // Remove a fixed region for this channel - let Discord decide automatically
   * voice-basedChannel.setRTCRegion(null);
   */
  setRTCRegion(region) {
    return this.edit({ rtcRegion: region });
  }
}

module.exports = StageChannel;
