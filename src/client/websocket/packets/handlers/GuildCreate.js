const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class GuildCreateHandler extends AbstractHandler {
  async handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    let guild = client.guilds.get(data.id);
    if (guild) {
      if (!guild.available && !data.unavailable) {
        // A newly available guild
        guild._patch(data);
        this.packetManager.ws.checkIfReady();
      }
    } else {
      // A new guild
      guild = client.guilds.create(data);
      const emitEvent = client.ws.connection.status === Constants.Status.READY;
      if (emitEvent) {
        /**
         * Emitted whenever the client joins a guild.
         * @event Client#guildCreate
         * @param {Guild} guild The created guild
         */
        if (client.options.fetchAllMembers) await guild.members.fetch();
        client.emit(Constants.Events.GUILD_CREATE, guild);
      }
    }
  }
}

module.exports = GuildCreateHandler;
