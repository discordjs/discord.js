const Action = require('./Action');
const Constants = require('../../util/Constants');
const Role = require('../../structures/Role');

class GuildRoleUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const role = guild.roles.get(data.role.id);
      if (role) {
        const newRole = new Role(guild, data.role);
        client.emit(Constants.Events.GUILD_ROLE_UPDATE, role, newRole);
        guild.roles.set(newRole.id, newRole);
        return {
          old: role,
          updated: newRole,
        };
      }

      return {
        old: null,
        updated: null,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a guild role is updated.
 * @event Client#roleUpdate
 * @param {Role} oldRole The role before the update.
 * @param {Role} newRole The role after the update.
 */

module.exports = GuildRoleUpdateAction;
