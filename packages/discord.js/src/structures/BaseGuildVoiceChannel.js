'use strict';

const { Collection } = require('@discordjs/collection');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const GuildChannel = require('./GuildChannel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const MessageManager = require('../managers/MessageManager');

/**
 * Represents a voice-based guild channel on Discord.
 * @extends {GuildChannel}
 * @implements {TextBasedChannel}
 */
class BaseGuildVoiceChannel extends GuildChannel {
  constructor(guild, data, client) {
    super(guild, data, client, false);
    /**
     * A manager of the messages sent to this channel
     * @type {MessageManager}
     */
    this.messages = new MessageManager(this);

    /**
     * If the guild considers this channel NSFW
     * @type {boolean}
     */
    this.nsfw = Boolean(data.nsfw);
  }

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

    if ('video_quality_mode' in data) {
      /**
       * The camera video quality mode of the channel.
       * @type {?VideoQualityMode}
       */
      this.videoQualityMode = data.video_quality_mode;
    } else {
      this.videoQualityMode ??= null;
    }

    if ('last_message_id' in data) {
      /**
       * The last message id sent in the channel, if one was sent
       * @type {?Snowflake}
       */
      this.lastMessageId = data.last_message_id;
    }

    if ('messages' in data) {
      for (const message of data.messages) this.messages._add(message);
    }

    if ('rate_limit_per_user' in data) {
      /**
       * The rate limit per user (slowmode) for this channel in seconds
       * @type {number}
       */
      this.rateLimitPerUser = data.rate_limit_per_user;
    }

    if ('nsfw' in data) {
      this.nsfw = Boolean(data.nsfw);
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
   * Creates an invite to this guild channel.
   * @param {InviteCreateOptions} [options={}] The options for creating the invite
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
   * @param {boolean} [cache=true] Whether to cache the fetched invites
   * @returns {Promise<Collection<string, Invite>>}
   */
  fetchInvites(cache = true) {
    return this.guild.invites.fetch({ channelId: this.id, cache });
  }

  /**
   * Sets the bitrate of the channel.
   * @param {number} bitrate The new bitrate
   * @param {string} [reason] Reason for changing the channel's bitrate
   * @returns {Promise<BaseGuildVoiceChannel>}
   * @example
   * // Set the bitrate of a voice channel
   * channel.setBitrate(48_000)
   *   .then(channel => console.log(`Set bitrate to ${channel.bitrate}bps for ${channel.name}`))
   *   .catch(console.error);
   */
  setBitrate(bitrate, reason) {
    return this.edit({ bitrate, reason });
  }

  /**
   * Sets the RTC region of the channel.
   * @param {?string} rtcRegion The new region of the channel. Set to `null` to remove a specific region for the channel
   * @param {string} [reason] The reason for modifying this region.
   * @returns {Promise<BaseGuildVoiceChannel>}
   * @example
   * // Set the RTC region to sydney
   * channel.setRTCRegion('sydney');
   * @example
   * // Remove a fixed region for this channel - let Discord decide automatically
   * channel.setRTCRegion(null, 'We want to let Discord decide.');
   */
  setRTCRegion(rtcRegion, reason) {
    return this.edit({ rtcRegion, reason });
  }

  /**
   * Sets the user limit of the channel.
   * @param {number} userLimit The new user limit
   * @param {string} [reason] Reason for changing the user limit
   * @returns {Promise<BaseGuildVoiceChannel>}
   * @example
   * // Set the user limit of a voice channel
   * channel.setUserLimit(42)
   *   .then(channel => console.log(`Set user limit to ${channel.userLimit} for ${channel.name}`))
   *   .catch(console.error);
   */
  setUserLimit(userLimit, reason) {
    return this.edit({ userLimit, reason });
  }

  /**
   * Sets the camera video quality mode of the channel.
   * @param {VideoQualityMode} videoQualityMode The new camera video quality mode.
   * @param {string} [reason] Reason for changing the camera video quality mode.
   * @returns {Promise<BaseGuildVoiceChannel>}
   */
  setVideoQualityMode(videoQualityMode, reason) {
    return this.edit({ videoQualityMode, reason });
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  get lastMessage() {}
  send() {}
  sendTyping() {}
  createMessageCollector() {}
  awaitMessages() {}
  createMessageComponentCollector() {}
  awaitMessageComponent() {}
  bulkDelete() {}
  fetchWebhooks() {}
  createWebhook() {}
  setRateLimitPerUser() {}
  setNSFW() {}
}

TextBasedChannel.applyToClass(BaseGuildVoiceChannel, true, ['lastPinAt']);

module.exports = BaseGuildVoiceChannel;
