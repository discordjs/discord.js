'use strict';

const { Collection } = require('@discordjs/collection');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const GuildChannel = require('./GuildChannel');

/**
 * Represents a voice-based guild channel on Discord.
 * @extends {GuildChannel}
 */
class BaseGuildVoiceChannel extends GuildChannel {
  _patch(data) {
    super._patch(data);

    if ('rtc_region' in data) {
      /**
       * The RTC region for this voice-based channel. This region is automatically selected if `null`.
       * @type {?string}
       */
      this.rtcRegion = data.rtc_region;
    }

    if ('bitrate' in data) {
      /**
       * The bitrate of this voice-based channel
       * @type {number}
       */
      this.bitrate = data.bitrate;
    }

    if ('user_limit' in data) {
      /**
       * The maximum amount of users allowed in this channel.
       * @type {number}
       */
      this.userLimit = data.user_limit;
    }
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
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;

    // This flag allows joining even if timed out
    if (permissions.has(PermissionFlagsBits.Administrator, false)) return true;

    return (
      this.guild.members.me.communicationDisabledUntilTimestamp < Date.now() &&
      permissions.has(PermissionFlagsBits.Connect, false)
    );
  }

  /**
   * Sets the RTC region of the channel.
   * @param {?string} rtcRegion The new region of the channel. Set to `null` to remove a specific region for the channel
   * @param {string} [reason] The reason for modifying this region.
   * @returns {Promise<BaseGuildVoiceChannel>}
   * @example
   * // Set the RTC region to sydney
   * channel.setRTCRegion('sydney', 'Set new region of the channel is sydney!');
   * @example
   * // Remove a fixed region for this channel - let Discord decide automatically
   * channel.setRTCRegion(null, 'We want to let Discord decide.');
   */
  setRTCRegion(rtcRegion, reason) {
    return this.edit({
      rtcRegion,
      reason,
    });
  }

  /**
   * Creates an invite to this guild channel.
   * @param {CreateInviteOptions} [options={}] The options for creating the invite
   * @returns {Promise<Invite>}
   * @example
   * // Create an invite to a channel
   * channel.createInvite()
   *   .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
   *   .catch(console.error);
   */
  createInvite(options) {
    return this.guild.invites.create(this.id, options);
  }

  /**
   * Fetches a collection of invites to this guild channel.
   * Resolves with a collection mapping invites by their codes.
   * @param {boolean} [cache=true] Whether or not to cache the fetched invites
   * @returns {Promise<Collection<string, Invite>>}
   */
  fetchInvites(cache = true) {
    return this.guild.invites.fetch({
      channelId: this.id,
      cache,
    });
  }
}

module.exports = BaseGuildVoiceChannel;
