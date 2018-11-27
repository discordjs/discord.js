const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildIntegrationsUpdate extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    /**
     * Emitted whenever a guild integration is updated
     * @event Client#guildIntegrationsUpdate
     * @param {Guild} guild The guild whose integrations were updated
     */
    if (guild) client.emit(Events.GUILD_INTEGRATIONS_UPDATE, guild);
  }
}

module.exports = GuildIntegrationsUpdate;

