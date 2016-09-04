const GuildChannel = require('./GuildChannel');
const TextBasedChannel = require('./interface/TextBasedChannel');
const Collection = require('../util/Collection');

/**
 * Represents a Server Text Channel on Discord.
 * @extends {GuildChannel}
 * @implements {TextBasedChannel}
 */
class TextChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);
    this.messages = new Collection();
  }

  setup(data) {
    super.setup(data);
    /**
     * The ID of the last message in the channel, if one was sent.
     * @type {?string}
     */
    this.lastMessageID = data.last_message_id;
    this.type = 'text';
  }

  sendMessage() {
    return;
  }

  sendTTSMessage() {
    return;
  }

  sendFile() {
    return;
  }

  _cacheMessage() {
    return;
  }

  fetchMessages() {
    return;
  }

  bulkDelete() {
    return;
  }

  startTyping() {
    return;
  }

  stopTyping() {
    return;
  }

  get typing() {
    return;
  }

  get typingCount() {
    return;
  }

  fetchPinnedMessages() {
    return;
  }

  createCollector() {
    return;
  }

  awaitMessages() {
    return;
  }
}

TextBasedChannel.applyToClass(TextChannel, true);

module.exports = TextChannel;
