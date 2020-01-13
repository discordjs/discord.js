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

    // News channels don't have a rate limit per user, remove it
    this.rateLimitPerUser = undefined;
  }
}

module.exports = NewsChannel;
