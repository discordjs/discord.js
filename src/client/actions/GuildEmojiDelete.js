const Action = require('./Action');

class GuildEmojiDeleteAction extends Action {
  handle(emoji) {
    const client = this.client;
    client.dataManager.killEmoji(emoji);
    return {
      emoji,
    };
  }
}

/**
 * Emitted whenever an emoji is deleted
 * @event Client#guildEmojiDelete
 * @param {Emoji} emoji The emoji that was deleted.
 */
module.exports = GuildEmojiDeleteAction;
