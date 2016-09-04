const Channel = require('./Channel');
const TextBasedChannel = require('./interface/TextBasedChannel');
const Collection = require('../util/Collection');
const arraysEqual = require('../util/ArraysEqual');

/*
{ type: 3,
  recipients:
   [ { username: 'Charlie',
       id: '123',
       discriminator: '6631',
       avatar: '123' },
     { username: 'Ben',
       id: '123',
       discriminator: '2055',
       avatar: '123' },
     { username: 'Adam',
       id: '123',
       discriminator: '2406',
       avatar: '123' } ],
  owner_id: '123',
  name: null,
  last_message_id: '123',
  id: '123',
  icon: null }
*/

/**
 * Represents a Group DM on Discord
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class GroupDMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    this.messages = new Collection();
  }

  equals(other) {
    const equal = other &&
      this.id === other.id &&
      this.name === other.name &&
      this.icon === other.icon &&
      this.owner.id === other.owner_id;

    if (equal) {
      const thisIDs = this.recipients.array().map(r => r.id);
      const otherIDs = other.recipients.map(r => r.id);
      return arraysEqual(thisIDs, otherIDs);
    }

    return equal;
  }

  setup(data) {
    super.setup(data);

    if (!this.recipients) {
      /**
       * A collection of the recipients of this DM, mapped by their ID.
       * @type {Collection<string, User>}
       */
      this.recipients = new Collection();
    }

    if (data.recipients) {
      for (const recipient of data.recipients) {
        const user = this.client.dataManager.newUser(recipient);
        this.recipients.set(user.id, user);
      }
    }

    /**
     * The name of this Group DM, can be null if one isn't set.
     * @type {string}
     */
    this.name = data.name;
    /**
     * The ID of this Group DM Channel.
     * @type {string}
     */
    this.id = data.id;
    /**
     * A hash of the Group DM icon.
     * @type {string}
     */
    this.icon = data.icon;
    /**
     * The ID of the last message in the channel, if one was sent.
     * @type {?string}
     */
    this.lastMessageID = data.last_message_id;
    /**
     * The owner of this Group DM.
     * @type {User}
     */
    this.owner = this.client.users.get(data.owner_id);
    this.type = 'group';
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

TextBasedChannel.applyToClass(GroupDMChannel, true);

module.exports = GroupDMChannel;
