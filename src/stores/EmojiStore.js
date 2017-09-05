const DataStore = require('./DataStore');
const Emoji = require('../structures/Emoji');
/**
 * Stores emojis.
 * @private
 * @extends {DataStore}
 */
class EmojiStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable);
    this.guild = guild;
  }

  create(data) {
    const existing = this.get(data.id);
    if (existing) return existing;

    const emoji = new Emoji(this.guild, data);
    this.set(emoji.id, emoji);

    return emoji;
  }
}

module.exports = EmojiStore;
