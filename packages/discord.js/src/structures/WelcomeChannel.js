'use strict';

const Base = require('./Base');
const { Emoji } = require('./Emoji');

/**
 * Represents a channel link in a guild's welcome screen.
 * @extends {Base}
 */
class WelcomeChannel extends Base {
  constructor(guild, data) {
    super(guild.client);

    /**
     * The guild for this welcome channel
     * @type {Guild|InviteGuild}
     */
    this.guild = guild;

    /**
     * The description of this welcome channel
     * @type {string}
     */
    this.description = data.description;

    /**
     * The raw emoji data
     * @type {Object}
     * @private
     */
    this._emoji = {
      name: data.emoji_name,
      id: data.emoji_id,
    };

    /**
     * The id of this welcome channel
     * @type {Snowflake}
     */
    this.channelId = data.channel_id;
  }

  /**
   * The channel of this welcome channel
   * @type {?(TextChannel|NewsChannel|ForumChannel|MediaChannel)}
   */
  get channel() {
    return this.client.channels.resolve(this.channelId);
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
