const AbstractHandler = require('./AbstractHandler');

class GuildEmojiUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    if (!client.guilds.get(data.guild_id)) return;
    const guild = client.guilds.get(data.guild_id);
    client.actions.EmojiUpdate.handle(data, guild);
  }
}

module.exports = GuildEmojiUpdate;
