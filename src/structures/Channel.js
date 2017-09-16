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

    const type = Object.keys(ChannelTypes)[data.type];
    /**
     * The type of the channel, either:
     * * `dm` - a DM channel
     * * `group` - a Group DM channel
     * * `text` - a guild text channel
     * * `voice` - a guild voice channel
     * * `category` - a guild category channel
     * * `unknown` - a generic channel of unknown type, could be Channel or GuildChannel
     * @type {string}
     */
    this.type = type ? type.toLowerCase() : 'unknown';

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
   * The time the channel was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * Deletes this channel.
   * @returns {Promise<Channel>}
   * @example
   * // Delete the channel
   * channel.delete()
   *   .then() // Success
   *   .catch(console.error); // Log error
   */
  delete() {
    return this.client.api.channels(this.id).delete().then(() => this);
  }

  static create(client, data, guild) {
    const DMChannel = require('./DMChannel');
    const GroupDMChannel = require('./GroupDMChannel');
    const TextChannel = require('./TextChannel');
    const VoiceChannel = require('./VoiceChannel');
    const CategoryChannel = require('./CategoryChannel');
    const GuildChannel = require('./GuildChannel');
    let channel;
    if (data.type === ChannelTypes.DM) {
      channel = new DMChannel(client, data);
    } else if (data.type === ChannelTypes.GROUP) {
      channel = new GroupDMChannel(client, data);
    } else {
      guild = guild || client.guilds.get(data.guild_id);
      if (guild) {
        switch (data.type) {
          case ChannelTypes.TEXT:
            channel = new TextChannel(guild, data);
            break;
          case ChannelTypes.VOICE:
            channel = new VoiceChannel(guild, data);
            break;
          case ChannelTypes.CATEGORY:
            channel = new CategoryChannel(guild, data);
            break;
          default:
            channel = new GuildChannel(guild, data);
        }
        guild.channels.set(channel.id, channel);
      }
    }
    return channel;
  }
}

module.exports = Channel;
