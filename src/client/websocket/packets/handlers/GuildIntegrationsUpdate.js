const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../../util/Constants');

class GuildIntegrationsHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (guild) client.emit(Events.GUILD_INTEGRATIONS_UPDATE, guild);
  }
}

module.exports = GuildIntegrationsHandler;

/**
 * Emitted whenever a guild integration is updated
 * @event Client#guildIntegrationsUpdate
 * @param {Guild} guild The guild whose integrations were updated
 */
