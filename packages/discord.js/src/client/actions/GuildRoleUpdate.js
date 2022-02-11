'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildRoleUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      let old = null;

      const role = guild.roles.cache.get(data.role.id);
      if (role) {
        old = role._update(data.role);
        /**
         * Emitted whenever a guild role is updated.
         * @event Client#roleUpdate
         * @param {Role} oldRole The role before the update
         * @param {Role} newRole The role after the update
         */
        client.emit(Events.GuildRoleUpdate, old, role);
      }

      return {
        old,
        updated: role,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = GuildRoleUpdateAction;
