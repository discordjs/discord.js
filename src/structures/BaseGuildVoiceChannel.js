'use strict';

const GuildChannel = require('./GuildChannel');
const Collection = require('../util/Collection');
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
      if (state.channelID === this.id && state.member) {
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
   * Attempts to join this voice-based channel.
   * @returns {Promise<VoiceConnection>}
   * @example
   * // Join a voice-based channel
   * voice-basedChannel.join()
   *   .then(connection => console.log('Connected!'))
   *   .catch(console.error);
   */
  join() {
    return this.client.voice.joinChannel(this);
  }

  /**
   * Leaves this voice-based channel.
   * @example
   * // Leave a voice-based channel
   * voice-basedChannel.leave();
   */
  leave() {
    const connection = this.client.voice.connections.get(this.guild.id);
    if (connection?.channel.id === this.id) connection.disconnect();
  }
}

module.exports = BaseGuildVoiceChannel;
