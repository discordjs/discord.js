import Channel from './Channel';
import TextBasedChannel from './interfaces/TextBasedChannel';
import MessageStore from '../stores/MessageStore';

/**
 * Represents a direct message channel between two users.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
export default class DMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    this.messages = new MessageStore(this);
    this._typing = new Map();
  }

  _patch(data) {
    super._patch(data);

    /**
     * The recipient on the other end of the DM
     * @type {User}
     */
    this.recipient = this.client.users.create(data.recipients[0]);

    this.lastMessageID = data.last_message_id;
  }

  /**
   * When concatenated with a string, this automatically concatenates the recipient's mention instead of the
   * DM channel object.
   * @returns {string}
   */
  toString() {
    return this.recipient.toString();
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  search() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createMessageCollector() {}
  awaitMessages() {}
  // Doesn't work on DM channels; bulkDelete() {}
  acknowledge() {}
  _cacheMessage() {}
}

TextBasedChannel.applyToClass(DMChannel, true, ['bulkDelete']);
