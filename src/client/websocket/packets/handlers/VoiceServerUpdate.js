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
    client.emit('self.voiceServer', data);
  }
}

module.exports = VoiceServerUpdate;
