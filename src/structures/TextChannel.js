const GuildChannel = require('./GuildChannel');
const TextChannelDataStore = require('./datastore/TextChannelDataStore');
const TextBasedChannel = require('./interface/TextBasedChannel');

/**
 * Represents a Server Text Channel on Discord.
 * @extends {GuildChannel}
 * @implements {TextBasedChannel}
 */
class TextChannel extends GuildChannel {

  constructor(guild, data) {
    super(guild, data);
    this.store = new TextChannelDataStore();
  }

  _cacheMessage(message) {
    const maxSize = this.client.options.max_message_cache;
    if (maxSize === 0) {
      // saves on performance
      return null;
    }

    const storeKeys = Object.keys(this.store);
    if (storeKeys.length >= maxSize) {
      this.store.remove(storeKeys[0]);
    }

    return this.store.add('messages', message);
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
