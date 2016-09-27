const Action = require('./Action');

class EmojiCreateAction extends Action {
  handle(data, guild) {
    const client = this.client;
    const emoji = client.dataManager.newEmoji(data, guild);
    return {
      emoji,
    };
  }
}

/**
 * Emitted whenever an emoji is created
 * @event Client#guildEmojiCreate
 * @param {Emoji} emoji The emoji that was created.
 */
module.exports = EmojiCreateAction;
