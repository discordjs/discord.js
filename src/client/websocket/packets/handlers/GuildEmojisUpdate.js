const AbstractHandler = require('./AbstractHandler');

function mappify(iterable) {
  const map = new Map();
  for (const x of iterable) map.set(...x);
  return map;
}

class GuildEmojisUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (!guild || !guild.emojis) return;

    const deletions = mappify(guild.emojis.entries());

    for (const emoji of data.emojis) {
      // Determine type of emoji event
      const cachedEmoji = guild.emojis.get(emoji.id);
      if (cachedEmoji) {
        deletions.delete(emoji.id);
        if (!cachedEmoji.equals(emoji, true)) {
          // Emoji updated
          client.actions.GuildEmojiUpdate.handle(cachedEmoji, emoji);
        }
      } else {
        // Emoji added
        client.actions.GuildEmojiCreate.handle(guild, emoji);
      }
    }

    for (const emoji of deletions.values()) {
      // Emoji deleted
      client.actions.GuildEmojiDelete.handle(emoji);
    }
  }
}

module.exports = GuildEmojisUpdate;
