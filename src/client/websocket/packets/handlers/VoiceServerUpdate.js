const AbstractHandler = require('./AbstractHandler');

/*
{
    "token": "my_token",
    "guild_id": "41771983423143937",
    "endpoint": "smart.loyal.discord.gg"
}
*/

class VoiceServerUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    if (client.voice.pending.has(data.guild_id)) {
      client.voice._receivedVoiceServer(data.guild_id, data.token, data.endpoint);
    }
  }
}

module.exports = VoiceServerUpdate;
