'use strict';

const GuildChannel = require('./GuildChannel');

/**
 * Represents a guild stage channel on Discord.
 * @extends {GuildChannel}
 */
class StageChannel extends GuildChannel {
  /**
   * @param {*} guild The guild the store channel is part of
   * @param {*} data The data for the store channel
   */
  constructor(guild, data) {
    super(guild, data);

    /**
     * If the guild considers this channel NSFW
     * @type {boolean}
     * @readonly
     */
    this.nsfw = Boolean(data.nsfw);
  }

  _patch(data) {
    super._patch(data);

    /**
     * The topic of the stage channel
     * @type {?string}
     */
    this.topic = data.topic;

    /**
     * The RTC region for this stage channel. This region is automatically selected if null.
     * @type {?string}
     */
    this.rtcRegion = data.rtc_region;

    /**
     * The bitrate of this stage channel
     * @type {number}
     */
    this.bitrate = data.bitrate;

    /**
     * The maximum amount of users allowed in this channel.
     * @type {number}
     */
    this.userLimit = data.user_limit;

    if (typeof data.nsfw !== 'undefined') this.nsfw = Boolean(data.nsfw);
  }

  /**
   * Sets the RTC region of the channel.
   * @param {?region} region The new region of the channel. Set to null to remove a specific region for the channel
   * @returns {Promise<StageChannel>}
   */
  setRTCRegion(region) {
    return this.edit({ rtcRegion: region });
  }
}

module.exports = StageChannel;
