'use strict';

const Base = require('./Base');
let CategoryChannel;
let DMChannel;
let NewsChannel;
let StageChannel;
let StoreChannel;
let TextChannel;
let ThreadChannel;
let VoiceChannel;
const { ChannelTypes, ThreadChannelTypes } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents any channel on Discord.
 * @extends {Base}
 * @abstract
 */
class Channel extends Base {
  constructor(client, data, immediatePatch = true) {
    super(client);

    const type = ChannelTypes[data.type];
    /**
     * The type of the channel
     * @type {ChannelType}
     */
    this.type = type ?? 'UNKNOWN';

    /**
     * Whether the channel has been deleted
     * @type {boolean}
     */
    this.deleted = false;

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
    return SnowflakeUtil.deconstruct(this.id).timestamp;
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
  delete() {
    return this.client.api
      .channels(this.id)
      .delete()
      .then(() => this);
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
   * Indicates whether this channel is text-based
   * ({@link TextChannel}, {@link DMChannel}, {@link NewsChannel} or {@link ThreadChannel}).
   * @returns {boolean}
   */
  isText() {
    return 'messages' in this;
  }

  /**
   * Indicates whether this channel is a {@link ThreadChannel}.
   * @returns {boolean}
   */
  isThread() {
    return ThreadChannelTypes.includes(this.type);
  }

  static create(client, data, guild, allowUnknownGuild) {
    if (!CategoryChannel) CategoryChannel = require('./CategoryChannel');
    if (!DMChannel) DMChannel = require('./DMChannel');
    if (!NewsChannel) NewsChannel = require('./NewsChannel');
    if (!StageChannel) StageChannel = require('./StageChannel');
    if (!StoreChannel) StoreChannel = require('./StoreChannel');
    if (!TextChannel) TextChannel = require('./TextChannel');
    if (!ThreadChannel) ThreadChannel = require('./ThreadChannel');
    if (!VoiceChannel) VoiceChannel = require('./VoiceChannel');

    let channel;
    if (!data.guild_id && !guild) {
      if ((data.recipients && data.type !== ChannelTypes.GROUP_DM) || data.type === ChannelTypes.DM) {
        channel = new DMChannel(client, data);
      } else if (data.type === ChannelTypes.GROUP_DM) {
        const PartialGroupDMChannel = require('./PartialGroupDMChannel');
        channel = new PartialGroupDMChannel(client, data);
      }
    } else {
      if (!guild) guild = client.guilds.cache.get(data.guild_id);

      if (guild || allowUnknownGuild) {
        switch (data.type) {
          case ChannelTypes.GUILD_TEXT: {
            channel = new TextChannel(guild, data, client);
            break;
          }
          case ChannelTypes.GUILD_VOICE: {
            channel = new VoiceChannel(guild, data, client);
            break;
          }
          case ChannelTypes.GUILD_CATEGORY: {
            channel = new CategoryChannel(guild, data, client);
            break;
          }
          case ChannelTypes.GUILD_NEWS: {
            channel = new NewsChannel(guild, data, client);
            break;
          }
          case ChannelTypes.GUILD_STORE: {
            channel = new StoreChannel(guild, data, client);
            break;
          }
          case ChannelTypes.GUILD_STAGE_VOICE: {
            channel = new StageChannel(guild, data, client);
            break;
          }
          case ChannelTypes.GUILD_NEWS_THREAD:
          case ChannelTypes.GUILD_PUBLIC_THREAD:
          case ChannelTypes.GUILD_PRIVATE_THREAD: {
            channel = new ThreadChannel(guild, data, client);
            if (!allowUnknownGuild) channel.parent?.threads.cache.set(channel.id, channel);
            break;
          }
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

module.exports = Channel;

/**
 * @external APIChannel
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
 */
