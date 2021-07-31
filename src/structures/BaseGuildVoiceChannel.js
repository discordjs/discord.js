'use strict';

const { Collection } = require('@discordjs/collection');
const GuildChannel = require('./GuildChannel');
const Permissions = require('../util/Permissions');

/**
 * Represents a voice-based guild channel on Discord.
 * @extends {GuildChannel}
 */
class BaseGuildVoiceChannel extends GuildChannel {
  _patch(data) {
    super._patch(data);

    /**
     * The RTC region for this voice-based channel. This region is automatically selected if `null`.
     * @type {?string}
     */
    this.rtcRegion = data.rtc_region;

    /**
     * The bitrate of this voice-based channel
     * @type {number}
     */
    this.bitrate = data.bitrate;

    /**
     * The maximum amount of users allowed in this channel.
     * @type {number}
     */
    this.userLimit = data.user_limit;
  }

  /**
   * The members in this voice-based channel
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    const coll = new Collection();
    for (const state of this.guild.voiceStates.cache.values()) {
      if (state.channelId === this.id && state.member) {
        coll.set(state.id, state.member);
      }
    }
    return coll;
  }

  /**
   * Checks if the voice-based channel is full
   * @type {boolean}
   * @readonly
   */
  get full() {
    return this.userLimit > 0 && this.members.size >= this.userLimit;
  }

  /**
   * Whether the channel is joinable by the client user
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    if (!this.viewable) return false;
    if (!this.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT, false)) return false;
    return true;
  }

  /**
   * Sets the RTC region of the channel.
   * @param {?string} region The new region of the channel. Set to `null` to remove a specific region for the channel
   * @returns {Promise<BaseGuildVoiceChannel>}
   * @example
   * // Set the RTC region to europe
   * channel.setRTCRegion('europe');
   * @example
   * // Remove a fixed region for this channel - let Discord decide automatically
   * channel.setRTCRegion(null);
   */
  setRTCRegion(region) {
    return this.edit({ rtcRegion: region });
  }
}

module.exports = BaseGuildVoiceChannel;
