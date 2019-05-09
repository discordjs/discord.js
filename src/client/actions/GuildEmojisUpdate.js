'use strict';

const Action = require('./Action');

class GuildEmojisUpdateAction extends Action {
  handle(data) {
    const guild = this.client.guilds.get(data.guild_id);
    if (!guild || !guild.emojis) return;

    const deletions = new Map(guild.emojis);

    for (const emoji of data.emojis) {
      // Determine type of emoji event
      const cachedEmoji = guild.emojis.get(emoji.id);
      if (cachedEmoji) {
        deletions.delete(emoji.id);
        if (!cachedEmoji.equals(emoji)) {
          // Emoji updated
          this.client.actions.GuildEmojiUpdate.handle(cachedEmoji, emoji);
        }
      } else {
        // Emoji added
        this.client.actions.GuildEmojiCreate.handle(guild, emoji);
      }
    }

    for (const emoji of deletions.values()) {
      // Emoji deleted
      this.client.actions.GuildEmojiDelete.handle(emoji);
    }
  }
}

module.exports = GuildEmojisUpdateAction;
