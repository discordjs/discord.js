const Action = require('./Action');

class GuildEmojiCreateAction extends Action {
  handle(guild, createdEmoji) {
    const client = this.client;
    const emoji = client.dataManager.newEmoji(createdEmoji, guild);
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
module.exports = GuildEmojiCreateAction;
