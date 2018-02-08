const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildEmojiCreateAction extends Action {
  handle(guild, createdEmoji) {
    const emoji = guild.emojis.add(createdEmoji);
    this.client.emit(Events.GUILD_EMOJI_CREATE, emoji);
    return { emoji };
  }
}

/**
 * Emitted whenever a custom emoji is created in a guild.
 * @event Client#emojiCreate
 * @param {GuildEmoji} emoji The emoji that was created
 */

module.exports = GuildEmojiCreateAction;
