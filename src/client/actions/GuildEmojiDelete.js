const Action = require('./Action');

class GuildEmojiDeleteAction extends Action {
  handle(emoji) {
    const client = this.client;
    client.dataManager.killEmoji(emoji);
    return { emoji };
  }
}

/**
 * Emitted whenever a custom guild emoji is deleted.
 * @event Client#emojiDelete
 * @param {Emoji} emoji The emoji that was deleted
 */

module.exports = GuildEmojiDeleteAction;
