const Channel = require('./Channel');
const TextBasedChannel = require('./interface/TextBasedChannel');
const Collection = require('../util/Collection');

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
    this.type = 'group';
    this.messages = new Collection();
    this._typing = new Map();
  }

  setup(data) {
    super.setup(data);

    /**
     * The name of this Group DM, can be null if one isn't set.
     * @type {string}
     */
    this.name = data.name;

    /**
     * A hash of the Group DM icon.
     * @type {string}
     */
    this.icon = data.icon;

    /**
     * The user ID of this Group DM's owner.
     * @type {string}
     */
    this.ownerID = data.owner_id;

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

    this.lastMessageID = data.last_message_id;
  }

  /**
   * The owner of this Group DM.
   * @type {User}
   * @readonly
   */
  get owner() {
    return this.client.users.get(this.ownerID);
  }

  /**
   * Whether this channel equals another channel. It compares all properties, so for most operations
   * it is advisable to just compare `channel.id === channel2.id` as it is much faster and is often
   * what most users need.
   * @param {GroupDMChannel} channel Channel to compare with
   * @returns {boolean}
   */
  equals(channel) {
    const equal = channel &&
      this.id === channel.id &&
      this.name === channel.name &&
      this.icon === channel.icon &&
      this.ownerID === channel.ownerID;

    if (equal) {
      return this.recipients.equals(channel.recipients);
    }

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the channel's name instead of the Channel object.
   * @returns {string}
   * @example
   * // logs: Hello from My Group DM!
   * console.log(`Hello from ${channel}!`);
   * @example
   * // logs: Hello from My Group DM!
   * console.log(`Hello from ' + channel + '!');
   */
  toString() {
    return this.name;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  send() { return; }
  sendMessage() { return; }
  sendEmbed() { return; }
  sendFile() { return; }
  sendCode() { return; }
  fetchMessage() { return; }
  fetchMessages() { return; }
  fetchPinnedMessages() { return; }
  startTyping() { return; }
  stopTyping() { return; }
  get typing() { return; }
  get typingCount() { return; }
  createCollector() { return; }
  awaitMessages() { return; }
  bulkDelete() { return; }
  _cacheMessage() { return; }
}

TextBasedChannel.applyToClass(GroupDMChannel, true);

module.exports = GroupDMChannel;
