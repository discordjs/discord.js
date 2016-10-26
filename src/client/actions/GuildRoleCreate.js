const Action = require('./Action');
const Constants = require('../../util/Constants');
const Role = require('../../structures/Role');

class GuildRoleCreate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const already = guild.roles.has(data.role.id);
      const role = new Role(guild, data.role);
      guild.roles.set(role.id, role);
      if (!already) client.emit(Constants.Events.GUILD_ROLE_CREATE, role);
      return {
        role,
      };
    }

    return {
      role: null,
    };
  }
}

/**
 * Emitted whenever a role is created.
 * @event Client#roleCreate
 * @param {Role} role The role that was created.
 */

module.exports = GuildRoleCreate;
