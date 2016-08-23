const Channel = require('./Channel');
const TextBasedChannel = require('./interface/TextBasedChannel');
const User = require('./User');
const Collection = require('../util/Collection');

/**
 * Represents a Direct Message Channel between two users.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class DMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    this.messages = new Collection();
  }

  setup(data) {
    super.setup(data);
    const recipient = this.client.users.get(data.recipients[0].id) || new User(this.client, data.recipients[0]);
    /**
     * The recipient on the other end of the DM
     * @type {User}
     */
    this.recipient = recipient;
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

  _cacheMessage() {
    return;
  }
}

TextBasedChannel.applyToClass(DMChannel, true);

module.exports = DMChannel;
