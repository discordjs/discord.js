const TextChannel = require('./TextChannel');

/**
 * Represents a guild news channel on Discord.
 * @extends {TextChannel}
 */
class NewsChannel extends TextChannel {
  constructor(guild, data) {
    super(guild, data);
    this.type = 'news';
  }

  setup(data) {
    super.setup(data);

    /**
     * The ratelimit per user for this channel (always 0)
     * @type {number}
     */
    this.rateLimitPerUser = 0;
  }
}

module.exports = NewsChannel;
