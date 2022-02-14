'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildIntegrationsUpdate extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    /**
     * Emitted whenever a guild integration is updated
     * @event Client#guildIntegrationsUpdate
     * @param {Guild} guild The guild whose integrations were updated
     */
    if (guild) client.emit(Events.GuildIntegrationsUpdate, guild);
  }
}

module.exports = GuildIntegrationsUpdate;
