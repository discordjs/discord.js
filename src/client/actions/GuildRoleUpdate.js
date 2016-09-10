const Action = require('./Action');
const Constants = require('../../util/Constants');
const cloneObject = require('../../util/CloneObject');

class GuildRoleUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const roleData = data.role;
      let oldRole = null;

      const role = guild.roles.get(roleData.id);
      if (role && !role.equals(roleData)) {
        oldRole = cloneObject(role);
        role.setup(data.role);
        client.emit(Constants.Events.GUILD_ROLE_UPDATE, guild, oldRole, role);
      }

      return {
        old: oldRole,
        updated: role,
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
 * @event Client#guildRoleUpdate
 * @param {Guild} guild The guild that the role was updated in.
 * @param {Role} oldRole The role before the update.
 * @param {Role} newRole The role after the update.
 */

module.exports = GuildRoleUpdateAction;
