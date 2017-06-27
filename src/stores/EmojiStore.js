const DataStore = require('./DataStore');
const Emoji = require('../structures/Emoji');
const Constants = require('../util/Constants');

class EmojiStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable);
    this.guild = guild;
  }

  create(data, emitEvent = true) {
    super.create();
    const guild = this.guild;

    const existing = guild.emojis.get(data.id);
    if (existing) return existing;

    const emoji = new Emoji(guild, data);
    guild.emojis.set(emoji.id, emoji);

    if (emitEvent && emoji) {
      this.client.emit(Constants.Events.GUILD_EMOJI_CREATE, emoji);
    }
    return emoji;
  }

  remove(id, emitEvent = true) {
    super.remove();
    const emoji = this.get(id);
    this.delete(id);
    if (emitEvent && emoji) {
      this.client.emit(Constants.Events.GUILD_EMOJI_DELETE, emoji);
    }
  }
}

module.exports = EmojiStore;
