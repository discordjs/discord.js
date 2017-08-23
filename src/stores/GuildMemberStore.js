const DataStore = require('./DataStore');
const GuildMember = require('../structures/GuildMember');

class GuildMemberStore extends DataStore {
  constructor(message, iterable) {
    super(message.client, iterable);
    this.message = message;
  }

  create(data) {
    const emojiID = data.emoji.id || decodeURIComponent(data.emoji.name);

    const existing = this.get(data.id);
    if (existing) return existing;

    const reaction = new MessageReaction(this.message, data.emoji, data.count, data.me);
    this.set(emojiID, reaction);

    return reaction;
  }
}

module.exports = ReactionStore;
