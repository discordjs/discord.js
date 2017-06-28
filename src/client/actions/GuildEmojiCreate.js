const Action = require('./Action');

class GuildEmojiCreateAction extends Action {
  handle(guild, createdEmoji) {
    return { emoji: guild.emojis.create(createdEmoji) };
  }
}

/**
 * Emitted whenever a custom emoji is created in a guild.
 * @event Client#emojiCreate
 * @param {Emoji} emoji The emoji that was created
 */

module.exports = GuildEmojiCreateAction;
