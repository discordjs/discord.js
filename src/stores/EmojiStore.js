const DataStore = require('./DataStore');
const Emoji = require('../structures/Emoji');
/**
 * Stores emojis.
 * @private
 * @extends {DataStore}
 */
class EmojiStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, Emoji);
    this.guild = guild;
  }
}

module.exports = EmojiStore;
