const Channel = require('./Channel');
const TextBasedChannel = require('./interface/TextBasedChannel');
const User = require('./User');

/**
 * Represents a Direct Message Channel between two users.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class DMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
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

  setup(data) {
    super.setup(data);
    /**
     * The recipient on the other end of the DM
     * @type {User}
     */
    this.recipient = this.client.store.add('users', new User(this.client, data.recipients[0]));
    /**
     * The ID of the last sent message, if available
     * @type {?String}
     */
    this.lastMessageID = data.last_message_id;
  }

  /**
   * When concatenated with a String, this automatically concatenates the recipient's mention instead of the
   * DM channel object.
   * @returns {String}
   */
  toString() {
    return this.recipient.toString();
  }

  sendMessage() {
    return;
  }

  sendTTSMessage() {
    return;
  }
}

TextBasedChannel.applyToClass(DMChannel);

module.exports = DMChannel;
