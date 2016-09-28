const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildEmojiUpdateAction extends Action {
  handle(data, guild) {
    const client = this.client;
    for (let emoji of data.emojis) {
      const already = guild.emojis.has(emoji.id);
      emoji = client.dataManager.newEmoji(emoji, guild);
      if (already) client.emit(Constants.Events.GUILD_EMOJI_UPDATE, guild, emoji);
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
 * @param {Guild} guild The guild that the emoji was updated in.
 * @param {Emoji} emoji The emoji that was updated.
 */
module.exports = GuildEmojiUpdateAction;
