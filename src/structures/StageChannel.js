'use strict';

const GuildChannel = require('./GuildChannel');
const Collection = require('../util/Collection');
const Permissions = require('../util/Permissions');

/**
 * Represents a guild stage channel on Discord.
 * @extends {GuildChannel}
 */
class StageChannel extends GuildChannel {
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
  }

  /**
   * The members in this stage channel
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
   * Checks if the stage channel is full
   * @type {boolean}
   * @readonly
   */
  get full() {
    return this.userLimit > 0 && this.members.size >= this.userLimit;
  }

  /**
   * Whether the channel is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return this.manageable && this.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT, false);
  }

  /**
   * Whether the channel is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    return this.manageable && this.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT, false);
  }

  /**
   * Whether the channel is joinable by the client user
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    if (!this.viewable) return false;
    if (!this.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT, false)) return false;
    // Todo: unsure if the following statement works for stage channels
    // if (this.full && !this.permissionsFor(this.client.user).has(Permissions.FLAGS.MOVE_MEMBERS, false)) return false;
    return true;
  }

  /**
   * Sets the RTC region of the channel.
   * @param {?string} region The new region of the channel. Set to null to remove a specific region for the channel
   * @returns {Promise<StageChannel>}
   * @example
   * // Set the RTC region to europe
   * stageChannel.setRTCRegion('europe');
   * @example
   * // Remove a fixed region for this channel - let Discord decide automatically
   * stageChannel.setRTCRegion(null);
   */
  setRTCRegion(region) {
    return this.edit({ rtcRegion: region });
  }

  /**
   * Attempts to join this stage channel.
   * @returns {Promise<VoiceConnection>}
   * @example
   * // Join a stage channel
   * stageChannel.join()
   *   .then(connection => console.log('Connected!'))
   *   .catch(console.error);
   */
  join() {
    return this.client.voice.joinChannel(this);
  }

  /**
   * Leaves this stage channel.
   * @example
   * // Leave a stage channel
   * stageChannel.leave();
   */
  leave() {
    const connection = this.client.voice.connections.get(this.guild.id);
    if (connection?.channel.id === this.id) connection.disconnect();
  }
}

module.exports = StageChannel;
