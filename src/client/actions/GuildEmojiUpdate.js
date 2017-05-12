const Action = require('./Action');

class GuildEmojiUpdateAction extends Action {
  handle(oldEmoji, newEmoji) {
    const emoji = this.client.dataManager.updateEmoji(oldEmoji, newEmoji);
    return { emoji };
  }
}

/**
 * Emitted whenever a custom guild emoji is updated.
 * @event Client#emojiUpdate
 * @param {Emoji} oldEmoji The old emoji
 * @param {Emoji} newEmoji The new emoji
 */

module.exports = GuildEmojiUpdateAction;
