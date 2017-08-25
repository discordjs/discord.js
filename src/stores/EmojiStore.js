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
    const guild = this.guild;

    const existing = guild.emojis.get(data.id);
    if (existing) return existing;

    const emoji = new Emoji(guild, data);
    guild.emojis.set(emoji.id, emoji);

    return emoji;
  }
}

module.exports = EmojiStore;
