'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildBanAdd extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);

    /**
     * Emitted whenever a member is banned from a guild.
     * @event Client#guildBanAdd
     * @param {GuildBan} ban The ban that occurred
     */
    if (guild) client.emit(Events.GUILD_BAN_ADD, guild.bans._add(data));
  }
}

module.exports = GuildBanAdd;
