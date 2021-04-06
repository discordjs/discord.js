'use strict';

const Base = require('./Base');
const Emoji = require('./Emoji');

/**
 * Represents a channel link in a guild's welcome screen.
 */
class WelcomeChannel extends Base {
  constructor(guild, data) {
    super(guild.client);
    /**
     * The guild for this welcome channel
     * @type {Guild}
     */
    this.guild = guild;

    this._patch(data);
  }

  /**
   * Builds the welcome channel with the provided data.
   * @param {*} data The raw data of this welcome channel
   * @private
   */
  _patch(data) {
    if (!data) return;
    /**
     * The description of this welcome channel
     * @type {string}
     */
    this.description = data.description;
    this._emoji = {
      name: data.emoji_name,
      id: data.emoji_id,
    };

    /**
     * The id of this welcome channel
     * @type {Snowflake}
     */
    this.channelID = data.channel_id;
  }

  /**
   * The channel of this welcome channel
   * @type {?(TextChannel|NewsChannel)}
   */
  get channel() {
    return this.client.channels.resolve(this.channelID);
  }

  /**
   * The emoji of this welcome channel
   * @type {GuildEmoji|Emoji}
   */
  get emoji() {
    return this.client.emojis.resolve(this._emoji.id) ?? new Emoji(this.client, this._emoji);
  }
}

module.exports = WelcomeChannel;
