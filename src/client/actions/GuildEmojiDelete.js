const Action = require('./Action');

class EmojiDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    client.dataManager.killEmoji(data);
    return {
      data,
    };
  }
}

/**
 * Emitted whenever an emoji is deleted
 * @event Client#guildEmojiDelete
 * @param {Emoji} emoji The emoji that was deleted.
 */
module.exports = EmojiDeleteAction;
