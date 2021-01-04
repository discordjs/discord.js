'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildBanAdd extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    const user = client.users.add(data.user);

    /**
     * Emitted whenever a member is banned from a guild.
     * @event Client#guildBanAdd
     * @param {GuildBan} guild The guild that the ban occurred in
     */
    if (guild && user) {
      let d = guild.bans.add({ user: user, reason: data.reason });
      client.emit(Events.GUILD_BAN_ADD, d);
    }
  }
}

module.exports = GuildBanAdd;
