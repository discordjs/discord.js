'use strict';

const { channelLink } = require('@discordjs/builders');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { ChannelType, Routes } = require('discord-api-types/v10');
const Base = require('./Base');
const ChannelFlagsBitField = require('../util/ChannelFlagsBitField');
const { ThreadChannelTypes } = require('../util/Constants');

/**
 * Represents any channel on Discord.
 * @extends {Base}
 * @abstract
 */
class BaseChannel extends Base {
  constructor(client, data, immediatePatch = true) {
    super(client);

    /**
     * The type of the channel
     * @type {ChannelType}
     */
    this.type = data.type;

    if (data && immediatePatch) this._patch(data);
  }

  _patch(data) {
    if ('flags' in data) {
      /**
       * The flags that are applied to the channel.
       * <info>This is only `null` in a {@link PartialGroupDMChannel}. In all other cases, it is not `null`.
       * @type {?Readonly<ChannelFlagsBitField>}
       */
      this.flags = new ChannelFlagsBitField(data.flags).freeze();
    } else {
      this.flags = new ChannelFlagsBitField(this.flags).freeze();
    }

    /**
     * The channel's id
     * @type {Snowflake}
     */
    this.id = data.id;
  }

  /**
   * The timestamp the channel was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the channel was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The URL to the channel
   * @type {string}
   * @readonly
   */
  get url() {
    return this.isDMBased() ? channelLink(this.id) : channelLink(this.id, this.guildId);
  }

  /**
   * Whether this Channel is a partial
   * <info>This is always false outside of DM channels.</info>
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return false;
  }

  /**
   * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object.
   * @returns {string}
   * @example
   * // Logs: Hello from <#123456789012345678>!
   * console.log(`Hello from ${channel}!`);
   */
  toString() {
    return `<#${this.id}>`;
  }

  /**
   * Deletes this channel.
   * @returns {Promise<BaseChannel>}
   * @example
   * // Delete the channel
   * channel.delete()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async delete() {
    await this.client.rest.delete(Routes.channel(this.id));
    return this;
  }

  /**
   * Fetches this channel.
   * @param {boolean} [force=true] Whether to skip the cache check and request the API
   * @returns {Promise<BaseChannel>}
   */
  fetch(force = true) {
    return this.client.channels.fetch(this.id, { force });
  }

  /**
   * Indicates whether this channel is a {@link ThreadChannel}.
   * @returns {boolean}
   */
  isThread() {
    return ThreadChannelTypes.includes(this.type);
  }

  /**
   * Indicates whether this channel is {@link TextBasedChannels text-based}.
   * @returns {boolean}
   */
  isTextBased() {
    return 'messages' in this;
  }

  /**
   * Indicates whether this channel is DM-based (either a {@link DMChannel} or a {@link PartialGroupDMChannel}).
   * @returns {boolean}
   */
  isDMBased() {
    return [ChannelType.DM, ChannelType.GroupDM].includes(this.type);
  }

  /**
   * Indicates whether this channel is {@link BaseGuildVoiceChannel voice-based}.
   * @returns {boolean}
   */
  isVoiceBased() {
    return 'bitrate' in this;
  }

  toJSON(...props) {
    return super.toJSON({ createdTimestamp: true }, ...props);
  }
}

exports.BaseChannel = BaseChannel;

/**
 * @external APIChannel
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
 */
