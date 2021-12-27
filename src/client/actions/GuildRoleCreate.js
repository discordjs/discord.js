'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildRoleCreate extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    let role;
    if (guild) {
      const already = guild.roles.cache.has(data.role.id);
      role = guild.roles._add(data.role);
      /**
       * Emitted whenever a role is created.
       * @event Client#roleCreate
       * @param {Role} role The role that was created
       */
      if (!already) client.emit(Events.GUILD_ROLE_CREATE, role);
    }
    return { role };
  }
}

module.exports = GuildRoleCreate;
