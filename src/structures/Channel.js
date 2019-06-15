'use strict';

const Snowflake = require('../util/Snowflake');
const Base = require('./Base');
const { ChannelTypes } = require('../util/Constants');

/**
 * Represents any channel on Discord.
 * @extends {Base}
 */
class Channel extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The type of channel
     * @type {object}
     */
    this.type = {
      number: data.type,

      dm: data.type === ChannelTypes.DM,
      group: data.type === ChannelTypes.GROUP_DM,
      text: data.type === ChannelTypes.TEXT,
      voice: data.type === ChannelTypes.VOICE,
      category: data.type === ChannelTypes.CATEGORY,
      news: data.type === ChannelTypes.NEWS,
      store: data.type === ChannelTypes.STORE,

      // Categories
      TextChannel: this.constructor.TEXT_TYPES.includes(data.type),
      VoiceChannel: this.constructor.VOICE_TYPES.includes(data.type),
      GuildChannel: this.constructor.GUILD_TYPES.includes(data.type),
    };

    /**
     * Whether the channel has been deleted
     * @type {boolean}
     */
    this.deleted = false;

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The unique ID of the channel
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
    return Snowflake.deconstruct(this.id).timestamp;
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
    return this.client.api.channels(this.id).delete().then(() => this);
  }

  /**
   * Fetches this channel.
   * @returns {Promise<Channel>}
   */
  fetch() {
    return this.client.channels.fetch(this.id, true);
  }

  static create(client, data, guild) {
    const Structures = require('../util/Structures');
    let channel;
    if (data.type === ChannelTypes.DM || (data.type !== ChannelTypes.GROUP && !data.guild_id && !guild)) {
      const DMChannel = Structures.get('DMChannel');
      channel = new DMChannel(client, data);
    } else {
      guild = guild || client.guilds.get(data.guild_id);
      if (guild) {
        switch (data.type) {
          case ChannelTypes.TEXT: {
            const TextChannel = Structures.get('TextChannel');
            channel = new TextChannel(guild, data);
            break;
          }
          case ChannelTypes.VOICE: {
            const VoiceChannel = Structures.get('VoiceChannel');
            channel = new VoiceChannel(guild, data);
            break;
          }
          case ChannelTypes.CATEGORY: {
            const CategoryChannel = Structures.get('CategoryChannel');
            channel = new CategoryChannel(guild, data);
            break;
          }
          case ChannelTypes.NEWS: {
            const NewsChannel = Structures.get('NewsChannel');
            channel = new NewsChannel(guild, data);
            break;
          }
          case ChannelTypes.STORE: {
            const StoreChannel = Structures.get('StoreChannel');
            channel = new StoreChannel(guild, data);
            break;
          }
        }
        if (channel) guild.channels.set(channel.id, channel);
      }
    }
    return channel;
  }

  toJSON(...props) {
    return super.toJSON({ createdTimestamp: true }, ...props);
  }
}

/**
 * Channel types that count towards .TextChannel
 * @type {Array}
 */
Channel.TEXT_TYPES = [
  ChannelTypes.DM,
  ChannelTypes.TEXT,
  ChannelTypes.GROUP_DM,
  ChannelTypes.NEWS,
  ChannelTypes.STORE,
];

/**
 * Channel types that count towards .VoiceChannel
 * @type {Array}
 */
Channel.VOICE_TYPES = [
  ChannelTypes.VOICE,
];

/**
 * Channel types that count towards .GuildChannel
 * @type {Array}
 */
Channel.GUILD_TYPES = [
  ChannelTypes.TEXT,
  ChannelTypes.CATEGORY,
  ChannelTypes.VOICE,
  ChannelTypes.NEWS,
  ChannelTypes.STORE,
];

module.exports = Channel;
