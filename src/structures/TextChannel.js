const GuildChannel = require('./GuildChannel');
const TextBasedChannel = require('./interface/TextBasedChannel');

/**
 * Represents a Server Text Channel on Discord.
 * @extends {GuildChannel}
 * @implements {TextBasedChannel}
 */
class TextChannel extends GuildChannel {

  constructor(guild, data) {
    super(guild, data);
    this.messages = new Map();
  }

  sendMessage() {
    return;
  }

  sendTTSMessage() {
    return;
  }

  _cacheMessage() {
    return;
  }
}

TextBasedChannel.applyToClass(TextChannel, true);

module.exports = TextChannel;
