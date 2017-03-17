const AbstractHandler = require('./AbstractHandler');

class GuildCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.id);
    if (guild) {
      if (!guild.available && !data.unavailable) {
        // A newly available guild
        guild.setup(data);
        this.packetManager.ws.checkIfReady();
      }
    } else {
      // A new guild
      client.dataManager.newGuild(data);
    }
  }
}

module.exports = GuildCreateHandler;
