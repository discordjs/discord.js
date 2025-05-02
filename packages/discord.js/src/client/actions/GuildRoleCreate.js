'use strict';

const { Events } = require('../../util/Events.js');
const { Action } = require('./Action.js');

class GuildRoleCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    let role;
    if (guild) {
      const already = guild.roles.cache.has(data.role.id);
      role = guild.roles._add(data.role);
      /**
       * Emitted whenever a role is created.
       *
       * @event Client#roleCreate
       * @param {Role} role The role that was created
       */
      if (!already) client.emit(Events.GuildRoleCreate, role);
    }

    return { role };
  }
}

exports.GuildRoleCreateAction = GuildRoleCreateAction;
