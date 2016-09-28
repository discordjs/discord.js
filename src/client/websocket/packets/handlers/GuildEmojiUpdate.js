const AbstractHandler = require('./AbstractHandler');

class GuildEmojiUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;
    client.actions.EmojiUpdate.handle(data, guild);
  }
}

module.exports = GuildEmojiUpdate;
