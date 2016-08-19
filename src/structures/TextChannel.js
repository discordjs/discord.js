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

  _cacheMessage(message) {
    const maxSize = this.client.options.max_message_cache;
    if (maxSize === 0) {
      // saves on performance
      return null;
    }

    if (this.messages.size >= maxSize) {
      this.messages.delete(Array.from(this.messages.keys())[0]);
    }

    this.messages.set(message.id, message);

    return message;
  }

  sendMessage() {
    return;
  }

  sendTTSMessage() {
    return;
  }
}

TextBasedChannel.applyToClass(TextChannel);

module.exports = TextChannel;
