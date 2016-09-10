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
     * The topic of the Text Channel, if there is one.
     * @type {?string}
     */
    this.topic = data.topic;

    this.type = 'text';
    this.lastMessageID = data.last_message_id;
    this._typing = new Map();
  }

  /**
   * A collection of members that can see this channel, mapped by their ID.
   * @returns {Collection<string, GuildMember>}
   * @readonly
   */
  get members() {
    const members = new Collection();
    for (const member of this.guild.members.values()) {
      if (this.permissionsFor(member).hasPermission('READ_MESSAGES')) {
        members.set(member.id, member);
      }
    }
    return members;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  sendMessage() { return; }
  sendTTSMessage() { return; }
  sendFile() { return; }
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

TextBasedChannel.applyToClass(TextChannel, true);

module.exports = TextChannel;
