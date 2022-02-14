'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildRoleDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    let role;

    if (guild) {
      role = guild.roles.cache.get(data.role_id);
      if (role) {
        guild.roles.cache.delete(data.role_id);
        /**
         * Emitted whenever a guild role is deleted.
         * @event Client#roleDelete
         * @param {Role} role The role that was deleted
         */
        client.emit(Events.GuildRoleDelete, role);
      }
    }

    return { role };
  }
}

module.exports = GuildRoleDeleteAction;
