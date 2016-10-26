const Action = require('./Action');

class GuildEmojiUpdateAction extends Action {
  handle(data, guild) {
    const client = this.client;
    for (let emoji of data.emojis) {
      const already = guild.emojis.has(emoji.id);
      if (already) {
        client.dataManager.updateEmoji(guild.emojis.get(emoji.id), emoji);
      } else {
        emoji = client.dataManager.newEmoji(emoji, guild);
      }
    }
    for (let emoji of guild.emojis) {
      if (!data.emoijs.has(emoji.id)) client.dataManager.killEmoji(emoji);
    }
    return {
      emojis: data.emojis,
    };
  }
}

/**
 * Emitted whenever an emoji is updated
 * @event Client#guildEmojiUpdate
 * @param {Emoji} oldEmoji The old emoji
 * @param {Emoji} newEmoji The new emoji
 */
module.exports = GuildEmojiUpdateAction;
