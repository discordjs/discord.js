const Channel = require('./Channel');
const TextBasedChannel = require('./interface/TextBasedChannel');
const User = require('./User');
const TextChannelDataStore = require('./datastore/TextChannelDataStore');

/**
 * Represents a Direct Message Channel between two users.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class DMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    this.store = new TextChannelDataStore();
  }

  _cacheMessage(message) {
    const maxSize = this.client.options.max_message_cache;
    if (maxSize === 0) {
      // saves on performance
      return;
    }

    const storeKeys = Object.keys(this.store);
    if (storeKeys.length >= maxSize) {
      this.store.remove(storeKeys[0]);
    }

    this.store.add('messages', message);
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
