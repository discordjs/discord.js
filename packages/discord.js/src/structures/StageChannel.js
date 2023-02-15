'use strict';

const BaseGuildVoiceChannel = require('./BaseGuildVoiceChannel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const MessageManager = require('../managers/MessageManager');

/**
 * Represents a guild stage channel on Discord.
 * @extends {BaseGuildVoiceChannel}
 * @implements {TextBasedChannel}
 */
class StageChannel extends BaseGuildVoiceChannel {
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

    if ('topic' in data) {
      /**
       * The topic of the stage channel
       * @type {?string}
       */
      this.topic = data.topic;
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
    return this.edit({ topic, reason });
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
    return this.edit({ bitrate, reason });
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
    return this.edit({ userLimit, reason });
  }

  /**
   * Sets the camera video quality mode of the channel.
   * @param {VideoQualityMode} videoQualityMode The new camera video quality mode.
   * @param {string} [reason] Reason for changing the camera video quality mode.
   * @returns {Promise<VoiceChannel>}
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

TextBasedChannel.applyToClass(StageChannel, true, ['lastPinAt']);

module.exports = StageChannel;
