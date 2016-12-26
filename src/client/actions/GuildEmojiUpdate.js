const Action = require('./Action');

class GuildEmojiUpdateAction extends Action {
  handle(oldEmoji, newEmoji) {
    this.client.dataManager.updateEmoji(oldEmoji, newEmoji);
  }
}

/**
 * Emitted whenever an emoji is updated
 * @event Client#guildEmojiUpdate
 * @param {Emoji} oldEmoji The old emoji
 * @param {Emoji} newEmoji The new emoji
 */
module.exports = GuildEmojiUpdateAction;
