'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const { ChannelType, Routes } = require('discord-api-types/v10');
const Base = require('./Base');
const { ThreadChannelTypes } = require('../util/Constants');
let CategoryChannel;
let DMChannel;
let NewsChannel;
let StageChannel;
let TextChannel;
let ThreadChannel;
let VoiceChannel;
let DirectoryChannel;

/**
 * Represents any channel on Discord.
 * @extends {Base}
 * @abstract
 */
class Channel extends Base {
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
    return `https://discord.com/channels/${this.isDMBased() ? '@me' : this.guildId}/${this.id}`;
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
   * @returns {Promise<Channel>}
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
   * @returns {Promise<Channel>}
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

  static create(client, data, guild, { allowUnknownGuild, fromInteraction } = {}) {
    CategoryChannel ??= require('./CategoryChannel');
    DMChannel ??= require('./DMChannel');
    NewsChannel ??= require('./NewsChannel');
    StageChannel ??= require('./StageChannel');
    TextChannel ??= require('./TextChannel');
    ThreadChannel ??= require('./ThreadChannel');
    VoiceChannel ??= require('./VoiceChannel');
    DirectoryChannel ??= require('./DirectoryChannel');

    let channel;
    if (!data.guild_id && !guild) {
      if ((data.recipients && data.type !== ChannelType.GroupDM) || data.type === ChannelType.DM) {
        channel = new DMChannel(client, data);
      } else if (data.type === ChannelType.GroupDM) {
        const PartialGroupDMChannel = require('./PartialGroupDMChannel');
        channel = new PartialGroupDMChannel(client, data);
      }
    } else {
      guild ??= client.guilds.cache.get(data.guild_id);

      if (guild || allowUnknownGuild) {
        switch (data.type) {
          case ChannelType.GuildText: {
            channel = new TextChannel(guild, data, client);
            break;
          }
          case ChannelType.GuildVoice: {
            channel = new VoiceChannel(guild, data, client);
            break;
          }
          case ChannelType.GuildCategory: {
            channel = new CategoryChannel(guild, data, client);
            break;
          }
          case ChannelType.GuildNews: {
            channel = new NewsChannel(guild, data, client);
            break;
          }
          case ChannelType.GuildStageVoice: {
            channel = new StageChannel(guild, data, client);
            break;
          }
          case ChannelType.GuildNewsThread:
          case ChannelType.GuildPublicThread:
          case ChannelType.GuildPrivateThread: {
            channel = new ThreadChannel(guild, data, client, fromInteraction);
            if (!allowUnknownGuild) channel.parent?.threads.cache.set(channel.id, channel);
            break;
          }
          case ChannelType.GuildDirectory:
            channel = new DirectoryChannel(client, data);
            break;
        }
        if (channel && !allowUnknownGuild) guild.channels?.cache.set(channel.id, channel);
      }
    }
    return channel;
  }

  toJSON(...props) {
    return super.toJSON({ createdTimestamp: true }, ...props);
  }
}

exports.Channel = Channel;

/**
 * @external APIChannel
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
 */
