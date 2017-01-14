const AbstractHandler = require('./AbstractHandler');

class GuildCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    data.shardID = packet.shardID;

    const guild = client.guilds.get(data.id);
    if (guild) {
      if (!guild.available && !data.unavailable) {
        // a newly available guild
        guild.setup(data);
        client.ws.managers.get(packet.shardID).checkIfReady();
      }
    } else {
      // a new guild
      client.dataManager.newGuild(data);
    }
  }
}

module.exports = GuildCreateHandler;
