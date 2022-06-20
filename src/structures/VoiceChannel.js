'use strict';

const process = require('node:process');
const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const MessageManager = require('../managers/MessageManager');
const { VideoQualityModes } = require('../util/Constants');
const Permissions = require('../util/Permissions');

let deprecationEmittedForEditable = false;

/**
 * Represents a guild voice channel on Discord.
 * @extends {BaseGuildVoiceChannel}
 * @implements {TextBasedChannel}
 */
class VoiceChannel extends BaseGuildVoiceChannel {
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

    this._patch(data);
  }

  _patch(data) {
    super._patch(data);

    if ('video_quality_mode' in data) {
      /**
       * The camera video quality mode of the channel.
       * @type {?VideoQualityMode}
       */
      this.videoQualityMode = VideoQualityModes[data.video_quality_mode];
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
   * Whether the channel is editable by the client user
   * @type {boolean}
   * @readonly
   * @deprecated Use {@link VoiceChannel#manageable} instead
   */
  get editable() {
    if (!deprecationEmittedForEditable) {
      process.emitWarning(
        'The VoiceChannel#editable getter is deprecated. Use VoiceChannel#manageable instead.',
        'DeprecationWarning',
      );

      deprecationEmittedForEditable = true;
    }

    return this.manageable;
  }

  /**
   * Whether the channel is joinable by the client user
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    if (!super.joinable) return false;
    if (this.full && !this.permissionsFor(this.client.user).has(Permissions.FLAGS.MOVE_MEMBERS, false)) return false;
    return true;
  }

  /**
   * Checks if the client has permission to send audio to the voice channel
   * @type {boolean}
   * @readonly
   */
  get speakable() {
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;
    // This flag allows speaking even if timed out
    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR, false)) return true;

    return (
      this.guild.me.communicationDisabledUntilTimestamp < Date.now() && permissions.has(Permissions.FLAGS.SPEAK, false)
    );
  }

  /**
   * Sets the bitrate of the channel.
   * @param {number} bitrate The new bitrate
   * @param {string} [reason] Reason for changing the channel's bitrate
   * @returns {Promise<VoiceChannel>}
   * @example
   * // Set the bitrate of a voice channel
   * voiceChannel.setBitrate(48_000)
   *   .then(vc => console.log(`Set bitrate to ${vc.bitrate}bps for ${vc.name}`))
   *   .catch(console.error);
   */
  setBitrate(bitrate, reason) {
    return this.edit({ bitrate }, reason);
  }

  /**
   * Sets the user limit of the channel.
   * @param {number} userLimit The new user limit
   * @param {string} [reason] Reason for changing the user limit
   * @returns {Promise<VoiceChannel>}
   * @example
   * // Set the user limit of a voice channel
   * voiceChannel.setUserLimit(42)
   *   .then(vc => console.log(`Set user limit to ${vc.userLimit} for ${vc.name}`))
   *   .catch(console.error);
   */
  setUserLimit(userLimit, reason) {
    return this.edit({ userLimit }, reason);
  }

  /**
   * Sets the camera video quality mode of the channel.
   * @param {VideoQualityMode|number} videoQualityMode The new camera video quality mode.
   * @param {string} [reason] Reason for changing the camera video quality mode.
   * @returns {Promise<VoiceChannel>}
   */
  setVideoQualityMode(videoQualityMode, reason) {
    return this.edit({ videoQualityMode }, reason);
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

  /**
   * Sets the RTC region of the channel.
   * @name VoiceChannel#setRTCRegion
   * @param {?string} rtcRegion The new region of the channel. Set to `null` to remove a specific region for the channel
   * @param {string} [reason] The reason for modifying this region.
   * @returns {Promise<VoiceChannel>}
   * @example
   * // Set the RTC region to sydney
   * voiceChannel.setRTCRegion('sydney');
   * @example
   * // Remove a fixed region for this channel - let Discord decide automatically
   * voiceChannel.setRTCRegion(null, 'We want to let Discord decide.');
   */
}

TextBasedChannel.applyToClass(VoiceChannel, true, ['lastPinAt']);

module.exports = VoiceChannel;
