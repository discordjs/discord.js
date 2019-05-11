const GuildChannel = require('./GuildChannel');

/**
 * Represents a guild store channel on Discord.
 * @extends {GuildChannel}
 */
class StoreChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);
    this.type = 'store';
  }

  setup(data) {
    super.setup(data);

    /**
     * If the guild considers this channel NSFW
     * @type {boolean}
     * @readonly
     */
    this.nsfw = data.nsfw;
  }
}

module.exports = StoreChannel;
