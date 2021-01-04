'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildBanRemove extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    const user = client.users.add(data.user);
    /**
     * Emitted whenever a member is unbanned from a guild.
     * @event Client#guildBanRemove
     * @param {Guild} guild The guild that the unban occurred in
     * @param {User} user The user that was unbanned
     */
    if (guild && user) {
      let d = guild.bans.cache.get(user.id);
      guild.bans.cache.delete(user.id);
      client.emit(Events.GUILD_BAN_REMOVE, d);
    }
  }
}

module.exports = GuildBanRemove;
